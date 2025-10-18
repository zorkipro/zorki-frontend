/**
 * Мапперы для данных социальных платформ
 * Трансформация данных платформ между API и Frontend
 */

import type { Blogger, PlatformData } from "@/types/blogger";
import type { Screenshot } from "@/types/profile";
import type {
  PublicGetAllBloggersSocialAccOutputDto,
  PublicGetAllBloggersSocialPriceOutputDto,
  PublicGetBloggerByIdSocialAccOutputDto,
} from "@/api/types";
import { parseBigInt, parseDecimal } from "./common-mappers";

/**
 * Маппит одну социальную платформу из API list response
 *
 * @param social - данные социального аккаунта
 * @param price - данные цен для этой платформы
 * @returns объект с данными платформы в формате Frontend
 */
export function mapSinglePlatform(
  social: PublicGetAllBloggersSocialAccOutputDto,
  price: PublicGetAllBloggersSocialPriceOutputDto,
): PlatformData {
  return {
    username: social.username || "",
    profile_url: social.externalId || "",
    subscribers: parseBigInt(social.subscribers),
    er: social.er || 0,
    reach: parseBigInt(social.postCoverage),
    price: parseDecimal(price.postPrice),
    storyReach: parseBigInt(social.coverage), // Охват сторис
    storyPrice: parseDecimal(price.storiesPrice),
    screenshots: [], // В list response нет скриншотов
  };
}

/**
 * Маппит массив платформ в объект platforms
 *
 * @param socials - массив социальных аккаунтов
 * @param prices - массив цен
 * @returns объект с ключами - типы платформ (lowercase)
 */
export function mapMultiplePlatforms(
  socials: PublicGetBloggerByIdSocialAccOutputDto[] | null | undefined,
  prices: PublicGetAllBloggersSocialPriceOutputDto[],
): Blogger["platforms"] {
  if (!socials || socials.length === 0) {
    return {};
  }

  const platforms: Blogger["platforms"] = {};

  socials.forEach((social) => {
    const priceData = prices.find((p) => p.type === social.type);
    if (priceData) {
      // Преобразуем скриншоты из API формата в локальный формат
      const screenshots: Screenshot[] = social.statsFiles?.map(file => ({
        id: file.id,
        influencer_id: 0, // Будет заполнено позже
        platform: social.type.toLowerCase(),
        file_name: file.name,
        file_url: file.publicUrl,
        file_size: file.size * 1024, // Конвертируем KB в байты
        width: file.width,
        height: file.height,
        created_at: file.createdAt,
        is_draft: false,
      })) || [];

      platforms[social.type.toLowerCase()] = {
        username: social.username || "",
        profile_url: social.externalId || "",
        subscribers: parseBigInt(social.subscribers),
        er: social.er || 0,
        reach: parseBigInt(social.postCoverage), // ✅ Исправлено: охват постов
        price: parseDecimal(priceData.postPrice),
        storyReach: parseBigInt(social.coverage), // ✅ Исправлено: охват сториз
        storyPrice: parseDecimal(priceData.storiesPrice),
        screenshots, // Добавляем скриншоты
      };
    }
  });

  return platforms;
}

/**
 * Находит основную платформу (Instagram приоритет, иначе первая)
 *
 * @param socials - массив социальных аккаунтов
 * @returns основная платформа или undefined
 */
export function findPrimaryPlatform(
  socials: PublicGetBloggerByIdSocialAccOutputDto[] | null | undefined,
): PublicGetBloggerByIdSocialAccOutputDto | undefined {
  if (!socials || socials.length === 0) {
    return undefined;
  }
  return socials.find((s) => s.type === "INSTAGRAM") || socials[0];
}
