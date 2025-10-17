import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  checkProfileRedirect,
  isOnModeration,
  validateBloggerInfo,
} from '@/utils/profile-navigation';
import { AUTH_PAGES } from '@/config/routes';
import { logger } from '@/utils/logger';
import { LoadingScreen } from './LoadingScreen';

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
      console.log('🔍 ProfileChecker performProfileCheck:', {
        pathname: location.pathname,
        hasChecked: hasCheckedRef.current,
        user: user?.id,
        loading,
        bloggerInfoLoading,
        bloggerInfo: bloggerInfo ? {
          id: bloggerInfo.id,
          username: bloggerInfo.username,
          verificationStatus: bloggerInfo.verificationStatus,
        } : null,
      });

      // Пропускаем проверку на auth страницах
      if (AUTH_PAGES.some((page) => location.pathname === page)) {
        console.log('⏭️ On auth page, skipping check');
        return;
      }

      // Если нет пользователя - ничего не делаем
      if (!user) {
        console.log('⏭️ No user, skipping check');
        return;
      }

      // ВАЖНО: Ждем пока загрузятся данные
      if (loading || bloggerInfoLoading) {
        console.log('⏭️ Still loading, skipping check');
        return; // НЕ запускаем проверку
      }

      // КРИТИЧНО: Если user есть, но bloggerInfo null и загрузка не началась
      // это значит BloggerProvider еще не отреагировал - ЖДЕМ
      if (user && !bloggerInfo && !bloggerInfoLoading) {
        console.log('⏭️ User exists but bloggerInfo is null and not loading, waiting...');
        return; // ЖДЕМ пока BloggerProvider начнет загрузку
      }

      // Если уже проверяли - не проверяем повторно
      if (hasCheckedRef.current) {
        console.log('⏭️ Already checked, skipping');
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
          bloggerInfoLoading
        );

        console.log('🔍 Redirect check result:', { redirectPath });

        if (redirectPath) {
          console.log('🔄 Redirecting to:', redirectPath);
          navigate(redirectPath);
          hasCheckedRef.current = true;
          return;
        }

        // Данные проверены успешно
        console.log('✅ Profile check completed successfully');
        hasCheckedRef.current = true;
      } catch (error) {
        console.error('❌ Error in profile check:', error);
        logger.error('Error in profile check', error, {
          component: 'ProfileChecker',
          pathname: location.pathname,
        });
        // В случае ошибки тоже помечаем что проверку сделали
        hasCheckedRef.current = true;
      }
    };

    performProfileCheck();
  }, [user, loading, bloggerInfoLoading, bloggerInfo, navigate, location.pathname]);

  // Показываем loader пока загружаются данные
  if (loading || bloggerInfoLoading) {
    return <LoadingScreen text="Загрузка профиля..." />;
  }

  return <>{children}</>;
};
