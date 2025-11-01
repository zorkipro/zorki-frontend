import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/contexts/SessionContext";
import { LoadingSpinner } from "@/ui-kit/components";

/**
 * Компонент для обработки редиректа после авторизации
 * Должен быть размещен внутри Router контекста
 */
export const AuthRedirectHandler = () => {
  const navigate = useNavigate();
  const { user, loading, determineRedirectPath } = useSession();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (!user) {
      hasRedirectedRef.current = false;
      return;
    }

    if (loading || hasRedirectedRef.current) return;

    const handleAuthRedirect = async () => {
      hasRedirectedRef.current = true;
      try {
        const redirectPath = await determineRedirectPath();
        navigate(redirectPath);
      } catch (error) {
        navigate('/');
      }
    };

    handleAuthRedirect();
  }, [user, loading, determineRedirectPath, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return null;
};
