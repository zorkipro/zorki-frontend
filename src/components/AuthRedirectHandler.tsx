import { useEffect, useRef, useState } from "react";
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
  const [isDeterminingRedirect, setIsDeterminingRedirect] = useState(false);

  useEffect(() => {
    const handleAuthRedirect = async () => {
      // Если пользователь авторизован и еще не делали редирект
      if (user && !loading && !hasRedirectedRef.current) {
        if (import.meta.env.DEV) {
          console.log('🔄 AuthRedirectHandler: User authenticated, determining redirect path...');
        }
        
        setIsDeterminingRedirect(true);
        hasRedirectedRef.current = true;
        
        try {
          const redirectPath = await determineRedirectPath();
          
          if (import.meta.env.DEV) {
            console.log('🔄 AuthRedirectHandler: Redirecting to:', redirectPath);
          }
          
          navigate(redirectPath);
        } catch (error) {
          if (import.meta.env.DEV) {
            console.log('❌ AuthRedirectHandler: Failed to determine redirect path:', error);
          }
          // В случае ошибки редиректим на главную
          navigate('/');
        } finally {
          setIsDeterminingRedirect(false);
        }
      }
    };

    handleAuthRedirect();
  }, [user, loading, determineRedirectPath, navigate]);

  // Сбрасываем флаг при выходе пользователя
  useEffect(() => {
    if (!user) {
      hasRedirectedRef.current = false;
      setIsDeterminingRedirect(false);
    }
  }, [user]);

  // Показываем лоадинг пока загружается сессия или определяем куда редиректить
  if (loading || isDeterminingRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Этот компонент не рендерит ничего в обычном состоянии
  return null;
};
