import { FilterState } from '@/types/blogger';
import { GENDER_REVERSE } from '@/api/types';
import { safeParseInt } from '@/utils/formatters';
import { normalizeUsername } from '@/utils/username';
import type { TopicsOutputDto } from '@/api/types';

// Константы для API
const API_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100,
  DEFAULT_SOCIAL_TYPE: 'INSTAGRAM',
} as const;

/**
 * Строит параметры для API запроса на основе фильтров
 */
export function buildApiParams(
  filters: FilterState,
  page: number,
  size: number = API_CONSTANTS.DEFAULT_PAGE_SIZE,
  topicsData?: {
    categories: TopicsOutputDto[];
    restrictedTopics: TopicsOutputDto[];
  }
) {
  const apiParams: Record<string, unknown> = {
    page,
    size,
    socialType: API_CONSTANTS.DEFAULT_SOCIAL_TYPE, // Обязательный параметр
  };

  if (filters.gender && filters.gender !== 'all') {
    apiParams.gender = GENDER_REVERSE[filters.gender];
  }

  if (filters.followersMin) {
    apiParams.subCountFrom = safeParseInt(filters.followersMin);
  }

  if (filters.followersMax) {
    apiParams.subCountTo = safeParseInt(filters.followersMax);
  }

  if (filters.postPriceMin) {
    apiParams.postPriceFrom = safeParseInt(filters.postPriceMin);
  }

  if (filters.postPriceMax) {
    apiParams.postPriceTo = safeParseInt(filters.postPriceMax);
  }

  if (filters.storyPriceMin) {
    apiParams.storyPriceFrom = safeParseInt(filters.storyPriceMin);
  }

  if (filters.storyPriceMax) {
    apiParams.storyPriceTo = safeParseInt(filters.storyPriceMax);
  }

  if (filters.allowsBarter) {
    apiParams.isBarterAvailable = true;
  }

  if (filters.inMartRegistry) {
    apiParams.isMartRegistry = true;
  }

  // Добавляем поиск по username (поддерживается API)
  if (filters.search && filters.search.trim()) {
    // Нормализуем username - убираем @ если есть
    apiParams.username = normalizeUsername(filters.search);
  }

  // Добавляем фильтрацию по тематикам
  if (filters.category && filters.category !== 'all' && topicsData) {
    const categoryId = topicsData.categories.find(
      (cat) => cat.name === filters.category
    )?.id;
    if (categoryId) {
      apiParams.topics = [categoryId];
      console.log('Filtering by category:', filters.category, 'ID:', categoryId);
    }
  }

  // Добавляем фильтрацию по запрещенным тематикам
  if (filters.restrictedTopics && filters.restrictedTopics !== 'all' && topicsData) {
    const restrictedTopicId = topicsData.restrictedTopics.find(
      (topic) => topic.name === filters.restrictedTopics
    )?.id;
    if (restrictedTopicId) {
      apiParams.restrictedTopics = [restrictedTopicId];
      console.log('Filtering by restricted topic:', filters.restrictedTopics, 'ID:', restrictedTopicId);
    }
  }

  console.log('API Params:', apiParams);

  return apiParams;
}