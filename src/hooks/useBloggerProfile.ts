import { useState, useEffect, useCallback } from 'react';
import { Blogger } from '@/types/blogger';
import { getAllBloggers, getBloggerById } from '@/api/endpoints/blogger';
import { mapApiListBloggerToLocal, mapApiDetailBloggerToLocal } from '@/utils/api/mappers';
import { useErrorHandler } from '@/utils/errorHandler';
import { logError } from '@/utils/logger';
import { useBlogger } from '@/contexts/BloggerContext';
import { normalizeUsername } from '@/utils/username';

/**
 * Hook for loading blogger profile data by username
 * Used in BloggerProfile page to fetch detailed blogger information
 */
export const useBloggerProfile = (username?: string) => {
  const { handleError } = useErrorHandler({
    showNotifications: true,
  });
  const { bloggerInfo } = useBlogger();

  const [blogger, setBlogger] = useState<Blogger | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBloggerProfile = useCallback(async () => {
    if (!username) {
      setError('Username не указан');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Нормализуем username - убираем @ если есть
      const normalizedUsername = normalizeUsername(username);

      // Сначала ищем блогера по username в списке
      const searchResponse = await getAllBloggers({
        username: normalizedUsername,
        page: 1,
        size: 1,
      });

      if (!searchResponse.items || searchResponse.items.length === 0) {
        setError('Блогер не найден');
        return;
      }

      const bloggerData = searchResponse.items[0];

      // Получаем детальную информацию о блогере по ID
      const detailedResponse = await getBloggerById(bloggerData.id);

      // Преобразуем данные в локальный формат
      const transformedBlogger = mapApiDetailBloggerToLocal(detailedResponse);

      setBlogger(transformedBlogger);
    } catch (err: unknown) {
      logError('Error fetching blogger profile:', err);

      const processedError = handleError(err, {
        showNotification: true,
        logError: true,
      });

      setError(processedError.message);
    } finally {
      setLoading(false);
    }
  }, [username, handleError]);

  useEffect(() => {
    fetchBloggerProfile();
  }, [fetchBloggerProfile]);

  // Автоматически обновляем профиль при изменении bloggerInfo (например, после редактирования)
  useEffect(() => {
    if (bloggerInfo && username && bloggerInfo.username === username) {
      fetchBloggerProfile();
    }
  }, [bloggerInfo, username, fetchBloggerProfile]);

  return {
    blogger,
    loading,
    error,
    refetch: fetchBloggerProfile,
  };
};
