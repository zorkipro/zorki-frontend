/**
 * Мапперы для профилей блогеров
 * Трансформация между API DTOs и Frontend типами
 */

import type { Blogger } from "@/types/blogger";
import type { EditData } from "@/types/profile";
import type {
  PublicGetAllBloggersOutputDto,
  PublicGetBloggerByIdOutputDto,
  BloggerUpdateProfileInputDto,
  ApiSocialType,
} from "@/api/types";
import {
  GENDER_MAP,
  WORK_FORMAT_MAP,
  WORK_FORMAT_REVERSE,
  GENDER_REVERSE,
} from "@/api/types";
import {
  parseBigInt,
  parseDecimal,
  splitFullName,
  joinFullName,
} from "./common-mappers";
import {
  mapSinglePlatform,
  mapMultiplePlatforms,
  findPrimaryPlatform,
} from "./platform-mappers";
import { convertTopicsToIds } from "./topic-mappers";

/**
 * Маппер для GET /blogger/public (список блогеров)
 *
 * Особенности API list response:
 * - social: ОДНА платформа (nullable)
 * - price: ОДИН объект цен
 * - topics, restrictedTopics: НЕТ в response
 * - allowsBarter, inMartRegistry: НЕТ в response
 *
 * @param api - DTO из API
 * @returns объект Blogger для Frontend
 */
export function mapApiListBloggerToLocal(
  api: PublicGetAllBloggersOutputDto,
): Blogger {
  const social = api.social;
  const price = api.price;

  // Собираем полное имя
  const fullName = joinFullName(api.name, api.lastName);

  // Если основное имя пустое, используем title из социального аккаунта
  const displayName = fullName || social?.title || api.name || "";

  // Маппим платформу если есть
  const platforms = social
    ? { [social.type.toLowerCase()]: mapSinglePlatform(social, price) }
    : {};

  return {
    id: String(api.id),
    name: displayName,
    handle: social ? `@${social.username}` : "",
    avatar: social?.avatar || "",
    promoText: social?.description || "",
    platforms,
    followers: parseBigInt(social?.subscribers),
    postPrice: parseDecimal(price.postPrice),
    storyPrice: parseDecimal(price.storiesPrice),
    postReach: parseBigInt(social?.postCoverage),
    storyReach: parseBigInt(social?.coverage),
    engagementRate: social?.er || 0,
    gender: api.genderType
      ? (GENDER_MAP[api.genderType] as
          | "мужчина"
          | "женщина"
          | "пара"
          | "паблик")
      : undefined,
    category: "", // Нет в list response
    topics: [], // Нет в list response
    allowsBarter: false, // Нет в list response
    inMartRegistry: false, // Нет в list response
    legalForm: undefined, // Нет в list response
    restrictedTopics: [],
    cooperationConditions: "",
    workFormat: undefined,
    paymentTerms: "",
  };
}

/**
 * Маппер для GET /blogger/public/:id (детальная информация блогера)
 *
 * Особенности API detail response:
 * - social: МАССИВ платформ
 * - price: МАССИВ цен (по типу платформы)
 * - topics, restrictedTopics: ЕСТЬ
 * - profileDraft, priceDraft, coverageDraft: ЕСТЬ (если юзер владелец)
 *
 * @param api - DTO из API
 * @returns объект Blogger для Frontend
 */
export function mapApiDetailBloggerToLocal(
  api: PublicGetBloggerByIdOutputDto,
): Blogger {
  // Найти основную платформу (Instagram приоритет, иначе первая)
  const primarySocial = findPrimaryPlatform(api.social);
  const primaryPrice =
    api.price.find((p) => p.type === primarySocial?.type) || api.price[0];

  // Собрать все платформы
  const platforms = mapMultiplePlatforms(api.social, api.price);

  // Собираем полное имя
  const fullName = joinFullName(api.name, api.lastName);

  // Если основное имя пустое, используем title из социального аккаунта
  const displayName = fullName || primarySocial?.title || api.name || "";

  return {
    id: String(api.id),
    name: displayName,
    handle: primarySocial ? `@${primarySocial.username}` : "",
    avatar: primarySocial?.avatar || "",
    promoText: api.description || primarySocial?.description || "", // Приоритет: описание профиля > описание соцсети
    platforms,
    followers: parseBigInt(primarySocial?.subscribers),
    postPrice: parseDecimal(primaryPrice?.postPrice),
    storyPrice: parseDecimal(primaryPrice?.storiesPrice),
    postReach: parseBigInt(primarySocial?.postCoverage), // ✅ Исправлено: охват постов
    storyReach: parseBigInt(primarySocial?.coverage), // ✅ Исправлено: охват сториз
    engagementRate: primarySocial?.er || 0,
    gender: api.genderType
      ? (GENDER_MAP[api.genderType] as
          | "мужчина"
          | "женщина"
          | "пара"
          | "паблик")
      : undefined,
    category: api.topics?.[0]?.name || "",
    topics: api.topics?.map((t) => t.id) || [],
    allowsBarter: api.isBarterAvailable,
    inMartRegistry: api.isMartRegistry ?? undefined,
    legalForm: api.workFormat
      ? (WORK_FORMAT_MAP[api.workFormat] as
          | "ИП"
          | "профдоход"
          | "договор подряда"
          | "ООО")
      : undefined,
    restrictedTopics: api.restrictedTopics?.map((t) => t.id) || [],
    cooperationConditions: "",
    workFormat: api.workFormat ? WORK_FORMAT_MAP[api.workFormat] : undefined,
    paymentTerms: "",
    contact_url: api.contactLink || undefined,
    verificationStatus: api.verificationStatus || undefined,
  };
}

/**
 * Маппер для PUT /blogger/:id (обновление профиля)
 *
 * Требует topicsLookup для конвертации названий тем в ID
 *
 * @param local - Частичные данные формы редактирования
 * @param topicsLookup - Справочник { "Мода": 1, "Красота": 2, ... }
 * @returns DTO для отправки в API
 */
export function mapLocalToApiUpdate(
  local: Partial<EditData>,
  topicsLookup: Record<string, number>,
): BloggerUpdateProfileInputDto {
  const { name, lastName } = splitFullName(local.full_name);

  // Конвертируем topics/banned_topics: названия -> ID, ID -> ID (без изменений)
  const topicIds = convertTopicsToIds(local.topics, topicsLookup);
  const restrictedTopicIds = convertTopicsToIds(
    local.banned_topics,
    topicsLookup,
  );

  // Определяем coverageSocialType и coverage для обновления охвата
  // Приоритет: Instagram > TikTok > YouTube > Telegram
  let coverageSocialType: ApiSocialType | undefined;
  let coverage: number | undefined;

  // Проверяем поля охвата сториз для всех платформ (в порядке приоритета)
  if (local.instagram_story_reach && local.instagram_story_reach !== "") {
    coverageSocialType = "INSTAGRAM";
    coverage = parseFloat(local.instagram_story_reach);
  } else if (local.tiktok_story_reach && local.tiktok_story_reach !== "") {
    coverageSocialType = "TIKTOK";
    coverage = parseFloat(local.tiktok_story_reach);
  } else if (local.youtube_story_reach && local.youtube_story_reach !== "") {
    coverageSocialType = "YOUTUBE";
    coverage = parseFloat(local.youtube_story_reach);
  } else if (local.telegram_story_reach && local.telegram_story_reach !== "") {
    coverageSocialType = "TELEGRAM";
    coverage = parseFloat(local.telegram_story_reach);
  }

  const result = {
    name: name || undefined,
    lastName: lastName || undefined,
    description: local.description || undefined,
    contactLink: local.contact_link || undefined,
    workFormat: local.work_format
      ? WORK_FORMAT_REVERSE[local.work_format]
      : undefined,
    genderType: local.gender_type
      ? GENDER_REVERSE[local.gender_type]
      : undefined,
    // topics и restrictedTopics REQUIRED! (можно пустой массив, но нельзя undefined)
    topics: topicIds,
    restrictedTopics: restrictedTopicIds,
    isBarterAvailable: local.barter_available,
    isMartRegistry: local.mart_registry,
    // coverageSocialType и coverage - для обновления охвата платформы
    coverageSocialType,
    coverage,
  };

  return result;
}
