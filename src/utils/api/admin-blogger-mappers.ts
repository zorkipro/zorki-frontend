// ============================================
// Admin Blogger Data Mappers
// ============================================
// Преобразование данных между frontend формами и backend API
// ============================================

import type { EditData } from '@/types/profile';
import type { 
  BloggerUpdateProfileInputDto, 
  BloggerUpdateSocialPriceInputDto,
  ApiSocialType,
  ApiGender,
  ApiWorkFormat
} from '@/api/types';

/**
 * Преобразует EditData в BloggerUpdateProfileInputDto
 * 
 * @param data - данные формы редактирования
 * @returns объект для обновления профиля блогера
 */
export function mapEditDataToProfileUpdate(
  data: Partial<EditData>
): BloggerUpdateProfileInputDto {
  const dto: BloggerUpdateProfileInputDto = {};

  // Базовые поля профиля
  if (data.full_name) {
    const [firstName, ...lastNameParts] = data.full_name.trim().split(' ');
    dto.name = firstName;
    dto.lastName = lastNameParts.join(' ') || undefined;
  }

  if (data.description !== undefined) {
    dto.description = data.description;
  }

  if (data.contact_link !== undefined) {
    dto.contactLink = data.contact_link;
  }

  // Форматы работы и гендер
  if (data.work_format) {
    dto.workFormat = mapWorkFormatToApi(data.work_format);
  }

  if (data.gender_type) {
    dto.genderType = mapGenderToApi(data.gender_type);
  }

  // Флаги
  if (data.barter_available !== undefined) {
    dto.isBarterAvailable = data.barter_available;
  }

  if (data.mart_registry !== undefined) {
    dto.isMartRegistry = data.mart_registry;
  }

  // Темы (требуются массивы ID)
  if (data.topics !== undefined) {
    dto.topics = data.topics;
  }

  if (data.banned_topics !== undefined) {
    dto.restrictedTopics = data.banned_topics;
  }

  // Обработка охватов сторис (coverage)
  // Приоритет: Instagram > TikTok > YouTube > Telegram
  if (data.instagram_story_reach && data.instagram_story_reach !== '') {
    dto.coverageSocialType = 'INSTAGRAM';
    dto.coverage = parseFloat(data.instagram_story_reach);
  } else if (data.tiktok_story_reach && data.tiktok_story_reach !== '') {
    dto.coverageSocialType = 'TIKTOK';
    dto.coverage = parseFloat(data.tiktok_story_reach);
  } else if (data.youtube_story_reach && data.youtube_story_reach !== '') {
    dto.coverageSocialType = 'YOUTUBE';
    dto.coverage = parseFloat(data.youtube_story_reach);
  } else if (data.telegram_story_reach && data.telegram_story_reach !== '') {
    dto.coverageSocialType = 'TELEGRAM';
    dto.coverage = parseFloat(data.telegram_story_reach);
  }

  return dto;
}

/**
 * Преобразует данные платформы из EditData в BloggerUpdateSocialPriceInputDto
 * 
 * @param platform - тип социальной платформы
 * @param data - данные формы редактирования
 * @returns объект для обновления цен или null если нет изменений
 */
export function mapPlatformPricesToUpdate(
  platform: ApiSocialType,
  data: Partial<EditData>
): BloggerUpdateSocialPriceInputDto | null {
  const prefix = platform.toLowerCase();
  const postPriceKey = `${prefix}_post_price` as keyof EditData;
  const storyPriceKey = `${prefix}_story_price` as keyof EditData;

  const dto: BloggerUpdateSocialPriceInputDto = {
    type: platform,
  };

  let hasChanges = false;

  if (data[postPriceKey] !== undefined) {
    dto.postPrice = parseFloat(String(data[postPriceKey])) || undefined;
    hasChanges = true;
  }

  if (data[storyPriceKey] !== undefined) {
    dto.storiesPrice = parseFloat(String(data[storyPriceKey])) || undefined;
    hasChanges = true;
  }

  return hasChanges ? dto : null;
}

/**
 * Преобразует русское название гендера в API формат
 * 
 * @param gender - русское название гендера
 * @returns API формат гендера или undefined
 */
function mapGenderToApi(gender: string): ApiGender | undefined {
  const map: Record<string, ApiGender> = {
    'мужчина': 'MALE',
    'женщина': 'FEMALE',
    'пара': 'COUPLE',
    'паблик': 'PUBLIC_PAGE',
  };
  return map[gender.toLowerCase()];
}

/**
 * Преобразует русское название формата работы в API формат
 * 
 * @param format - русское название формата работы
 * @returns API формат работы или undefined
 */
function mapWorkFormatToApi(format: string): ApiWorkFormat | undefined {
  const map: Record<string, ApiWorkFormat> = {
    'ИП': 'SOLE_PROPRIETOR',
    'профдоход': 'SELF_EMPLOYED',
    'самозанятый': 'SELF_EMPLOYED',
    'договор подряда': 'SERVICE_CONTRACT',
    'ООО': 'LLC',
  };
  return map[format];
}

/**
 * Преобразует API формат гендера в русское название
 * 
 * @param gender - API формат гендера
 * @returns русское название гендера или undefined
 */
export function mapGenderFromApi(gender: ApiGender): string | undefined {
  const map: Record<ApiGender, string> = {
    'MALE': 'мужчина',
    'FEMALE': 'женщина',
    'COUPLE': 'пара',
    'PUBLIC_PAGE': 'паблик',
  };
  return map[gender];
}

/**
 * Преобразует API формат работы в русское название
 * 
 * @param format - API формат работы
 * @returns русское название формата работы или undefined
 */
export function mapWorkFormatFromApi(format: ApiWorkFormat): string | undefined {
  const map: Record<ApiWorkFormat, string> = {
    'SOLE_PROPRIETOR': 'ИП',
    'SELF_EMPLOYED': 'самозанятый',
    'SERVICE_CONTRACT': 'договор подряда',
    'LLC': 'ООО',
  };
  return map[format];
}
