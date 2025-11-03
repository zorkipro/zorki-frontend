// Хук для работы с черновиками профиля

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { PublicGetBloggerByIdOutputDto } from "@/api/types";
import {
  extractProfileDraft,
  extractPriceDrafts,
  extractCoverageDrafts,
  mergePlatformDrafts,
  extractInstagramAccount,
} from "@/utils/draft-helpers";
import { ALL_PLATFORMS } from "@/types/platform";

// Локальный интерфейс для совместимости с существующим кодом
interface EditData {
  full_name: string;
  description: string;
  avatar_url: string;
  barter_available: boolean;
  mart_registry: boolean;
  contact_link: string;
  work_format: "ИП" | "профдоход" | "договор подряда" | "ООО";
  gender_type: "мужчина" | "женщина" | "пара" | "паблик";
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
  integrationPrice?: number;
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
      bannedTopics: number[],
    ): Promise<EditData | null> => {
      if (!user || !apiResponse) return null;

      // Проверяем наличие черновиков в API ответе
      const hasAnyDrafts =
        !!apiResponse.profileDraft ||
        !!apiResponse.priceDraft ||
        !!apiResponse.coverageDraft;

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
      const updatedPlatformsData = mergePlatformDrafts(
        platformsData,
        priceDrafts,
        coverageDrafts,
      );

      const instagram = extractInstagramAccount(apiResponse);
      
      const getPrice = (platform: string, field: 'post_price' | 'story_price' | 'integration_price') => {
        const priceDraft = priceDrafts[platform]?.[field];
        const platformData = updatedPlatformsData[platform];
        if (priceDraft !== undefined) return priceDraft.toString();
        if (field === 'post_price') return platformData?.price?.toString() || "";
        if (field === 'story_price') return platformData?.storyPrice?.toString() || "";
        return platformData?.integrationPrice?.toString() || "";
      };

      const mergedData: EditData = {
        full_name: profileDraftFields.full_name ||
          (apiResponse.name ? `${apiResponse.name}${apiResponse.lastName ? " " + apiResponse.lastName : ""}` : ""),
        description: "",
        avatar_url: instagram.avatar,
        contact_link: profileDraftFields.contact_link || apiResponse.contactLink || "",
        work_format: profileDraftFields.work_format || "ИП",
        gender_type: profileDraftFields.gender_type || "женщина",
        barter_available: profileDraftFields.barter_available ?? apiResponse.isBarterAvailable ?? false,
        mart_registry: profileDraftFields.mart_registry ?? apiResponse.isMartRegistry ?? false,
        cooperation_conditions: profileDraftFields.cooperation_conditions || apiResponse.cooperation || "",
        topics: topics.map(t => t.toString()),
        banned_topics: bannedTopics.map(t => t.toString()),
      } as EditData;

      // Заполняем данные для всех платформ циклом
      ALL_PLATFORMS.forEach((platform) => {
        const platformData = updatedPlatformsData[platform];
        const isInstagram = platform === "instagram";
        
        mergedData[`${platform}_username` as keyof EditData] = 
          (isInstagram ? instagram.username : platformData?.username) || "";
        mergedData[`${platform}_profile_url` as keyof EditData] = 
          (isInstagram ? "" : platformData?.profile_url) || "";
        mergedData[`${platform}_followers` as keyof EditData] = 
          (isInstagram ? instagram.subscribers.toString() : platformData?.subscribers?.toString()) || "";
        mergedData[`${platform}_engagement_rate` as keyof EditData] = 
          (isInstagram ? instagram.engagementRate.toString() : platformData?.er?.toString()) || "";
        mergedData[`${platform}_post_reach` as keyof EditData] = 
          platformData?.reach?.toString() || "";
        mergedData[`${platform}_story_reach` as keyof EditData] = 
          platformData?.storyReach?.toString() || "";
        mergedData[`${platform}_post_price` as keyof EditData] = getPrice(platform, 'post_price');
        mergedData[`${platform}_story_price` as keyof EditData] = getPrice(platform, 'story_price');
        mergedData[`${platform}_integration_price` as keyof EditData] = getPrice(platform, 'integration_price');
      });

      return mergedData;
    },
    [user],
  );

  return {
    hasDrafts,
    loadDrafts,
  };
};
