import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@/contexts/SessionContext";
import { useBlogger } from "@/contexts/BloggerContext";
import { LoadingSpinner } from "@/ui-kit/components";
import { AUTH_PAGES } from "@/config/routes";

/**
 * Компонент для обработки редиректа после авторизации
 * Должен быть размещен внутри Router контекста
 */
export const AuthRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, determineRedirectPath } = useSession();
  const { bloggerInfoLoading } = useBlogger();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (!user) {
      hasRedirectedRef.current = false;
      return;
    }

    // Ждем завершения загрузки сессии и данных блогера
    if (loading || bloggerInfoLoading || hasRedirectedRef.current) return;

    // Если пользователь авторизован и находится на странице авторизации - редиректим
    // Если пользователь авторизован и НЕ на странице авторизации - проверяем, нужен ли редирект
    const isOnAuthPage = AUTH_PAGES.some((page) => location.pathname === page);
    
    // Если не на странице авторизации и уже редиректили - не делаем повторный редирект
    if (!isOnAuthPage && hasRedirectedRef.current) {
      return;
    }

    const handleAuthRedirect = async () => {
      hasRedirectedRef.current = true;
      try {
        const redirectPath = await determineRedirectPath();
        // Не редиректим, если уже на правильной странице
        if (location.pathname !== redirectPath) {
          navigate(redirectPath);
        }
      } catch (error) {
        console.error("Error determining redirect path:", error);
        if (location.pathname !== '/profile-setup') {
          navigate('/profile-setup');
        }
      }
    };

    handleAuthRedirect();
  }, [user, loading, bloggerInfoLoading, determineRedirectPath, navigate, location.pathname]);

  if (loading || bloggerInfoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return null;
};
