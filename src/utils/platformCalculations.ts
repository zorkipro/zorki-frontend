// Утилитарные функции для расчета данных платформ

import { ENGAGEMENT_COEFFICIENTS } from '@/config/constants';

export interface PlatformCalculationData {
  followers_count?: number;
  engagement_rate?: number;
  youtube_views?: string;
  youtube_subscribers?: string;
  post_price?: string;
  story_price?: string;
  story_reach?: string;
  instagram_post_reach?: string;
  tiktok_subscribers?: string;
  tiktok_reach?: string;
  tiktok_price?: string;
  telegram_subscribers?: string;
  telegram_reach?: string;
  telegram_price?: string;
  youtube_price?: string;
  youtube_post_reach?: string;
}

export interface CalculatedPlatformData {
  subscribers: number;
  er: number;
  reach: number;
  price: number;
  storyReach: number;
  storyPrice: number;
  views?: number;
}

/**
 * Безопасно парсит строку в число с fallback значением
 */
const safeParseInt = (value: string | undefined, fallback: number = 0): number => {
  if (!value) return fallback;
  const parsed = parseInt(value);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Рассчитывает данные для Instagram платформы
 */
export const calculateInstagramData = (data: PlatformCalculationData): CalculatedPlatformData => {
  const followers = data.followers_count || 0;
  const engagementRate = data.engagement_rate || 0;

  return {
    subscribers: followers,
    er: engagementRate,
    reach: safeParseInt(data.instagram_post_reach),
    price: safeParseInt(data.post_price),
    storyReach: safeParseInt(data.story_reach),
    storyPrice: safeParseInt(data.story_price),
  };
};

/**
 * Рассчитывает данные для TikTok платформы
 */
export const calculateTikTokData = (data: PlatformCalculationData): CalculatedPlatformData => {
  const subscribers = safeParseInt(data.tiktok_subscribers);
  const reach = safeParseInt(data.tiktok_reach);

  return {
    subscribers,
    er: 0, // TikTok не имеет engagement rate в текущей структуре
    reach,
    price: safeParseInt(data.tiktok_price),
    storyReach: 0, // TikTok не имеет stories
    storyPrice: 0,
  };
};

/**
 * Рассчитывает данные для Telegram платформы
 */
export const calculateTelegramData = (data: PlatformCalculationData): CalculatedPlatformData => {
  const subscribers = safeParseInt(data.telegram_subscribers);
  const reach = safeParseInt(data.telegram_reach);

  return {
    subscribers,
    er: 0, // Telegram не имеет engagement rate в текущей структуре
    reach,
    price: safeParseInt(data.telegram_price),
    storyReach: 0, // Telegram не имеет stories
    storyPrice: 0,
  };
};

/**
 * Рассчитывает данные для YouTube платформы
 */
export const calculateYouTubeData = (data: PlatformCalculationData): CalculatedPlatformData => {
  const subscribers = safeParseInt(data.youtube_subscribers);
  const views = safeParseInt(data.youtube_views);

  return {
    subscribers,
    er: 0, // YouTube не имеет engagement rate в текущей структуре
    reach: safeParseInt(data.youtube_post_reach),
    price: safeParseInt(data.youtube_price),
    storyReach: 0, // YouTube не имеет stories
    storyPrice: 0,
    views: views,
  };
};

/**
 * Рассчитывает все данные платформ
 */
export const calculateAllPlatformsData = (data: PlatformCalculationData) => {
  return {
    instagram: calculateInstagramData(data),
    tiktok: calculateTikTokData(data),
    telegram: calculateTelegramData(data),
    youtube: calculateYouTubeData(data),
  };
};
