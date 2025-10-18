import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  checkProfileRedirect,
  isOnModeration,
  validateBloggerInfo,
} from "@/utils/profile-navigation";
import { AUTH_PAGES } from "@/config/routes";
import { LoadingScreen } from "./LoadingScreen";

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
        return;
      }

      // Если нет пользователя - ничего не делаем
      if (!user) {
        return;
      }

      // ВАЖНО: Ждем пока загрузятся данные
      if (loading || bloggerInfoLoading) {
        return; // НЕ запускаем проверку
      }

      // КРИТИЧНО: Если user есть, но bloggerInfo null и загрузка не началась
      // это значит BloggerProvider еще не отреагировал - ЖДЕМ
      if (user && !bloggerInfo && !bloggerInfoLoading) {
        return; // ЖДЕМ пока BloggerProvider начнет загрузку
      }

      // Если уже проверяли - не проверяем повторно
      if (hasCheckedRef.current) {
        return;
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
          navigate(redirectPath);
          hasCheckedRef.current = true;
          return;
        }

        // Данные проверены успешно
        hasCheckedRef.current = true;
      } catch (error) {
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

  // Показываем loader пока загружаются данные
  if (loading || bloggerInfoLoading) {
    return <LoadingScreen text="Загрузка профиля..." />;
  }

  return <>{children}</>;
};
