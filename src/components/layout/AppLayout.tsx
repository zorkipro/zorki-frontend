import { ReactNode, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider, Toaster } from "@/ui-kit";
import { AuthRedirectHandler } from "@/components/AuthRedirectHandler";
import { ProfileChecker } from "@/components/ProfileChecker";
import { LoadingSpinner } from "@/ui-kit/components";

interface AppLayoutProps {
    children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <TooltipProvider>
                    <Toaster />
                    <BrowserRouter
                        future={{
                            v7_startTransition: true,
                            v7_relativeSplatPath: true,
                        }}
                    >
                        <AuthRedirectHandler />
                        <ProfileChecker>
                            <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                                {children}
                            </Suspense>
                        </ProfileChecker>
                    </BrowserRouter>
                </TooltipProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
};
