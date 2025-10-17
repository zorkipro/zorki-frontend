// ============================================
// Categories Hook (API Integration)
// ============================================
// Хук для получения категорий (обычных тем)
// Использует useTopics и фильтрует по isTopicRestricted: false
// ============================================

import { useCategories as useCategoriesFromTopics } from './useTopics';

/**
 * Хук для получения категорий (обычных тем)
 *
 * Архитектура:
 * - Использует единый useTopics хук
 * - Фильтрует топики где isTopicRestricted: false
 * - Возвращает только названия категорий для совместимости
 *
 * @returns объект с категориями и состоянием загрузки
 *
 * @example
 * ```typescript
 * const { categories, loading, error } = useCategories();
 *
 * // categories: string[] - массив названий категорий
 * // loading: boolean - состояние загрузки
 * // error: string | null - ошибка загрузки
 * ```
 */
export const useCategories = () => {
  const {
    categories: topicCategories,
    loading,
    error,
    refresh,
    clearError,
  } = useCategoriesFromTopics();

  // Преобразуем TopicOutputDto[] в string[] для совместимости
  const categories = topicCategories.map((topic) => topic.name);

  return {
    categories,
    loading,
    error,
    refresh,
    clearError,
  };
};
