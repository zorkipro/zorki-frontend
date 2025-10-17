/**
 * Константы для фильтров
 */

import { FilterState } from '@/types/blogger';

/**
 * Дефолтные значения для фильтров блогеров
 * Используется для инициализации состояния фильтров
 */
export const DEFAULT_FILTER_STATE: FilterState = {
  search: '',
  gender: '',
  category: '',
  followersMin: '',
  followersMax: '',
  postPriceMin: '',
  postPriceMax: '',
  storyPriceMin: '',
  storyPriceMax: '',
  allowsBarter: false,
  inMartRegistry: false,
  restrictedTopics: '',
};
