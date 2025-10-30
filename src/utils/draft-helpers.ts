/**
 * Утилиты для работы с черновиками профиля
 * Извлечение и объединение данных из API черновиков
 */

import type {
  PublicGetBloggerByIdProfileDraftOutputDto,
  PublicGetBloggerByIdPriceDraftOutputDto,
  PublicGetBloggerByIdCoverageDraftOutputDto,
  PublicGetBloggerByIdOutputDto,
  ApiSocialType,
} from "@/api/types";
import type { PlatformType } from "@/types/platform";
import { ALL_PLATFORMS } from "@/types/platform";

/**
 * Маппинг ApiSocialType в локальный формат платформы
 */
function mapApiSocialTypeToLocal(apiType: ApiSocialType): string | null {
  switch (apiType) {
    case "INSTAGRAM":
      return "instagram";
    case "TIKTOK":
      return "tiktok";
    case "YOUTUBE":
      return "youtube";
    case "TELEGRAM":
      return "telegram";
    default:
      return null;
  }
}

// ============================================
// Types
// ============================================

export interface PlatformDraftData {
  post_price?: number;
  story_price?: number;
  integration_price?: number;
  post_reach?: number;
  story_reach?: number;
}

export interface ProfileDraftFields {
  full_name?: string;
  description?: string;
  avatar_url?: string;
  contact_link?: string;
  work_format?: "ИП" | "профдоход" | "договор подряда" | "ООО";
  gender_type?: "мужчина" | "женщина" | "пара" | "паблик";
  barter_available?: boolean;
  mart_registry?: boolean;
  cooperation_conditions?: string;
}

// ============================================
// Profile Draft Extraction
// ============================================

/**
 * Извлекает данные профиля из черновика
 */
export function extractProfileDraft(
  profileDraft: PublicGetBloggerByIdProfileDraftOutputDto | null | undefined,
): ProfileDraftFields {
  if (!profileDraft) {
    return {};
  }

  return {
    full_name: profileDraft.name || undefined,
    contact_link: profileDraft.contactLink || undefined,
    work_format: mapWorkFormatFromApi(profileDraft.workFormat),
    gender_type: mapGenderTypeFromApi(profileDraft.genderType),
    barter_available: profileDraft.isBarterAvailable ?? undefined,
    mart_registry: profileDraft.isMartRegistry ?? undefined,
  };
}

/**
 * Маппинг workFormat из API в локальный формат
 */
function mapWorkFormatFromApi(
  apiFormat?: string,
): "ИП" | "профдоход" | "договор подряда" | "ООО" | undefined {
  if (!apiFormat) return undefined;

  switch (apiFormat) {
    case "SOLE_PROPRIETOR":
      return "ИП";
    case "SELF_EMPLOYED":
      return "профдоход";
    case "SERVICE_CONTRACT":
      return "договор подряда";
    case "LLC":
      return "ООО";
    default:
      return "ИП";
  }
}

/**
 * Маппинг genderType из API в локальный формат
 */
function mapGenderTypeFromApi(
  apiGender?: string,
): "мужчина" | "женщина" | "пара" | "паблик" | undefined {
  if (!apiGender) return undefined;

  switch (apiGender) {
    case "MALE":
      return "мужчина";
    case "FEMALE":
      return "женщина";
    case "COUPLE":
      return "пара";
    case "PUBLIC_PAGE":
      return "паблик";
    default:
      return "женщина";
  }
}

// ============================================
// Price Draft Extraction
// ============================================

/**
 * Извлекает данные цен из черновиков для всех платформ
 * priceDrafts - массив черновиков, где каждый элемент для одной платформы
 */
export function extractPriceDrafts(
  priceDrafts: PublicGetBloggerByIdPriceDraftOutputDto[] | null | undefined,
): Record<string, PlatformDraftData> {
  if (!priceDrafts || priceDrafts.length === 0) {
    return {};
  }

  const platformData: Record<string, PlatformDraftData> = {};

  priceDrafts.forEach((draft) => {
    const platformKey = mapApiSocialTypeToLocal(draft.type);
    if (platformKey) {
      platformData[platformKey] = {
        post_price: draft.postPrice ? parseFloat(draft.postPrice) : undefined,
        story_price: draft.storiesPrice
          ? parseFloat(draft.storiesPrice)
          : undefined,
        integration_price: draft.integrationPrice
          ? parseFloat(draft.integrationPrice)
          : undefined,
      };
    }
  });

  return platformData;
}

// ============================================
// Coverage Draft Extraction
// ============================================

/**
 * Извлекает данные охвата из черновиков для всех платформ
 * coverageDrafts - массив черновиков, где каждый элемент для одной платформы
 */
export function extractCoverageDrafts(
  coverageDrafts:
    | PublicGetBloggerByIdCoverageDraftOutputDto[]
    | null
    | undefined,
): Record<string, PlatformDraftData> {
  if (!coverageDrafts || coverageDrafts.length === 0) {
    return {};
  }

  const platformData: Record<string, PlatformDraftData> = {};

  coverageDrafts.forEach((draft) => {
    const platformKey = mapApiSocialTypeToLocal(draft.type);
    if (platformKey) {
      const coverage = draft.coverage
        ? parseInt(draft.coverage, 10)
        : undefined;
      platformData[platformKey] = {
        post_reach: coverage,
        // story_reach обычно не хранится отдельно в coverageDraft
      };
    }
  });

  return platformData;
}

// ============================================
// Merge Drafts with Published Data
// ============================================

/**
 * Объединяет данные черновиков с данными из platformsData
 */
export function mergePlatformDrafts<T extends Record<string, any>>(
  platformsData: T,
  priceDrafts: Record<string, PlatformDraftData>,
  coverageDrafts: Record<string, PlatformDraftData>,
): T {
  const updatedData: Record<string, any> = { ...platformsData };

  ALL_PLATFORMS.forEach((platform) => {
    const priceData = priceDrafts[platform] || {};
    const coverageData = coverageDrafts[platform] || {};

    if (
      Object.keys(priceData).length > 0 ||
      Object.keys(coverageData).length > 0
    ) {
      updatedData[platform] = {
        ...updatedData[platform],
        // Черновики имеют приоритет над основными данными
        price: priceData.post_price !== undefined ? priceData.post_price : (updatedData[platform]?.price ?? 0),
        storyPrice: priceData.story_price !== undefined ? priceData.story_price : (updatedData[platform]?.storyPrice ?? 0),
        integrationPrice: priceData.integration_price !== undefined ? priceData.integration_price : (updatedData[platform]?.integrationPrice ?? 0),
        reach: coverageData.post_reach !== undefined ? coverageData.post_reach : (updatedData[platform]?.reach ?? 0),
        storyReach: coverageData.story_reach !== undefined ? coverageData.story_reach : (updatedData[platform]?.storyReach ?? 0),
      };
    }
  });

  return updatedData as T;
}

/**
 * Извлекает Instagram данные из социальных аккаунтов
 */
export function extractInstagramAccount(
  apiResponse: PublicGetBloggerByIdOutputDto,
) {
  const instagramAccount = apiResponse.social?.find(
    (account) => account.type === "INSTAGRAM",
  );
  return {
    username: instagramAccount?.username || "",
    avatar: instagramAccount?.avatar || "",
    subscribers: instagramAccount?.subscribers
      ? parseInt(instagramAccount.subscribers, 10)
      : 0,
    engagementRate: instagramAccount?.er || 0,
    coverage: instagramAccount?.postCoverage
      ? parseInt(instagramAccount.postCoverage, 10)
      : 0,
  };
}
