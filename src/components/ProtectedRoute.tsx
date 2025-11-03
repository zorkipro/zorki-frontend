import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { adminInfo, loading: adminLoading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminAuthPage = location.pathname === "/admin/login" || location.pathname === "/admin/2fa";

  useEffect(() => {
    if (isAdminRoute && !adminLoading && !adminInfo && !isAdminAuthPage) {
      navigate("/admin/login");
    } else if (!isAdminRoute && !loading && !user) {
      navigate("/login");
    }
  }, [user, loading, adminInfo, adminLoading, navigate, location.pathname, isAdminRoute, isAdminAuthPage]);

  if (isAdminRoute) {
    if (isAdminAuthPage) return <>{children}</>;
    if (adminLoading || !adminInfo) return null;
  } else {
    if (loading || !user) return null;
  }

  return <>{children}</>;
};
