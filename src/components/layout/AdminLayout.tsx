import {ProtectedRoute} from "@/components/ProtectedRoute";
import {AdminAuthProvider} from "@/contexts/AdminAuthContext";
import {Outlet} from "react-router-dom";

export const AdminLayout = () => (
    <AdminAuthProvider>
        <ProtectedRoute>
            <Outlet />
        </ProtectedRoute>
    </AdminAuthProvider>
);

// interface AdminLayoutProps {
//     children: ReactNode;
// }
//
// export const AdminLayout = ({ children }: AdminLayoutProps) => {
//     return (
//         <AdminAuthProvider>
//             <ProtectedRoute>{children}</ProtectedRoute>
//         </AdminAuthProvider>
//     );
// };
