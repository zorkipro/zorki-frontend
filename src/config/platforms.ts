/**
 * Константы и конфигурация для платформ социальных сетей
 */

import type {
  PlatformType,
  IPlatformConfig,
  PlatformFormField,
} from "@/types/platform";

export const PLATFORMS = {
  INSTAGRAM: "instagram",
  TIKTOK: "tiktok",
  YOUTUBE: "youtube",
  TELEGRAM: "telegram",
} as const;

export type Platform = (typeof PLATFORMS)[keyof typeof PLATFORMS];

/**
 * Общие поля для всех платформ
 */
export const PLATFORM_FIELDS = {
  COMMON: ["username", "profile_url", "followers", "engagement_rate"] as const,
  PRICING: ["post_price", "story_price"] as const,
  COVERAGE: ["post_reach", "story_reach"] as const,
} as const;

/**
 * Все поля платформы (объединение всех категорий)
 */
export const ALL_PLATFORM_FIELDS: PlatformFormField[] = [
  ...PLATFORM_FIELDS.COMMON,
  ...PLATFORM_FIELDS.PRICING,
  ...PLATFORM_FIELDS.COVERAGE,
];

/**
 * Детальная конфигурация для каждой платформы
 */
export const PLATFORM_CONFIGS: Record<PlatformType, IPlatformConfig> = {
  instagram: {
    name: "Instagram",
    icon: "📷",
    color: "#E1306C",
    fields: ALL_PLATFORM_FIELDS,
    validation: {
      usernameMinLength: 1,
      usernameMaxLength: 30,
      usernamePattern: /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9._]{1,30}$/,
      minSubscribers: 0,
      minEngagementRate: 0,
      maxEngagementRate: 100,
    },
    placeholders: {
      username: "@username",
      profile_url: "https://instagram.com/username",
      followers: "10000",
      engagement_rate: "3.5",
      post_reach: "5000",
      story_reach: "3000",
      post_price: "50000",
      story_price: "30000",
    },
  },
  tiktok: {
    name: "TikTok",
    icon: "🎵",
    color: "#000000",
    fields: ALL_PLATFORM_FIELDS,
    validation: {
      usernameMinLength: 1,
      usernameMaxLength: 24,
      usernamePattern: /^[a-zA-Z0-9._]{1,24}$/,
      minSubscribers: 0,
      minEngagementRate: 0,
      maxEngagementRate: 100,
    },
    placeholders: {
      username: "@username",
      profile_url: "https://tiktok.com/@username",
      followers: "50000",
      engagement_rate: "8.5",
      post_reach: "25000",
      story_reach: "15000",
      post_price: "80000",
      story_price: "40000",
    },
  },
  youtube: {
    name: "YouTube",
    icon: "▶️",
    color: "#FF0000",
    fields: ALL_PLATFORM_FIELDS,
    validation: {
      usernameMinLength: 3,
      usernameMaxLength: 100,
      minSubscribers: 0,
      minEngagementRate: 0,
      maxEngagementRate: 100,
    },
    placeholders: {
      username: "@channelname",
      profile_url: "https://youtube.com/@channelname",
      followers: "100000",
      engagement_rate: "5.0",
      post_reach: "50000",
      story_reach: "20000",
      post_price: "150000",
      story_price: "80000",
    },
  },
  telegram: {
    name: "Telegram",
    icon: "✈️",
    color: "#0088CC",
    fields: ALL_PLATFORM_FIELDS,
    validation: {
      usernameMinLength: 5,
      usernameMaxLength: 32,
      usernamePattern: /^[a-zA-Z0-9_]{5,32}$/,
      minSubscribers: 0,
      minEngagementRate: 0,
      maxEngagementRate: 100,
    },
    placeholders: {
      username: "@channelname",
      profile_url: "https://t.me/channelname",
      followers: "20000",
      engagement_rate: "4.0",
      post_reach: "10000",
      story_reach: "5000",
      post_price: "60000",
      story_price: "35000",
    },
  },
};

/**
 * Получить конфигурацию платформы
 */
export function getPlatformConfig(platform: PlatformType): IPlatformConfig {
  return PLATFORM_CONFIGS[platform];
}

/**
 * Получить имя платформы для отображения
 */
export function getPlatformDisplayName(platform: PlatformType): string {
  return PLATFORM_CONFIGS[platform].name;
}

/**
 * Получить цвет платформы
 */
export function getPlatformColor(platform: PlatformType): string {
  return PLATFORM_CONFIGS[platform].color;
}

/**
 * Получить иконку платформы
 */
export function getPlatformIcon(platform: PlatformType): string {
  return PLATFORM_CONFIGS[platform].icon;
}
