import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  getAllCategories,
  getAllRestrictedTopics,
} from "@/api/endpoints/topics";
import type { TopicsOutputDto } from "@/api/types";
import { logError } from "@/utils/logger";

interface UseTopicsReturn {
  categories: TopicsOutputDto[];
  restrictedTopics: TopicsOutputDto[];
  loading: boolean;
  error: string | null;
  getCategoryIdByName: (name: string) => number | null;
  getRestrictedTopicIdByName: (name: string) => number | null;
  getCategoryNameById: (id: number) => string | null;
  getRestrictedTopicNameById: (id: number) => string | null;
  topicLookup: Record<string, number>;
  topicReverseLookup: Record<number, string>;
}

// Глобальный кэш для topics (модульный уровень)
// Это предотвращает дублирование запросов при множественном использовании useTopics
interface TopicsCache {
  categories: TopicsOutputDto[] | null;
  restrictedTopics: TopicsOutputDto[] | null;
  loading: boolean;
  error: string | null;
  promise: Promise<void> | null;
}

const topicsCache: TopicsCache = {
  categories: null,
  restrictedTopics: null,
  loading: false,
  error: null,
  promise: null,
};

/**
 * Хук для работы с тематиками
 * Предоставляет методы для получения ID по названию и наоборот
 * 
 * Использует глобальный кэш для предотвращения дублирования запросов
 * при множественном использовании хука в разных компонентах
 */
export const useTopics = (): UseTopicsReturn => {
  const [categories, setCategories] = useState<TopicsOutputDto[]>(
    topicsCache.categories || []
  );
  const [restrictedTopics, setRestrictedTopics] = useState<TopicsOutputDto[]>(
    topicsCache.restrictedTopics || []
  );
  const [loading, setLoading] = useState(topicsCache.loading);
  const [error, setError] = useState<string | null>(topicsCache.error);
  
  // Используем ref для отслеживания первого рендера
  const isMountedRef = useRef(false);

  // Загружаем тематики при инициализации
  useEffect(() => {
    isMountedRef.current = true;

    // Если данные уже есть в кэше, используем их сразу
    if (topicsCache.categories && topicsCache.restrictedTopics) {
      setCategories(topicsCache.categories);
      setRestrictedTopics(topicsCache.restrictedTopics);
      setLoading(false);
      setError(null);
      return;
    }

    // Если уже идет загрузка, присоединяемся к существующему промису
    if (topicsCache.promise) {
      setLoading(true);
      topicsCache.promise
        .then(() => {
          if (isMountedRef.current) {
            setCategories(topicsCache.categories || []);
            setRestrictedTopics(topicsCache.restrictedTopics || []);
            setLoading(false);
            setError(topicsCache.error);
          }
        })
        .catch(() => {
          if (isMountedRef.current) {
            setLoading(false);
            setError(topicsCache.error);
            setCategories([]);
            setRestrictedTopics([]);
          }
        });
      return;
    }

    // Начинаем новую загрузку только если она еще не началась
    if (!topicsCache.promise) {
      setLoading(true);
      const loadTopicsPromise = (async () => {
        try {
          topicsCache.loading = true;
          topicsCache.error = null;

          const [categoriesData, restrictedTopicsData] = await Promise.all([
            getAllCategories(),
            getAllRestrictedTopics(),
          ]);

          // Сохраняем в кэш
          topicsCache.categories = categoriesData;
          topicsCache.restrictedTopics = restrictedTopicsData;
          topicsCache.loading = false;
          topicsCache.error = null;
        } catch (err) {
          logError("Error loading topics:", err);
          const errorMessage = "Ошибка загрузки тематик";
          topicsCache.error = errorMessage;
          topicsCache.loading = false;
          throw err;
        } finally {
          topicsCache.promise = null;
        }
      })();

      topicsCache.promise = loadTopicsPromise;
      
      loadTopicsPromise
        .then(() => {
          if (isMountedRef.current) {
            setCategories(topicsCache.categories || []);
            setRestrictedTopics(topicsCache.restrictedTopics || []);
            setLoading(false);
            setError(null);
          }
        })
        .catch(() => {
          if (isMountedRef.current) {
            setError(topicsCache.error);
            setCategories([]);
            setRestrictedTopics([]);
            setLoading(false);
          }
        });
    }
    
    // Cleanup
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Получить ID категории по названию
  const getCategoryIdByName = useCallback(
    (name: string): number | null => {
      const category = categories.find((cat) => cat.name === name);
      return category ? category.id : null;
    },
    [categories],
  );

  // Получить ID запрещенной тематики по названию
  const getRestrictedTopicIdByName = useCallback(
    (name: string): number | null => {
      const topic = restrictedTopics.find((topic) => topic.name === name);
      return topic ? topic.id : null;
    },
    [restrictedTopics],
  );

  // Получить название категории по ID
  const getCategoryNameById = useCallback(
    (id: number): string | null => {
      const category = categories.find((cat) => cat.id === id);
      return category ? category.name : null;
    },
    [categories],
  );

  // Получить название запрещенной тематики по ID
  const getRestrictedTopicNameById = useCallback(
    (id: number): string | null => {
      const topic = restrictedTopics.find((topic) => topic.id === id);
      return topic ? topic.name : null;
    },
    [restrictedTopics],
  );

  // Создаем lookup таблицы для обратной совместимости
  const topicLookup = useMemo(() => {
    // Объединяем обычные категории и запрещённые темы
    const allTopics = [...categories, ...restrictedTopics];
    return allTopics.reduce(
      (acc, topic) => {
        acc[topic.name] = topic.id;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [categories, restrictedTopics]);

  const topicReverseLookup = useMemo(() => {
    // Объединяем обычные категории и запрещённые темы
    const allTopics = [...categories, ...restrictedTopics];
    return allTopics.reduce(
      (acc, topic) => {
        acc[topic.id] = topic.name;
        return acc;
      },
      {} as Record<number, string>,
    );
  }, [categories, restrictedTopics]);

  return {
    categories,
    restrictedTopics,
    loading,
    error,
    getCategoryIdByName,
    getRestrictedTopicIdByName,
    getCategoryNameById,
    getRestrictedTopicNameById,
    topicLookup,
    topicReverseLookup,
  };
};
