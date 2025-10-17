import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllCategories, getAllRestrictedTopics } from '@/api/endpoints/topics';
import type { TopicsOutputDto } from '@/api/types';
import { logError } from '@/utils/logger';

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

/**
 * Хук для работы с тематиками
 * Предоставляет методы для получения ID по названию и наоборот
 */
export const useTopics = (): UseTopicsReturn => {
  const [categories, setCategories] = useState<TopicsOutputDto[]>([]);
  const [restrictedTopics, setRestrictedTopics] = useState<TopicsOutputDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загружаем тематики при инициализации
  useEffect(() => {
    const loadTopics = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoriesData, restrictedTopicsData] = await Promise.all([
          getAllCategories(),
          getAllRestrictedTopics(),
        ]);

        setCategories(categoriesData);
        setRestrictedTopics(restrictedTopicsData);
      } catch (err) {
        logError('Error loading topics:', err);
        setError('Ошибка загрузки тематик');
        setCategories([]);
        setRestrictedTopics([]);
      } finally {
        setLoading(false);
      }
    };

    loadTopics();
  }, []);

  // Получить ID категории по названию
  const getCategoryIdByName = useCallback(
    (name: string): number | null => {
      const category = categories.find((cat) => cat.name === name);
      return category ? category.id : null;
    },
    [categories]
  );

  // Получить ID запрещенной тематики по названию
  const getRestrictedTopicIdByName = useCallback(
    (name: string): number | null => {
      const topic = restrictedTopics.find((topic) => topic.name === name);
      return topic ? topic.id : null;
    },
    [restrictedTopics]
  );

  // Получить название категории по ID
  const getCategoryNameById = useCallback(
    (id: number): string | null => {
      const category = categories.find((cat) => cat.id === id);
      return category ? category.name : null;
    },
    [categories]
  );

  // Получить название запрещенной тематики по ID
  const getRestrictedTopicNameById = useCallback(
    (id: number): string | null => {
      const topic = restrictedTopics.find((topic) => topic.id === id);
      return topic ? topic.name : null;
    },
    [restrictedTopics]
  );

  // Создаем lookup таблицы для обратной совместимости
  const topicLookup = useMemo(() => {
    // Объединяем обычные категории и запрещённые темы
    const allTopics = [...categories, ...restrictedTopics];
    return allTopics.reduce((acc, topic) => {
      acc[topic.name] = topic.id;
      return acc;
    }, {} as Record<string, number>);
  }, [categories, restrictedTopics]);

  const topicReverseLookup = useMemo(() => {
    // Объединяем обычные категории и запрещённые темы
    const allTopics = [...categories, ...restrictedTopics];
    return allTopics.reduce((acc, topic) => {
      acc[topic.id] = topic.name;
      return acc;
    }, {} as Record<number, string>);
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