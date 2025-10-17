import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientBloggerInfo } from '@/api/types';

interface UseDashboardNavigationProps {
  user: { id: string; email: string } | null;
  userBlogger: ClientBloggerInfo | null;
  bloggerInfoLoading: boolean;
}

/**
 * Хук для управления навигацией в Dashboard
 * Выносит сложную логику редиректов из компонента
 */
export const useDashboardNavigation = ({
  user,
  userBlogger,
  bloggerInfoLoading,
}: UseDashboardNavigationProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || bloggerInfoLoading) return;

    if (userBlogger) {
      // Проверяем, заполнена ли информация о блогере
      const isProfileComplete = userBlogger.name && userBlogger.lastName;

      if (!isProfileComplete) {
        // Если профиль не заполнен, перенаправляем на редактирование
        navigate('/profile/edit');
        return;
      }

      if (userBlogger.verificationStatus === 'APPROVED') {
        // Блогер одобрен - остаемся на дашборде
        return;
      } else if (userBlogger.verificationStatus === 'MODERATION') {
        // Блогер на рассмотрении - остаемся на дашборде
        return;
      } else if (userBlogger.verificationStatus === 'REJECTED') {
        // Блогер отклонен - перенаправляем на настройку профиля
        navigate('/profile-setup');
        return;
      }
    } else {
      // Нет связанного блогера - перенаправляем на настройку профиля
      navigate('/profile-setup');
    }
  }, [user, userBlogger, bloggerInfoLoading, navigate]);
};
