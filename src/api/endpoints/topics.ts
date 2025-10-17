// ============================================
// Topics API Endpoints
// ============================================
// GET /topic/public - Получить все темы с пагинацией и фильтрацией
// POST /admin/topic - Создать новый топик (admin)
// PUT /admin/topic/{topicId} - Обновить топик (admin)
// DELETE /admin/topic/{topicId} - Удалить топик (admin)
// ============================================

import { apiRequest } from '../client';
import type { 
  TopicsOutputDto, 
  PaginationUtil, 
  AdminCreateTopicInputDto, 
  AdminUpdateTopicInputDto 
} from '../types';

// ====== GET /topic/public - Публичный список топиков ======

export interface GetTopicsParams {
  page?: number; // default: 1
  size?: number; // default: 50
  isRestricted?: boolean; // default: false
}

/**
 * Получить список топиков с пагинацией и фильтрацией
 *
 * @param params - Параметры пагинации и фильтрации
 * @returns Promise с пагинированным списком топиков
 *
 * @example
 * ```typescript
 * // Все обычные топики (категории)
 * const categories = await getTopics({ isRestricted: false });
 *
 * // Все запрещенные топики
 * const restricted = await getTopics({ isRestricted: true });
 *
 * // С пагинацией
 * const page2 = await getTopics({ page: 2, size: 20, isRestricted: false });
 * ```
 */
export async function getTopics(
  params: GetTopicsParams = {}
): Promise<PaginationUtil<TopicsOutputDto[]>> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // Для boolean значений используем правильное преобразование
      if (typeof value === 'boolean') {
        query.append(key, value ? 'true' : 'false');
      } else {
        query.append(key, String(value));
      }
    }
  });

  return apiRequest<PaginationUtil<TopicsOutputDto[]>>(`/topic/public?${query}`, {
    skipAuth: true
  });
}

/**
 * Получить все обычные топики (категории) без пагинации
 * Удобная функция для использования в селекторах
 *
 * @returns Promise с массивом обычных топиков
 *
 * @example
 * ```typescript
 * const categories = await getAllCategories();
 * // Использование в CategorySelector
 * ```
 */
export async function getAllCategories(): Promise<TopicsOutputDto[]> {
  const result = await getTopics({ isRestricted: false, size: 50 });
  return result.items;
}

/**
 * Получить все запрещенные топики без пагинации
 * Удобная функция для использования в селекторах
 *
 * @returns Promise с массивом запрещенных топиков
 *
 * @example
 * ```typescript
 * const restricted = await getAllRestrictedTopics();
 * // Использование в RestrictedTopicsSelector
 * ```
 */
export async function getAllRestrictedTopics(): Promise<TopicsOutputDto[]> {
  const result = await getTopics({ isRestricted: true, size: 50 });
  return result.items;
}

// ====== ADMIN TOPICS MANAGEMENT ======

/**
 * Создать новый топик (только для администраторов)
 *
 * @param data - Данные для создания топика
 * @returns Promise<void> (201 Created)
 *
 * @throws APIError 400 - Validation error или topic already exists
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @example
 * ```typescript
 * await createTopic({
 *   name: 'Мода',
 *   isRestricted: false
 * });
 * ```
 */
export async function createTopic(data: AdminCreateTopicInputDto): Promise<void> {
  return apiRequest<void>('/admin/topic', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Обновить существующий топик (только для администраторов)
 *
 * @param topicId - ID топика для обновления
 * @param data - Новые данные топика
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Validation error или topic already exists
 * @throws APIError 401 - Unauthorized (требуется admin token)
 * @throws APIError 404 - Topic not found
 *
 * @example
 * ```typescript
 * await updateTopic(123, {
 *   name: 'Мода и стиль',
 *   isRestricted: false
 * });
 * ```
 */
export async function updateTopic(
  topicId: number,
  data: AdminUpdateTopicInputDto
): Promise<void> {
  return apiRequest<void>(`/admin/topic/${topicId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Удалить топик (только для администраторов)
 *
 * @param topicId - ID топика для удаления
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized (требуется admin token)
 * @throws APIError 404 - Topic not found
 *
 * @example
 * ```typescript
 * await deleteTopic(123);
 * ```
 */
export async function deleteTopic(topicId: number): Promise<void> {
  return apiRequest<void>(`/admin/topic/${topicId}`, {
    method: 'DELETE',
  });
}

// ====== BACKWARD COMPATIBILITY ======

/**
 * @deprecated Используйте getTopics() вместо getAllTopics()
 * Обратная совместимость для существующего кода
 */
export async function getAllTopics(): Promise<TopicsOutputDto[]> {
  const result = await getTopics({ size: 50 });
  return result.items;
}