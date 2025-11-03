import { FilterState } from '@/types/blogger';
import { GENDER_REVERSE } from '@/api/types';
import { safeParseInt } from '@/utils/formatters';
import { normalizeUsername } from '@/utils/username';
import type { TopicsOutputDto } from '@/api/types';

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_SOCIAL_TYPE = 'INSTAGRAM';

export function buildApiParams(
  filters: FilterState,
  page: number,
  size: number = DEFAULT_PAGE_SIZE,
  topicsData?: {
    categories: TopicsOutputDto[];
    restrictedTopics: TopicsOutputDto[];
  }
) {
  const apiParams: Record<string, unknown> = {
    page,
    size,
    socialType: DEFAULT_SOCIAL_TYPE,
  };

  if (filters.gender && filters.gender !== 'all' && GENDER_REVERSE[filters.gender]) {
    apiParams.gender = GENDER_REVERSE[filters.gender];
  }

  if (filters.followersMin) apiParams.subCountFrom = safeParseInt(filters.followersMin);
  if (filters.followersMax) apiParams.subCountTo = safeParseInt(filters.followersMax);
  if (filters.postPriceMin) apiParams.postPriceFrom = safeParseInt(filters.postPriceMin);
  if (filters.postPriceMax) apiParams.postPriceTo = safeParseInt(filters.postPriceMax);
  if (filters.storyPriceMin) apiParams.storyPriceFrom = safeParseInt(filters.storyPriceMin);
  if (filters.storyPriceMax) apiParams.storyPriceTo = safeParseInt(filters.storyPriceMax);

  if (filters.allowsBarter) apiParams.isBarterAvailable = true;
  if (filters.inMartRegistry) apiParams.isMartRegistry = true;
  if (filters.search?.trim()) apiParams.username = normalizeUsername(filters.search);

  if (topicsData) {
    if (filters.category && filters.category !== 'all') {
      const categoryId = topicsData.categories.find((cat) => cat.name === filters.category)?.id;
      if (categoryId) apiParams.topics = [categoryId];
    }
    if (filters.restrictedTopics && filters.restrictedTopics !== 'all') {
      const restrictedTopicId = topicsData.restrictedTopics.find((topic) => topic.name === filters.restrictedTopics)?.id;
      if (restrictedTopicId) apiParams.restrictedTopics = [restrictedTopicId];
    }
  }

  return apiParams;
}