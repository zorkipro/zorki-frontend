import { ReactNode, Suspense } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoadingSpinner } from "@/ui-kit/components";

interface PrivateLayoutProps {
    children: ReactNode;
}

export const PrivateLayout = ({ children }: PrivateLayoutProps) => {
    return (
        <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner text="Загрузка страницы..." />}>
                {children}
            </Suspense>
        </ProtectedRoute>
    );
};
