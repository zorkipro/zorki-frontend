// ============================================
// Topics API Endpoints
// ============================================
// ⚠️ TODO: Backend не реализован
// GET /topic - Получить все темы (категории и запрещенные)
// ============================================

import { apiRequest } from '../client';
import type { TopicOutputDto } from '../types';
import { logger } from '@/utils/logger';

// ============================================
// ⚠️ TODO: Backend endpoint required
// ============================================

/**
 * ⚠️ TODO: Backend endpoint required
 *
 * GET /topic
 * Auth: Не требуется (публичный endpoint)
 *
 * Response: Array<TopicOutputDto>
 *
 * TopicOutputDto {
 *   id: number,
 *   name: string,
 *   isTopicRestricted: boolean
 * }
 *
 * Backend реализация:
 * - Prisma model Topic уже существует
 * - Нужен только контроллер и query handler
 * - Кэширование желательно (данные меняются редко)
 *
 * Пример использования:
 * ```typescript
 * export async function getAllTopics(): Promise<TopicOutputDto[]> {
 *   return apiRequest<TopicOutputDto[]>('/topic');
 * }
 *
 * // В хуке
 * const topics = await getAllTopics();
 * const categories = topics.filter(t => !t.isTopicRestricted);
 * const restrictedTopics = topics.filter(t => t.isTopicRestricted);
 * ```
 *
 * Фильтрация в FilterSidebar:
 * ```typescript
 * // useCategories.ts
 * const { data: allTopics } = await getAllTopics();
 * const categories = allTopics.filter(t => !t.isTopicRestricted);
 * // Создаем lookup: { "Мода": 1, "Красота": 2 }
 * const lookup = createTopicLookup(categories);
 *
 * // useRestrictedTopics.ts
 * const { data: allTopics } = await getAllTopics();
 * const restricted = allTopics.filter(t => t.isTopicRestricted);
 * ```
 */

/**
 * Временная mock функция для получения топиков
 * ⚠️ УДАЛИТЬ когда backend реализует GET /topic
 */
export async function getAllTopicsMock(): Promise<TopicOutputDto[]> {
  logger.warn('Backend endpoint GET /topic не реализован. Используется mock.', {
    component: 'topics-api',
    endpoint: 'GET /topic',
  });

  // Mock data для разработки
  return [
    { id: 1, name: 'Мода', isTopicRestricted: false },
    { id: 2, name: 'Красота', isTopicRestricted: false },
    { id: 3, name: 'Путешествия', isTopicRestricted: false },
    { id: 4, name: 'Еда', isTopicRestricted: false },
    { id: 5, name: 'Спорт', isTopicRestricted: false },
    { id: 6, name: 'Алкоголь', isTopicRestricted: true },
    { id: 7, name: 'Азартные игры', isTopicRestricted: true },
  ];
}

/**
 * ⚠️ TODO: Заменить на реальный API call когда backend готов
 *
 * @example
 * ```typescript
 * export async function getAllTopics(): Promise<TopicOutputDto[]> {
 *   return apiRequest<TopicOutputDto[]>('/topic');
 * }
 * ```
 */
export const getAllTopics = getAllTopicsMock;
