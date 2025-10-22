import { ReactNode } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";

interface AdminLayoutProps {
    children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
    return (
        <AdminAuthProvider>
            <ProtectedRoute>{children}</ProtectedRoute>
        </AdminAuthProvider>
    );
};
