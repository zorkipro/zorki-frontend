// Хук для работы с черновиками профиля

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { PublicGetBloggerByIdOutputDto } from '@/api/types';
import {
  extractProfileDraft,
  extractPriceDrafts,
  extractCoverageDrafts,
  mergePlatformDrafts,
  extractInstagramAccount,
} from '@/utils/draft-helpers';

// Локальный интерфейс для совместимости с существующим кодом
interface EditData {
  full_name: string;
  description: string;
  avatar_url: string;
  barter_available: boolean;
  mart_registry: boolean;
  contact_link: string;
  work_format: 'ИП' | 'профдоход' | 'договор подряда' | 'ООО';
  gender_type: 'мужчина' | 'женщина' | 'пара' | 'паблик';
  cooperation_conditions: string;

  instagram_username: string;
  instagram_profile_url: string;
  instagram_followers: string;
  instagram_engagement_rate: string;
  instagram_post_reach: string;
  instagram_story_reach: string;
  instagram_post_price: string;
  instagram_story_price: string;
  instagram_integration_price: string;

  tiktok_username: string;
  tiktok_profile_url: string;
  tiktok_followers: string;
  tiktok_engagement_rate: string;
  tiktok_post_reach: string;
  tiktok_story_reach: string;
  tiktok_post_price: string;
  tiktok_story_price: string;
  tiktok_integration_price: string;

  youtube_username: string;
  youtube_profile_url: string;
  youtube_followers: string;
  youtube_engagement_rate: string;
  youtube_post_reach: string;
  youtube_story_reach: string;
  youtube_post_price: string;
  youtube_story_price: string;
  youtube_integration_price: string;

  telegram_username: string;
  telegram_profile_url: string;
  telegram_followers: string;
  telegram_engagement_rate: string;
  telegram_post_reach: string;
  telegram_story_reach: string;
  telegram_post_price: string;
  telegram_story_price: string;
  telegram_integration_price: string;

  topics: string[];
  banned_topics: string[];
}

interface PlatformData {
  username?: string;
  profile_url?: string;
  subscribers: number;
  er: number;
  reach: number;
  price: number;
  storyReach: number;
  storyPrice: number;
  views?: number;
}

/**
 * Hook for working with profile drafts
 * Uses API response data instead of direct Supabase queries
 */
export const useProfileDrafts = (profileId?: string) => {
  const { user } = useAuth();
  const [hasDrafts, setHasDrafts] = useState(false);

  /**
   * Извлекает данные черновиков из API ответа и объединяет их с основными данными
   */
  const loadDrafts = useCallback(
    async (
      apiResponse: PublicGetBloggerByIdOutputDto,
      platformsData: Record<string, PlatformData>,
      topics: number[],
      bannedTopics: number[]
    ): Promise<EditData | null> => {
      if (!user || !apiResponse) return null;

      // Проверяем наличие черновиков в API ответе
      const hasAnyDrafts =
        !!apiResponse.profileDraft || !!apiResponse.priceDraft || !!apiResponse.coverageDraft;

      if (!hasAnyDrafts) {
        setHasDrafts(false);
        return null;
      }

      setHasDrafts(true);

      // Извлекаем данные из черновиков используя утилиты
      const profileDraftFields = extractProfileDraft(apiResponse.profileDraft);
      const priceDrafts = extractPriceDrafts(apiResponse.priceDraft);
      const coverageDrafts = extractCoverageDrafts(apiResponse.coverageDraft);

      // Объединяем черновики с опубликованными данными платформ
      const updatedPlatformsData = mergePlatformDrafts(platformsData, priceDrafts, coverageDrafts);

      // Получаем Instagram данные
      const instagram = extractInstagramAccount(apiResponse);

      // Объединяем все данные в EditData формат
      const mergedData: EditData = {
        // Основные данные профиля (приоритет черновикам)
        full_name:
          profileDraftFields.full_name ||
          (apiResponse.name
            ? `${apiResponse.name}${apiResponse.lastName ? ' ' + apiResponse.lastName : ''}`
            : ''),
        description: '', // Нет в API
        avatar_url: instagram.avatar, // Берём из Instagram аккаунта
        contact_link: profileDraftFields.contact_link || apiResponse.contactLink || '',
        work_format: profileDraftFields.work_format || 'ИП',
        gender_type: profileDraftFields.gender_type || 'женщина',
        barter_available:
          profileDraftFields.barter_available ?? apiResponse.isBarterAvailable ?? false,
        mart_registry: profileDraftFields.mart_registry ?? apiResponse.isMartRegistry ?? false,
        cooperation_conditions: '', // Нет в API

        // Instagram данные
        instagram_username: instagram.username,
        instagram_profile_url: '', // Нет в текущем API
        instagram_followers: instagram.subscribers.toString(),
        instagram_engagement_rate: instagram.engagementRate.toString(),
        instagram_post_reach: updatedPlatformsData.instagram?.reach?.toString() || '',
        instagram_story_reach: updatedPlatformsData.instagram?.storyReach?.toString() || '',
        instagram_post_price:
          priceDrafts.instagram?.post_price?.toString() ||
          updatedPlatformsData.instagram?.price?.toString() ||
          '',
        instagram_story_price:
          priceDrafts.instagram?.story_price?.toString() ||
          updatedPlatformsData.instagram?.storyPrice?.toString() ||
          '',
        instagram_integration_price:
          priceDrafts.instagram?.post_price?.toString() ||
          updatedPlatformsData.instagram?.price?.toString() ||
          '',

        // TikTok данные
        tiktok_username: updatedPlatformsData.tiktok?.username || '',
        tiktok_profile_url: updatedPlatformsData.tiktok?.profile_url || '',
        tiktok_followers: updatedPlatformsData.tiktok?.subscribers?.toString() || '',
        tiktok_engagement_rate: updatedPlatformsData.tiktok?.er?.toString() || '',
        tiktok_post_reach: updatedPlatformsData.tiktok?.reach?.toString() || '',
        tiktok_story_reach: updatedPlatformsData.tiktok?.storyReach?.toString() || '',
        tiktok_post_price:
          priceDrafts.tiktok?.post_price?.toString() ||
          updatedPlatformsData.tiktok?.price?.toString() ||
          '',
        tiktok_story_price:
          priceDrafts.tiktok?.story_price?.toString() ||
          updatedPlatformsData.tiktok?.storyPrice?.toString() ||
          '',
        tiktok_integration_price:
          priceDrafts.tiktok?.post_price?.toString() ||
          updatedPlatformsData.tiktok?.price?.toString() ||
          '',

        // YouTube данные
        youtube_username: updatedPlatformsData.youtube?.username || '',
        youtube_profile_url: updatedPlatformsData.youtube?.profile_url || '',
        youtube_followers: updatedPlatformsData.youtube?.subscribers?.toString() || '',
        youtube_engagement_rate: updatedPlatformsData.youtube?.er?.toString() || '',
        youtube_post_reach: updatedPlatformsData.youtube?.reach?.toString() || '',
        youtube_story_reach: updatedPlatformsData.youtube?.storyReach?.toString() || '',
        youtube_post_price:
          priceDrafts.youtube?.post_price?.toString() ||
          updatedPlatformsData.youtube?.price?.toString() ||
          '',
        youtube_story_price:
          priceDrafts.youtube?.story_price?.toString() ||
          updatedPlatformsData.youtube?.storyPrice?.toString() ||
          '',
        youtube_integration_price:
          priceDrafts.youtube?.post_price?.toString() ||
          updatedPlatformsData.youtube?.price?.toString() ||
          '',

        // Telegram данные
        telegram_username: updatedPlatformsData.telegram?.username || '',
        telegram_profile_url: updatedPlatformsData.telegram?.profile_url || '',
        telegram_followers: updatedPlatformsData.telegram?.subscribers?.toString() || '',
        telegram_engagement_rate: updatedPlatformsData.telegram?.er?.toString() || '',
        telegram_post_reach: updatedPlatformsData.telegram?.reach?.toString() || '',
        telegram_story_reach: updatedPlatformsData.telegram?.storyReach?.toString() || '',
        telegram_post_price:
          priceDrafts.telegram?.post_price?.toString() ||
          updatedPlatformsData.telegram?.price?.toString() ||
          '',
        telegram_story_price:
          priceDrafts.telegram?.story_price?.toString() ||
          updatedPlatformsData.telegram?.storyPrice?.toString() ||
          '',
        telegram_integration_price:
          priceDrafts.telegram?.post_price?.toString() ||
          updatedPlatformsData.telegram?.price?.toString() ||
          '',

        // Темы
        topics,
        banned_topics: bannedTopics,
      };

      return mergedData;
    },
    [user]
  );

  return {
    hasDrafts,
    loadDrafts,
  };
};
