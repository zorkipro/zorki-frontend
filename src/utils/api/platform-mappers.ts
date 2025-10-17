/**
 * Мапперы для данных социальных платформ
 * Трансформация данных платформ между API и Frontend
 */

import type { Blogger, PlatformData } from '@/types/blogger';
import type {
  PublicGetAllBloggersSocialAccOutputDto,
  PublicGetAllBloggersSocialPriceOutputDto,
} from '@/api/types';
import { parseBigInt, parseDecimal } from './common-mappers';

/**
 * Маппит одну социальную платформу из API list response
 *
 * @param social - данные социального аккаунта
 * @param price - данные цен для этой платформы
 * @returns объект с данными платформы в формате Frontend
 */
export function mapSinglePlatform(
  social: PublicGetAllBloggersSocialAccOutputDto,
  price: PublicGetAllBloggersSocialPriceOutputDto
): PlatformData {
  return {
    username: social.username || '',
    profile_url: social.externalId || '',
    subscribers: parseBigInt(social.subscribers),
    er: social.er || 0,
    reach: parseBigInt(social.postCoverage),
    price: parseDecimal(price.postPrice),
    storyReach: parseBigInt(social.coverage), // Охват сторис
    storyPrice: parseDecimal(price.storiesPrice),
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
  socials: PublicGetAllBloggersSocialAccOutputDto[] | null | undefined,
  prices: PublicGetAllBloggersSocialPriceOutputDto[]
): Blogger['platforms'] {
  if (!socials || socials.length === 0) {
    return {};
  }

  const platforms: Blogger['platforms'] = {};

  socials.forEach((social) => {
    const priceData = prices.find((p) => p.type === social.type);
    if (priceData) {
      platforms[social.type.toLowerCase()] = {
        username: social.username || '',
        profile_url: social.externalId || '',
        subscribers: parseBigInt(social.subscribers),
        er: social.er || 0,
        reach: parseBigInt(social.postCoverage), // ✅ Исправлено: охват постов
        price: parseDecimal(priceData.postPrice),
        storyReach: parseBigInt(social.coverage), // ✅ Исправлено: охват сториз
        storyPrice: parseDecimal(priceData.storiesPrice),
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
  socials: PublicGetAllBloggersSocialAccOutputDto[] | null | undefined
): PublicGetAllBloggersSocialAccOutputDto | undefined {
  if (!socials || socials.length === 0) {
    return undefined;
  }
  return socials.find((s) => s.type === 'INSTAGRAM') || socials[0];
}
