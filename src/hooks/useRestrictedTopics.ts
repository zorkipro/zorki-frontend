// ============================================
// Restricted Topics Hook (API Integration)
// ============================================
// Хук для получения запрещенных тем
// Использует useTopics и фильтрует по isTopicRestricted: true
// ============================================

import { useRestrictedTopics as useRestrictedTopicsFromTopics } from './useTopics';

/**
 * Хук для получения запрещенных тем
 *
 * Архитектура:
 * - Использует единый useTopics хук
 * - Фильтрует топики где isTopicRestricted: true
 * - Возвращает только названия запрещенных тем для совместимости
 *
 * @returns объект с запрещенными темами и состоянием загрузки
 *
 * @example
 * ```typescript
 * const { restrictedTopics, loading, error } = useRestrictedTopics();
 *
 * // restrictedTopics: string[] - массив названий запрещенных тем
 * // loading: boolean - состояние загрузки
 * // error: string | null - ошибка загрузки
 * ```
 */
export const useRestrictedTopics = () => {
  const {
    restrictedTopics: topicRestrictedTopics,
    loading,
    error,
    refresh,
    clearError,
  } = useRestrictedTopicsFromTopics();

  // Преобразуем TopicOutputDto[] в string[] для совместимости
  const restrictedTopics = topicRestrictedTopics.map((topic) => topic.name);

  return {
    restrictedTopics,
    loading,
    error,
    refresh,
    clearError,
  };
};
