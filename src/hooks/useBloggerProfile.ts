import { useState, useEffect, useCallback, useRef } from "react";
import { Blogger } from "@/types/blogger";
import { getAllBloggers, getBloggerById } from "@/api/endpoints/blogger";
import {
  mapApiListBloggerToLocal,
  mapApiDetailBloggerToLocal,
} from "@/utils/api/mappers";
import { useErrorHandler } from "@/utils/errorHandler";
import { logError } from "@/utils/logger";
import { normalizeUsername } from "@/utils/username";

/**
 * Hook for loading blogger profile data by username
 * Used in BloggerProfile page to fetch detailed blogger information
 */
export const useBloggerProfile = (username?: string) => {
  const { handleError } = useErrorHandler({
    showNotifications: true,
  });

  const [blogger, setBlogger] = useState<Blogger | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Отслеживаем предыдущий username для предотвращения лишних запросов
  const previousUsernameRef = useRef<string | undefined>(undefined);

  const fetchBloggerProfile = useCallback(async () => {
    if (!username) {
      setError("Username не указан");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Нормализуем username - убираем @ если есть
      const normalizedUsername = normalizeUsername(username);

      // ⚠️ ОПТИМИЗАЦИЯ: Используем поиск по списку, затем детальный запрос
      // Это необходимо, т.к.:
      // 1. API списка возвращает только одну платформу (не все)
      // 2. API списка не возвращает topics, restrictedTopics, множественные платформы
      // 3. API списка не возвращает полную информацию (drafts, statsFiles и т.д.)
      // 
      // РЕКОМЕНДАЦИЯ БЭКЕНДУ:
      // Добавить endpoint GET /blogger/public/by-username/:username для прямого получения
      // детальной информации по username без предварительного поиска.
      
      // Сначала ищем блогера по username в списке
      const searchResponse = await getAllBloggers({
        username: normalizedUsername,
        page: 1,
        size: 1,
      });

      if (!searchResponse.items || searchResponse.items.length === 0) {
        setError("Блогер не найден");
        return;
      }

      const bloggerData = searchResponse.items[0];

      // ВАЖНО: Проверяем точное совпадение username
      // API может делать частичный поиск (LIKE), поэтому нужно проверить точное совпадение
      if (!bloggerData.social?.username) {
        // Нет социального аккаунта или username
        setError("Блогер не найден");
        return;
      }

      const foundUsername = bloggerData.social.username;
      if (foundUsername.toLowerCase() !== normalizedUsername.toLowerCase()) {
        // Username не совпадает точно - это не тот блогер, который был запрошен
        setError("Блогер не найден");
        return;
      }

      // Получаем детальную информацию о блогере по ID
      // Это необходимо для получения полной информации (все платформы, topics, drafts и т.д.)
      const detailedResponse = await getBloggerById(bloggerData.id);

      // Преобразуем данные в локальный формат
      const transformedBlogger = mapApiDetailBloggerToLocal(detailedResponse);

      setBlogger(transformedBlogger);
    } catch (err: unknown) {
      logError("Error fetching blogger profile:", err);

      const processedError = handleError(err, {
        showNotification: true,
        logError: true,
      });

      setError(processedError.message);
    } finally {
      setLoading(false);
    }
  }, [username, handleError]);

  // Используем прямые зависимости вместо функции для предотвращения лишних запросов
  useEffect(() => {
    // Нормализуем username для сравнения
    const normalizedUsername = username ? normalizeUsername(username) : undefined;
    
    // Загружаем только если username изменился (предотвращаем дублирование)
    if (normalizedUsername && previousUsernameRef.current !== normalizedUsername) {
      previousUsernameRef.current = normalizedUsername;
      fetchBloggerProfile();
    } else if (!normalizedUsername) {
      // Сбрасываем ref если username стал undefined
      previousUsernameRef.current = undefined;
    }
  }, [username, fetchBloggerProfile]);

  return {
    blogger,
    loading,
    error,
    refetch: fetchBloggerProfile,
  };
};
