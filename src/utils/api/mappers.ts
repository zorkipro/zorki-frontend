/**
 * API Data Mappers - Centralized Export
 *
 * DEPRECATED: Этот файл сохранён для обратной совместимости.
 * Для новых компонентов используйте прямые импорты из модулей:
 *
 * - common-mappers.ts - утилиты парсинга
 * - platform-mappers.ts - маппинг платформ
 * - profile-mappers.ts - маппинг профилей
 * - topic-mappers.ts - работа с топиками
 * - draft-merge-mappers.ts - слияние черновиков
 */

// Re-export common utilities
export { parseBigInt, parseDecimal, splitFullName, joinFullName } from './common-mappers';

// Re-export platform mappers
export { mapSinglePlatform, mapMultiplePlatforms, findPrimaryPlatform } from './platform-mappers';

// Re-export profile mappers
export {
  mapApiListBloggerToLocal,
  mapApiDetailBloggerToLocal,
  mapLocalToApiUpdate,
} from './profile-mappers';

// Re-export topic mappers
export {
  createTopicLookup,
  createTopicReverseLookup,
  convertTopicNamesToIds,
  convertTopicIdsToNames,
} from './topic-mappers';

// Re-export draft merge mappers
export { mergeDraftsWithPublished, extractDraftInfo } from './draft-merge-mappers';
