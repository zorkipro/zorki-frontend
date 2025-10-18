// ============================================
// Admin Topics Management Hook
// ============================================
// Хук для управления топиками администратором
// CRUD операции: создание, обновление, удаление топиков
// ============================================

import { useState, useCallback } from 'react';
import { 
  createTopic, 
  updateTopic, 
  deleteTopic, 
  getTopics 
} from '@/api/endpoints/topics';
import type { 
  TopicsOutputDto, 
  AdminCreateTopicInputDto, 
  AdminUpdateTopicInputDto,
  PaginationUtil 
} from '@/api/types';
import { logger } from '@/utils/logger';

interface UseAdminTopicsReturn {
  // Состояние загрузки
  loading: boolean;
  error: string | null;
  
  // CRUD операции
  createTopicAction: (data: AdminCreateTopicInputDto) => Promise<void>;
  updateTopicAction: (topicId: number, data: AdminUpdateTopicInputDto) => Promise<void>;
  deleteTopicAction: (topicId: number) => Promise<void>;
  
  // Загрузка топиков с пагинацией
  loadTopics: (params: { page?: number; size?: number; isRestricted?: boolean }) => Promise<PaginationUtil<TopicsOutputDto[]>>;
  
  // Утилиты
  clearError: () => void;
}

/**
 * Хук для управления топиками администратором
 * 
 * Предоставляет CRUD операции для топиков:
 * - createTopicAction - создание нового топика
 * - updateTopicAction - обновление существующего топика
 * - deleteTopicAction - удаление топика
 * - loadTopics - загрузка топиков с пагинацией
 * 
 * @returns объект с функциями управления топиками и состоянием
 * 
 * @example
 * ```typescript
 * const {
 *   loading,
 *   error,
 *   createTopicAction,
 *   updateTopicAction,
 *   deleteTopicAction,
 *   loadTopics,
 *   clearError
 * } = useAdminTopics();
 * 
 * // Создание топика
 * await createTopicAction({
 *   name: 'Мода',
 *   isRestricted: false
 * });
 * 
 * // Обновление топика
 * await updateTopicAction(123, {
 *   name: 'Мода и стиль',
 *   isRestricted: false
 * });
 * 
 * // Удаление топика
 * await deleteTopicAction(123);
 * 
 * // Загрузка топиков
 * const result = await loadTopics({ page: 1, size: 20, isRestricted: false });
 * ```
 */
export const useAdminTopics = (): UseAdminTopicsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Очистка ошибки
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Создание топика
  const createTopicAction = useCallback(async (data: AdminCreateTopicInputDto): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await createTopic(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания топика';
      setError(errorMessage);
      logger.error('Error creating topic', err, { 
        component: 'useAdminTopics',
        topicData: data
      });
      throw err; // Пробрасываем ошибку для обработки в компоненте
    } finally {
      setLoading(false);
    }
  }, []);

  // Обновление топика
  const updateTopicAction = useCallback(async (
    topicId: number, 
    data: AdminUpdateTopicInputDto
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await updateTopic(topicId, data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления топика';
      setError(errorMessage);
      logger.error('Error updating topic', err, { 
        component: 'useAdminTopics',
        topicId,
        topicData: data
      });
      throw err; // Пробрасываем ошибку для обработки в компоненте
    } finally {
      setLoading(false);
    }
  }, []);

  // Удаление топика
  const deleteTopicAction = useCallback(async (topicId: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await deleteTopic(topicId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления топика';
      setError(errorMessage);
      logger.error('Error deleting topic', err, { 
        component: 'useAdminTopics',
        topicId
      });
      throw err; // Пробрасываем ошибку для обработки в компоненте
    } finally {
      setLoading(false);
    }
  }, []);

  // Загрузка топиков с пагинацией
  const loadTopicsAction = useCallback(async (params: { 
    page?: number; 
    size?: number; 
    isRestricted?: boolean 
  }): Promise<PaginationUtil<TopicsOutputDto[]>> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getTopics(params);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки топиков';
      setError(errorMessage);
      logger.error('Error loading topics', err, { 
        component: 'useAdminTopics',
        params
      });
      throw err; // Пробрасываем ошибку для обработки в компоненте
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createTopicAction,
    updateTopicAction,
    deleteTopicAction,
    loadTopics: loadTopicsAction,
    clearError,
  };
};
