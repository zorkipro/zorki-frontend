import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  checkProfileRedirect,
  isOnModeration,
  validateBloggerInfo,
} from "@/utils/profile-navigation";
import { AUTH_PAGES } from "@/config/routes";

// Страницы, которые требуют наличия блогера с username
const BLOGGER_REQUIRED_PAGES = ['/profile', '/profile/edit'];

interface ProfileCheckerProps {
  children: React.ReactNode;
}

export const ProfileChecker = ({ children }: ProfileCheckerProps) => {
  const { user, loading, bloggerInfo, bloggerInfoLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasCheckedRef = useRef(false);

  // Сбрасываем состояние при смене пользователя
  useEffect(() => {
    hasCheckedRef.current = false;
  }, [user?.id]);

  useEffect(() => {
    const performProfileCheck = async () => {
      // Пропускаем проверку на auth страницах
      if (AUTH_PAGES.some((page) => location.pathname === page)) {
        if (import.meta.env.DEV) {
          console.log('🔄 ProfileChecker: Skipping check on auth page:', location.pathname);
        }
        return;
      }

      // Если нет пользователя - ничего не делаем
      if (!user) {
        if (import.meta.env.DEV) {
          console.log('🔄 ProfileChecker: No user, skipping check');
        }
        return;
      }

      // ВАЖНО: Ждем пока загрузятся данные
      if (loading || bloggerInfoLoading) {
        if (import.meta.env.DEV) {
          console.log('🔄 ProfileChecker: Still loading, skipping check');
        }
        return; // НЕ запускаем проверку
      }

      // НОВАЯ ЛОГИКА: Проверяем bloggerInfo только для страниц, которые требуют наличия блогера
      const isBloggerPage = BLOGGER_REQUIRED_PAGES.some(page => location.pathname.startsWith(page));
      
      if (isBloggerPage) {
        // Для страниц блогера проверяем наличие данных блогера
        // НЕ загружаем данные здесь - это делает SessionContext
        
        // Если данные все еще не загружены - ждем
        if (!bloggerInfo) {
          if (import.meta.env.DEV) {
            console.log('🔄 ProfileChecker: Blogger page - waiting for blogger info...');
          }
          return;
        }
        
        // Проверяем наличие username у блогера
        if (!bloggerInfo.username) {
          if (import.meta.env.DEV) {
            console.log('🔄 ProfileChecker: Blogger has no username, redirecting to setup');
          }
          navigate('/profile-setup');
          hasCheckedRef.current = true;
          return;
        }
        
        // Если есть username - все в порядке
        if (import.meta.env.DEV) {
          console.log('✅ ProfileChecker: Blogger has username, access granted');
        }
      } else {
        // Для остальных страниц (главная, публичные страницы) bloggerInfo не обязателен
        if (import.meta.env.DEV) {
          console.log('🔄 ProfileChecker: Non-blogger page, blogger info not required');
        }
      }

      // Если уже проверяли - не проверяем повторно
      if (hasCheckedRef.current) {
        if (import.meta.env.DEV) {
          console.log('🔄 ProfileChecker: Already checked, skipping');
        }
        return;
      }

      if (import.meta.env.DEV) {
        console.log('🔄 ProfileChecker: Performing profile check...');
      }
      
      // Данные загружены, выполняем проверку
      try {
        // Проверяем, требуется ли редирект
        const redirectPath = checkProfileRedirect(
          location.pathname,
          user,
          loading,
          bloggerInfo,
          bloggerInfoLoading,
        );

        if (redirectPath) {
          if (import.meta.env.DEV) {
            console.log('🔄 ProfileChecker: Redirecting to:', redirectPath);
          }
          navigate(redirectPath);
          hasCheckedRef.current = true;
          return;
        }

        // Данные проверены успешно
        if (import.meta.env.DEV) {
          console.log('🔄 ProfileChecker: Profile check completed successfully');
        }
        hasCheckedRef.current = true;
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('🔄 ProfileChecker: Error during profile check:', error);
        }
        // В случае ошибки тоже помечаем что проверку сделали
        hasCheckedRef.current = true;
      }
    };

    performProfileCheck();
  }, [
    user,
    loading,
    bloggerInfoLoading,
    bloggerInfo,
    navigate,
    location.pathname,
  ]);

  return <>{children}</>;
};
