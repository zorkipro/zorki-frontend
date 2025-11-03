import type { EditData } from "@/types/profile";
import type { PlatformType } from "@/types/platform";

/**
 * Создает имя поля для платформы
 */
export const getPlatformField = (platform: PlatformType, field: string): keyof EditData =>
  `${platform}_${field}` as keyof EditData;

/**
 * Получает значения цен для платформы из данных
 */
export const getPlatformPrices = (data: Partial<EditData>, platform: PlatformType) => ({
  postPrice: data[getPlatformField(platform, "post_price")],
  storyPrice: data[getPlatformField(platform, "story_price")],
  integrationPrice: data[getPlatformField(platform, "integration_price")],
});

/**
 * Безопасный parseFloat с fallback
 */
export const safeParseFloat = (value: string | number | undefined, fallback = 0): number => {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Безопасный parseFloat который возвращает undefined вместо 0
 */
export const safeParseFloatOrUndefined = (value: string | number | undefined): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(parsed) ? undefined : parsed;
};

/**
 * Сортирует платформы: Instagram первый, остальные по алфавиту
 */
export const sortPlatforms = ([a]: [string, any], [b]: [string, any]) => {
  if (a === "instagram") return -1;
  if (b === "instagram") return 1;
  return a.localeCompare(b);
};

