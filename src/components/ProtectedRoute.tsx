import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { LoadingScreen } from "./LoadingScreen";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { adminInfo, loading: adminLoading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Вычисляем один раз
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminAuthPage =
    location.pathname === "/admin/login" || location.pathname === "/admin/2fa";

  useEffect(() => {
    if (isAdminRoute) {
      // Для админки используем AdminAuthContext
      if (!adminLoading && !adminInfo && !isAdminAuthPage) {
        navigate("/admin/login");
      }
      return;
    }

    // Для обычных защищенных маршрутов используем проверку Supabase
    if (!loading && !user) {
      navigate("/login");
    }
  }, [
    user,
    loading,
    adminInfo,
    adminLoading,
    navigate,
    location,
    isAdminRoute,
    isAdminAuthPage,
  ]);

  if (isAdminRoute) {
    // Для админки используем AdminAuthContext
    if (isAdminAuthPage) {
      // Страницы логина и 2FA админки доступны всем
      return <>{children}</>;
    }

    // Для других страниц админки проверяем авторизацию через контекст
    if (adminLoading) {
      return <LoadingScreen text="Загрузка админ панели..." />;
    }

    if (!adminInfo) {
      return null;
    }
  } else {
    // Для обычных маршрутов проверяем пользователя Supabase
    if (loading) {
      return <LoadingScreen text="Загрузка..." />;
    }

    if (!user) {
      return null;
    }
  }

  return <>{children}</>;
};
