import { CURRENCY } from '@/config/constants';

/**
 * Безопасный парсинг строки в число с обработкой NaN
 */
export const safeParseInt = (
  value: string | null | undefined,
  defaultValue: number = 0
): number => {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Format number for display (e.g., 1000 -> 1k, 1000000 -> 1M)
 * Returns "-" for zero or invalid values
 */
export const formatNumber = (num: number): string => {
  if (!num || isNaN(num)) return '-';

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }

  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }

  return num.toString();
};

/**
 * Format number for display (e.g., 1000 -> 1k, 1000000 -> 1M)
 * Returns "0" for zero values (legacy behavior)
 */
export const formatNumberWithZero = (num: number): string => {
  if (!num || isNaN(num)) return '0';

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }

  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }

  return num.toString();
};

/**
 * Format reach/coverage numbers - shows "-" for zero values
 */
export const formatReach = (num: number): string => {
  if (!num || isNaN(num)) return '-';

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }

  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }

  return num.toString();
};

/**
 * Format price numbers - shows "-" for zero values
 */
export const formatPrice = (num: number): string => {
  if (!num || isNaN(num)) return '-';

  return num.toString();
};

/**
 * Format price with currency - shows "-" for zero values instead of "- BYN"
 */
export const formatPriceWithCurrency = (num: number, currency: string = 'BYN'): string => {
  if (!num || isNaN(num)) return '-';

  return `${num} ${currency}`;
};

/**
 * Форматирует количество подписчиков в читаемый формат
 * @param subscribers - строка с числом подписчиков или null
 * @returns отформатированная строка (например "125.0K", "1.5M") или "-"
 */
export const formatSubscribers = (subscribers: string | null): string => {
  if (!subscribers) return '-';

  const num = parseInt(subscribers, 10);

  if (isNaN(num)) return '-';

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }

  return num.toLocaleString('ru-RU');
};

/**
 * Get avatar URL with fallback for missing avatars
 * Priority order:
 * 1. profile_picture_url from influencer_profiles table (Instagram avatar)
 * 2. avatar_url from influencers table (manual upload)
 * 3. Fallback based on username mapping
 * 4. Gender-appropriate default
 */
export const getAvatarUrl = (profile: {
  avatar_url: string | null;
  profile_picture_url?: string | null;
  username: string;
  gender_type?: string;
}): string => {
  // First check if profile_picture_url is provided (from influencer_profiles table)
  if (profile.profile_picture_url) {
    return profile.profile_picture_url;
  }

  // Then check if avatar_url is directly provided in the profile (from influencers table)
  if (profile.avatar_url) {
    return profile.avatar_url;
  }

  // Gender-specific avatar mappings to ensure uniqueness and appropriateness
  const avatarMappings: Record<string, string> = {
    // Women - unique avatars
    anna_petrova_beauty: '/blogger-anna.jpg',
    elena_fitness_coach: '/blogger-elena.jpg',
    maria_family_blog: '/blogger-fashion.jpg',
    natalia_psychologist: '/blogger-olga.jpg',
    olga_cooking_master: '/blogger-elena.jpg',
    _agentgirl_: '/blogger-anna.jpg', // Agent Girl - женский аватар

    // Men - unique avatars
    dmitry_tech_review: '/blogger-dmitry.jpg',
    igor_travel_guide: '/blogger-igor.jpg',
    sergey_business_guru: '/blogger-andrey.jpg',
    alexey_car_review: '/blogger-dmitry.jpg',
    andrey_bodybuilding: '/blogger-andrey.jpg',

    // Legacy mappings for backward compatibility
    anna_lifestyle: '/blogger-anna.jpg',
    dmitry_tech: '/blogger-dmitry.jpg',
    travel_couple_by: '/blogger-couple.jpg',
    fitness_elena: '/blogger-elena.jpg',
    igor_business: '/blogger-igor.jpg',
    beauty_olga: '/blogger-olga.jpg',
    cooking_andrey: '/blogger-andrey.jpg',
    fashion_belarus: '/blogger-fashion.jpg',
  };

  // Return mapped avatar or gender-appropriate default
  if (avatarMappings[profile.username]) {
    return avatarMappings[profile.username];
  }

  // Gender-appropriate default fallback
  if (profile.gender_type === 'мужчина') {
    return '/blogger-dmitry.jpg'; // Default male avatar
  } else if (profile.gender_type === 'женщина') {
    return '/blogger-anna.jpg'; // Default female avatar
  }

  return '/blogger-default.svg';
};

/**
 * Format currency amount with configurable currency suffix
 */
export const formatCurrency = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (!numAmount || isNaN(numAmount)) return `0 ${CURRENCY}`;
  return `${numAmount} ${CURRENCY}`;
};

/**
 * Parse string number value to integer
 */
export const parseNumericValue = (value: string): number => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Calculate engagement rate percentage
 */
export const calculateEngagementRate = (engagement: number, followers: number): string => {
  if (!followers || followers === 0) return '0%';
  const rate = (engagement / followers) * 100;
  return `${rate.toFixed(1)}%`;
};

/**
 * Format platform-specific metrics
 */
export const formatPlatformMetrics = (platform: string, value: number): string => {
  switch (platform) {
    case 'instagram':
    case 'telegram':
    case 'tiktok':
      return `${formatNumber(value)} подписчиков`;
    case 'youtube':
      return `${formatNumber(value)} подписчиков`;
    default:
      return formatNumber(value);
  }
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
/**
 * Generate random string ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Обрезает длинные имена блогеров для лучшего отображения в таблице
 * @param name - имя блогера
 * @param maxLength - максимальная длина (по умолчанию 25 символов)
 * @returns обрезанное имя с многоточием если необходимо
 */
export const truncateName = (name: string, maxLength: number = 25): string => {
  if (!name) return '';
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + '...';
};
