/**
 * Утилиты для работы с платформами социальных сетей
 *
 * Универсальные функции для:
 * - Генерации полей форм
 * - Извлечения данных платформы
 * - Маппинга в API формат
 * - Обновления цен
 *
 * Устраняет дублирование кода для работы с платформами
 */

import type { PlatformType, IPlatformData } from "@/types/platform";
import type {
  ApiSocialType,
  BloggerUpdateSocialPriceInputDto,
} from "@/api/types";
import { platformToApi, ALL_PLATFORMS } from "@/types/platform";
import { PLATFORM_CONFIGS } from "@/config/platforms";
import { platformService } from "@/services/PlatformService";

/**
 * Интерфейс для обновления цен платформы
 */
export interface PriceUpdate {
  platform: PlatformType;
  postPrice?: number;
  storyPrice?: number;
}

/**
 * Генерация полей формы для указанных платформ
 * Используется для инициализации formData в редакторах профиля
 *
 * @param platforms - Массив платформ
 * @returns Объект с полями для всех платформ
 *
 * @example
 * const formFields = generatePlatformFormFields(['instagram', 'tiktok']);
 * // Результат: { instagram_username: '', instagram_followers: '', ... }
 */
export function generatePlatformFormFields(
  platforms: PlatformType[] = ALL_PLATFORMS,
): Record<string, string> {
  const fields: Record<string, string> = {};

  platforms.forEach((platform) => {
    const config = PLATFORM_CONFIGS[platform];

    config.fields.forEach((field) => {
      const fieldName = `${platform}_${field}`;
      fields[fieldName] = "";
    });
  });

  return fields;
}

/**
 * Извлечение данных конкретной платформы из formData
 *
 * @param formData - Объект с данными формы
 * @param platform - Тип платформы
 * @returns Стандартизированные данные платформы
 *
 * @example
 * const instagramData = extractPlatformData(formData, 'instagram');
 */
export function extractPlatformData(
  formData: Record<string, unknown>,
  platform: PlatformType,
): IPlatformData {
  const prefix = `${platform}_`;

  // Извлекаем поля с префиксом платформы
  const platformData: Record<string, unknown> = {};

  Object.keys(formData).forEach((key) => {
    if (key.startsWith(prefix)) {
      const fieldName = key.substring(prefix.length);
      platformData[fieldName] = formData[key];
    }
  });

  // Преобразуем строковые значения в числа
  const parsedData: Record<string, unknown> = {
    username: platformData.username,
    profile_url: platformData.profile_url,
    subscribers: parseNumberFromString(platformData.followers as string),
    er: parseNumberFromString(platformData.engagement_rate as string),
    reach: parseNumberFromString(platformData.post_reach as string),
    price: parseNumberFromString(platformData.post_price as string),
    storyReach: parseNumberFromString(platformData.story_reach as string),
    storyPrice: parseNumberFromString(platformData.story_price as string),
  };

  return platformService.getPlatformData(platform, parsedData);
}

/**
 * Извлечение данных всех платформ из formData
 *
 * @param formData - Объект с данными формы
 * @param platforms - Массив платформ для извлечения
 * @returns Объект с данными всех платформ
 */
export function extractAllPlatformsData(
  formData: Record<string, unknown>,
  platforms: PlatformType[] = ALL_PLATFORMS,
): Record<PlatformType, IPlatformData> {
  const result: Partial<Record<PlatformType, IPlatformData>> = {};

  platforms.forEach((platform) => {
    result[platform] = extractPlatformData(formData, platform);
  });

  return result as Record<PlatformType, IPlatformData>;
}

/**
 * Маппинг данных платформы в формат API для обновления цен
 *
 * @param platform - Тип платформы
 * @param data - Данные платформы
 * @returns DTO для API запроса обновления цен
 */
export function mapPlatformToApiPriceUpdate(
  platform: PlatformType,
  data: Partial<IPlatformData>,
): BloggerUpdateSocialPriceInputDto {
  return {
    type: platformToApi(platform),
    postPrice: data.price,
    storiesPrice: data.storyPrice,
  };
}

/**
 * Обновление цен платформ в объекте platforms
 * Используется для оптимистичного обновления UI
 *
 * @param platforms - Текущие данные платформ
 * @param updates - Массив обновлений цен
 * @returns Обновленный объект платформ
 *
 * @example
 * const updated = updatePlatformPrices(platforms, [
 *   { platform: 'instagram', postPrice: 50000, storyPrice: 30000 }
 * ]);
 */
export function updatePlatformPrices(
  platforms: Record<string, IPlatformData>,
  updates: PriceUpdate[],
): Record<string, IPlatformData> {
  const updatedPlatforms = { ...platforms };

  updates.forEach(({ platform, postPrice, storyPrice }) => {
    if (updatedPlatforms[platform]) {
      updatedPlatforms[platform] = {
        ...updatedPlatforms[platform],
        price: postPrice ?? updatedPlatforms[platform].price,
        storyPrice: storyPrice ?? updatedPlatforms[platform].storyPrice,
      };
    }
  });

  return updatedPlatforms;
}

/**
 * Заполнение formData данными платформы
 * Обратная операция к extractPlatformData
 *
 * @param platform - Тип платформы
 * @param data - Данные платформы
 * @returns Объект с полями формы для этой платформы
 *
 * @example
 * const fields = populatePlatformFormData('instagram', instagramData);
 * // { instagram_username: '@user', instagram_followers: '10000', ... }
 */
export function populatePlatformFormData(
  platform: PlatformType,
  data: Partial<IPlatformData>,
): Record<string, string> {
  const prefix = `${platform}_`;

  return {
    [`${prefix}username`]: data.username || "",
    [`${prefix}profile_url`]: data.profile_url || "",
    [`${prefix}followers`]: data.subscribers?.toString() || "",
    [`${prefix}engagement_rate`]: data.er?.toString() || "",
    [`${prefix}post_reach`]: data.reach?.toString() || "",
    [`${prefix}story_reach`]: data.storyReach?.toString() || "",
    [`${prefix}post_price`]: data.price?.toString() || "",
    [`${prefix}story_price`]: data.storyPrice?.toString() || "",
  };
}

/**
 * Заполнение formData для всех платформ
 *
 * @param platformsData - Объект с данными всех платформ
 * @returns Объект со всеми полями формы
 */
export function populateAllPlatformsFormData(
  platformsData: Partial<Record<PlatformType, IPlatformData>>,
): Record<string, string> {
  const allFields: Record<string, string> = {};

  (Object.entries(platformsData) as [PlatformType, IPlatformData][]).forEach(
    ([platform, data]) => {
      Object.assign(allFields, populatePlatformFormData(platform, data));
    },
  );

  return allFields;
}

/**
 * Получить имя поля формы для платформы
 *
 * @param platform - Тип платформы
 * @param field - Название поля
 * @returns Полное имя поля формы
 *
 * @example
 * getPlatformFieldName('instagram', 'followers') // 'instagram_followers'
 */
export function getPlatformFieldName(
  platform: PlatformType,
  field: string,
): string {
  return `${platform}_${field}`;
}

/**
 * Парсинг строки в число (обрабатывает пустые строки и невалидные значения)
 */
function parseNumberFromString(value: string | unknown): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string" || value === "") {
    return 0;
  }

  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Проверка, заполнены ли данные платформы
 *
 * @param data - Данные платформы
 * @returns true, если хотя бы username или subscribers указаны
 */
export function isPlatformDataFilled(data: Partial<IPlatformData>): boolean {
  return !!(data.username || (data.subscribers && data.subscribers > 0));
}

/**
 * Получить список платформ с заполненными данными
 *
 * @param platformsData - Объект с данными всех платформ
 * @returns Массив платформ с заполненными данными
 */
export function getFilledPlatforms(
  platformsData: Partial<Record<PlatformType, IPlatformData>>,
): PlatformType[] {
  return (Object.entries(platformsData) as [PlatformType, IPlatformData][])
    .filter(([_, data]) => isPlatformDataFilled(data))
    .map(([platform, _]) => platform);
}

/**
 * Создать пустой объект данных платформы
 */
export function createEmptyPlatformData(): IPlatformData {
  return {
    username: undefined,
    profile_url: undefined,
    subscribers: 0,
    er: 0,
    reach: 0,
    price: 0,
    storyReach: 0,
    storyPrice: 0,
  };
}
