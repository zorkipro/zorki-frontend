/**
 * Типы и интерфейсы для работы с платформами социальных сетей
 *
 * Этот файл содержит:
 * - Union type для всех поддерживаемых платформ
 * - Интерфейсы данных платформы
 * - Конфигурация платформы
 * - Type guard функции
 */

import type { ApiSocialType } from "@/api/types";

/**
 * Типы платформ социальных сетей (lowercase для внутреннего использования)
 */
export type PlatformType = "instagram" | "tiktok" | "youtube" | "telegram";

/**
 * Маппинг между внутренним типом и API типом
 */
export const PLATFORM_TO_API: Record<PlatformType, ApiSocialType> = {
  instagram: "INSTAGRAM",
  tiktok: "TIKTOK",
  youtube: "YOUTUBE",
  telegram: "TELEGRAM",
};

export const API_TO_PLATFORM: Record<ApiSocialType, PlatformType> = {
  INSTAGRAM: "instagram",
  TIKTOK: "tiktok",
  YOUTUBE: "youtube",
  TELEGRAM: "telegram",
};

/**
 * Данные платформы (используется внутри приложения)
 */
export interface IPlatformData {
  /** Имя пользователя на платформе */
  username?: string;
  /** URL профиля */
  profile_url?: string;
  /** Количество подписчиков */
  subscribers: number;
  /** Engagement rate (процент вовлеченности) */
  er: number;
  /** Охват постов */
  reach: number;
  /** Цена за пост */
  price: number;
  /** Охват сторис */
  storyReach: number;
  /** Цена за сторис */
  storyPrice: number;
  /** Цена за интеграцию */
  integrationPrice?: number;
  /** Количество просмотров (опционально, для YouTube) */
  views?: number;
}

/**
 * Конфигурация валидации полей платформы
 */
export interface IPlatformValidation {
  /** Минимальная длина username */
  usernameMinLength: number;
  /** Максимальная длина username */
  usernameMaxLength: number;
  /** Регулярное выражение для валидации username */
  usernamePattern?: RegExp;
  /** Минимальное количество подписчиков */
  minSubscribers: number;
  /** Минимальный ER */
  minEngagementRate: number;
  /** Максимальный ER */
  maxEngagementRate: number;
}

/**
 * Поля формы для платформы
 */
export type PlatformFormField =
  | "username"
  | "profile_url"
  | "followers"
  | "engagement_rate"
  | "post_reach"
  | "story_reach"
  | "post_price"
  | "story_price";

/**
 * Конфигурация платформы
 */
export interface IPlatformConfig {
  /** Отображаемое имя платформы */
  name: string;
  /** Иконка платформы (emoji или имя компонента) */
  icon: string;
  /** Цвет платформы (для UI) */
  color: string;
  /** Поля, которые доступны для этой платформы */
  fields: PlatformFormField[];
  /** Правила валидации */
  validation: IPlatformValidation;
  /** Плейсхолдеры для полей */
  placeholders: Partial<Record<PlatformFormField, string>>;
}

/**
 * Результат валидации данных платформы
 */
export interface ValidationResult {
  /** Валидация прошла успешно */
  isValid: boolean;
  /** Ошибки валидации (поле -> сообщение об ошибке) */
  errors: Partial<Record<PlatformFormField, string>>;
}

/**
 * Type guard: проверка, является ли значение типом платформы
 */
export function isPlatformType(value: unknown): value is PlatformType {
  return (
    typeof value === "string" &&
    ["instagram", "tiktok", "youtube", "telegram"].includes(value)
  );
}

/**
 * Type guard: проверка, содержит ли объект обязательные поля IPlatformData
 */
export function isValidPlatformData(data: unknown): data is IPlatformData {
  if (!data || typeof data !== "object") {
    return false;
  }

  const platformData = data as Partial<IPlatformData>;

  return (
    typeof platformData.subscribers === "number" &&
    typeof platformData.er === "number" &&
    typeof platformData.reach === "number" &&
    typeof platformData.price === "number" &&
    typeof platformData.storyReach === "number" &&
    typeof platformData.storyPrice === "number"
  );
}

/**
 * Type guard: проверка, является ли значение валидным ApiSocialType
 */
export function isApiSocialType(value: unknown): value is ApiSocialType {
  return (
    typeof value === "string" &&
    ["INSTAGRAM", "TIKTOK", "YOUTUBE", "TELEGRAM"].includes(value)
  );
}

/**
 * Преобразование PlatformType в ApiSocialType
 */
export function platformToApi(platform: PlatformType): ApiSocialType {
  return PLATFORM_TO_API[platform];
}

/**
 * Преобразование ApiSocialType в PlatformType
 */
export function apiToPlatform(apiType: ApiSocialType): PlatformType {
  return API_TO_PLATFORM[apiType];
}

/**
 * Список всех платформ
 */
export const ALL_PLATFORMS: PlatformType[] = [
  "instagram",
  "tiktok",
  "youtube",
  "telegram",
];
