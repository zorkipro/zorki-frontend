// ============================================
// Topics Hook (API Integration)
// ============================================
// Хук для получения всех топиков (категорий и запрещенных тем)
// Использует единый endpoint GET /topic с фильтрацией по isTopicRestricted
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { getAllTopics } from '@/api/endpoints/topics';
import type { TopicOutputDto } from '@/api/types';
import { logger } from '@/utils/logger';

interface UseTopicsReturn {
  // Все топики
  allTopics: TopicOutputDto[];

  // Обычные категории (isTopicRestricted: false)
  categories: TopicOutputDto[];

  // Запрещенные темы (isTopicRestricted: true)
  restrictedTopics: TopicOutputDto[];

  // Состояние загрузки
  loading: boolean;
  error: string | null;

  // Утилиты
  refresh: () => Promise<void>;
  clearError: () => void;

  // Lookup таблицы для быстрого поиска
  topicLookup: Record<string, number>;
  topicReverseLookup: Record<number, string>;
}

/**
 * Хук для работы с топиками (категориями и запрещенными темами)
 *
 * Архитектура топиков:
 * - В БД одна таблица Topic с полем isTopicRestricted: boolean
 * - Endpoint GET /topic возвращает ВСЕ топики
 * - Фронтенд фильтрует по флагу:
 *   - categories = topics.filter(t => !t.isTopicRestricted)
 *   - restrictedTopics = topics.filter(t => t.isTopicRestricted)
 *
 * @param autoLoad - автоматически загружать топики при монтировании (по умолчанию true)
 * @returns объект с топиками и утилитами
 *
 * @example
 * ```typescript
 * const {
 *   categories,
 *   restrictedTopics,
 *   loading,
 *   error,
 *   topicLookup,
 *   refresh
 * } = useTopics();
 *
 * // Использование в компонентах
 * const categoryNames = categories.map(t => t.name);
 * const restrictedNames = restrictedTopics.map(t => t.name);
 *
 * // Lookup для обновления профиля
 * const topicIds = selectedTopics.map(name => topicLookup[name]);
 * ```
 */
export const useTopics = (autoLoad: boolean = true): UseTopicsReturn => {
  const [allTopics, setAllTopics] = useState<TopicOutputDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Фильтруем топики по типу
  const categories = useMemo(
    () => allTopics.filter((topic) => !topic.isTopicRestricted),
    [allTopics]
  );

  const restrictedTopics = useMemo(
    () => allTopics.filter((topic) => topic.isTopicRestricted),
    [allTopics]
  );

  // Создаем lookup таблицы для быстрого поиска
  const topicLookup = useMemo(
    () =>
      allTopics.reduce(
        (acc, topic) => {
          acc[topic.name] = topic.id;
          return acc;
        },
        {} as Record<string, number>
      ),
    [allTopics]
  );

  const topicReverseLookup = useMemo(
    () =>
      allTopics.reduce(
        (acc, topic) => {
          acc[topic.id] = topic.name;
          return acc;
        },
        {} as Record<number, string>
      ),
    [allTopics]
  );

  // Загрузка топиков
  const loadTopics = async () => {
    try {
      setLoading(true);
      setError(null);

      const topics = await getAllTopics();
      setAllTopics(topics);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки топиков';
      setError(errorMessage);
      logger.error('Error loading topics', err, { component: 'useTopics' });
    } finally {
      setLoading(false);
    }
  };

  // Обновление данных
  const refresh = async () => {
    await loadTopics();
  };

  // Очистка ошибки
  const clearError = () => {
    setError(null);
  };

  // Автоматическая загрузка при монтировании
  useEffect(() => {
    if (autoLoad) {
      loadTopics();
    }
  }, [autoLoad]);

  return {
    allTopics,
    categories,
    restrictedTopics,
    loading,
    error,
    refresh,
    clearError,
    topicLookup,
    topicReverseLookup,
  };
};

/**
 * Хук для получения только категорий (обычных тем)
 * Удобная обертка над useTopics для случаев когда нужны только категории
 */
export const useCategories = () => {
  const { categories, loading, error, refresh, clearError } = useTopics();

  return {
    categories,
    loading,
    error,
    refresh,
    clearError,
  };
};

/**
 * Хук для получения только запрещенных тем
 * Удобная обертка над useTopics для случаев когда нужны только запрещенные темы
 */
export const useRestrictedTopics = () => {
  const { restrictedTopics, loading, error, refresh, clearError } = useTopics();

  return {
    restrictedTopics,
    loading,
    error,
    refresh,
    clearError,
  };
};
