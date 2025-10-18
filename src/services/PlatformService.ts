/**
 * Сервис для работы с платформами социальных сетей
 *
 * Центральная точка для всех операций с платформами:
 * - Получение данных платформы
 * - Валидация
 * - Форматирование полей
 * - Генерация форм
 * - Слияние черновиков
 *
 * @example
 * const platformService = new PlatformService();
 * const data = platformService.getPlatformData('instagram', rawData);
 * const isValid = platformService.validatePlatformData('instagram', data);
 */

import type {
  PlatformType,
  IPlatformData,
  PlatformFormField,
  ValidationResult,
} from "@/types/platform";
import { PLATFORM_CONFIGS } from "@/config/platforms";
import { isPlatformType } from "@/types/platform";

/**
 * Сервис для работы с платформами
 */
export class PlatformService {
  /**
   * Получить данные платформы из любого источника
   * Приводит данные к стандартному формату IPlatformData
   *
   * @param platform - Тип платформы
   * @param data - Сырые данные (может быть любой объект)
   * @returns Стандартизированные данные платформы
   */
  getPlatformData(
    platform: PlatformType,
    data: Record<string, unknown>,
  ): IPlatformData {
    return {
      username: this.extractString(data, "username"),
      profile_url:
        this.extractString(data, "profile_url") ||
        this.extractString(data, "profileUrl"),
      subscribers:
        this.extractNumber(data, "subscribers") ||
        this.extractNumber(data, "followers") ||
        0,
      er:
        this.extractNumber(data, "er") ||
        this.extractNumber(data, "engagement_rate") ||
        this.extractNumber(data, "engagementRate") ||
        0,
      reach:
        this.extractNumber(data, "reach") ||
        this.extractNumber(data, "post_reach") ||
        this.extractNumber(data, "postReach") ||
        0,
      price:
        this.extractNumber(data, "price") ||
        this.extractNumber(data, "post_price") ||
        this.extractNumber(data, "postPrice") ||
        0,
      storyReach:
        this.extractNumber(data, "storyReach") ||
        this.extractNumber(data, "story_reach") ||
        0,
      storyPrice:
        this.extractNumber(data, "storyPrice") ||
        this.extractNumber(data, "story_price") ||
        0,
      views: this.extractNumber(data, "views"),
    };
  }

  /**
   * Валидация данных платформы
   *
   * @param platform - Тип платформы
   * @param data - Данные для валидации
   * @returns Результат валидации с ошибками (если есть)
   */
  validatePlatformData(
    platform: PlatformType,
    data: Partial<IPlatformData>,
  ): ValidationResult {
    const config = PLATFORM_CONFIGS[platform];
    const errors: Partial<Record<PlatformFormField, string>> = {};

    // Валидация username
    if (data.username !== undefined) {
      if (data.username.length < config.validation.usernameMinLength) {
        errors.username = `Минимальная длина: ${config.validation.usernameMinLength} символов`;
      } else if (data.username.length > config.validation.usernameMaxLength) {
        errors.username = `Максимальная длина: ${config.validation.usernameMaxLength} символов`;
      } else if (
        config.validation.usernamePattern &&
        !config.validation.usernamePattern.test(data.username)
      ) {
        errors.username = "Неверный формат username";
      }
    }

    // Валидация подписчиков
    if (
      data.subscribers !== undefined &&
      data.subscribers < config.validation.minSubscribers
    ) {
      errors.followers = `Минимальное количество: ${config.validation.minSubscribers}`;
    }

    // Валидация ER
    if (data.er !== undefined) {
      if (data.er < config.validation.minEngagementRate) {
        errors.engagement_rate = `Минимальное значение: ${config.validation.minEngagementRate}%`;
      } else if (data.er > config.validation.maxEngagementRate) {
        errors.engagement_rate = `Максимальное значение: ${config.validation.maxEngagementRate}%`;
      }
    }

    // Валидация цен (не могут быть отрицательными)
    if (data.price !== undefined && data.price < 0) {
      errors.post_price = "Цена не может быть отрицательной";
    }

    if (data.storyPrice !== undefined && data.storyPrice < 0) {
      errors.story_price = "Цена не может быть отрицательной";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Форматирование поля платформы для отображения
   *
   * @param platform - Тип платформы
   * @param field - Название поля
   * @param value - Значение поля
   * @returns Отформатированное значение
   */
  formatPlatformField(
    platform: PlatformType,
    field: PlatformFormField,
    value: unknown,
  ): string {
    if (value === null || value === undefined) {
      return "-";
    }

    switch (field) {
      case "followers":
        return this.formatNumber(value as number);

      case "engagement_rate":
        return `${value}%`;

      case "post_price":
      case "story_price":
        return this.formatPrice(value as number);

      case "post_reach":
      case "story_reach":
        return this.formatNumber(value as number);

      case "username":
        return value.toString().startsWith("@")
          ? value.toString()
          : `@${value}`;

      case "profile_url":
        return value.toString();

      default:
        return value.toString();
    }
  }

  /**
   * Генерация объекта полей формы для платформы
   * Используется для инициализации formData
   *
   * @param platform - Тип платформы
   * @param prefix - Префикс для имен полей (например, 'instagram_')
   * @returns Объект с пустыми полями формы
   */
  generateEmptyFormFields(
    platform: PlatformType,
    prefix?: string,
  ): Record<string, string> {
    const platformPrefix = prefix || `${platform}_`;
    const fields: Record<string, string> = {};

    PLATFORM_CONFIGS[platform].fields.forEach((field) => {
      fields[`${platformPrefix}${field}`] = "";
    });

    return fields;
  }

  /**
   * Генерация объекта полей формы для всех платформ
   *
   * @param platforms - Массив платформ
   * @returns Объект со всеми полями для всех платформ
   */
  generateAllPlatformFields(platforms: PlatformType[]): Record<string, string> {
    const allFields: Record<string, string> = {};

    platforms.forEach((platform) => {
      Object.assign(allFields, this.generateEmptyFormFields(platform));
    });

    return allFields;
  }

  /**
   * Слияние опубликованных данных с черновиками
   *
   * @param published - Опубликованные данные
   * @param draft - Черновик (частичные данные)
   * @returns Объединенные данные (черновик переопределяет опубликованные)
   */
  mergePlatformDrafts(
    published: IPlatformData,
    draft: Partial<IPlatformData>,
  ): IPlatformData {
    return {
      username: draft.username ?? published.username,
      profile_url: draft.profile_url ?? published.profile_url,
      subscribers: draft.subscribers ?? published.subscribers,
      er: draft.er ?? published.er,
      reach: draft.reach ?? published.reach,
      price: draft.price ?? published.price,
      storyReach: draft.storyReach ?? published.storyReach,
      storyPrice: draft.storyPrice ?? published.storyPrice,
      views: draft.views ?? published.views,
    };
  }

  /**
   * Извлечение строки из объекта данных
   */
  private extractString(
    data: Record<string, unknown>,
    key: string,
  ): string | undefined {
    const value = data[key];
    return typeof value === "string" ? value : undefined;
  }

  /**
   * Извлечение числа из объекта данных
   * Поддерживает строковые числа (из API)
   */
  private extractNumber(
    data: Record<string, unknown>,
    key: string,
  ): number | undefined {
    const value = data[key];

    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? undefined : parsed;
    }

    return undefined;
  }

  /**
   * Форматирование числа (добавляет K, M, B для больших чисел)
   */
  private formatNumber(value: number): string {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1)}B`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }
    return value.toLocaleString("ru-RU");
  }

  /**
   * Форматирование цены (добавляет символ рубля)
   */
  private formatPrice(value: number): string {
    return `${value.toLocaleString("ru-RU")} ₽`;
  }
}

/**
 * Singleton instance для использования во всем приложении
 */
export const platformService = new PlatformService();
