/**
 * Правила валидации для форм приложения
 *
 * Центральное место для всех правил валидации.
 * Используется в формах, хуках валидации и бизнес-логике.
 */

/**
 * Правила валидации для платформ
 */
export const PLATFORM_VALIDATION = {
  /** Минимальная длина username */
  USERNAME_MIN_LENGTH: 1,
  /** Максимальная длина username */
  USERNAME_MAX_LENGTH: 30,
  /** Минимальное количество подписчиков */
  FOLLOWERS_MIN: 0,
  /** Максимальное количество подписчиков (для валидации разумности) */
  FOLLOWERS_MAX: 1_000_000_000,
  /** Минимальный ER (%) */
  ER_MIN: 0,
  /** Максимальный ER (%) */
  ER_MAX: 100,
  /** Минимальный охват */
  REACH_MIN: 0,
  /** Минимальная цена */
  PRICE_MIN: 0,
  /** Максимальная цена (для валидации разумности) */
  PRICE_MAX: 10_000_000,
} as const;

/**
 * Правила валидации для профиля блогера
 */
export const PROFILE_VALIDATION = {
  /** Минимальная длина имени */
  NAME_MIN_LENGTH: 1,
  /** Максимальная длина имени */
  NAME_MAX_LENGTH: 30,
  /** Минимальная длина фамилии */
  LAST_NAME_MIN_LENGTH: 1,
  /** Максимальная длина фамилии */
  LAST_NAME_MAX_LENGTH: 30,
  /** Максимальная длина описания */
  DESCRIPTION_MAX_LENGTH: 500,
  /** Минимальная длина описания */
  DESCRIPTION_MIN_LENGTH: 10,
  /** Максимальная длина условий сотрудничества */
  COOPERATION_CONDITIONS_MAX_LENGTH: 1000,
  /** Минимальное количество тем */
  MIN_TOPICS: 1,
  /** Максимальное количество тем */
  MAX_TOPICS: 10,
  /** Максимальное количество запрещенных тем */
  MAX_RESTRICTED_TOPICS: 20,
} as const;

/**
 * Правила валидации для файлов
 */
export const FILE_VALIDATION = {
  /** Максимальный размер файла в МБ */
  MAX_SIZE_MB: 5,
  /** Максимальный размер файла в байтах */
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  /** Разрешенные MIME типы изображений */
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ],
  /** Разрешенные MIME типы для скриншотов статистики */
  ALLOWED_STATS_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
  ],
  /** Максимальное количество файлов для загрузки статистики */
  MAX_STATS_FILES: 25,
  /** Минимальная ширина изображения аватара (px) */
  AVATAR_MIN_WIDTH: 200,
  /** Минимальная высота изображения аватара (px) */
  AVATAR_MIN_HEIGHT: 200,
  /** Максимальная ширина изображения аватара (px) */
  AVATAR_MAX_WIDTH: 2000,
  /** Максимальная высота изображения аватара (px) */
  AVATAR_MAX_HEIGHT: 2000,
} as const;

/**
 * Регулярные выражения для валидации
 */
export const VALIDATION_PATTERNS = {
  /** Email */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  /** URL */
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  /** Instagram username */
  INSTAGRAM_USERNAME: /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9._]{1,30}$/,
  /** TikTok username */
  TIKTOK_USERNAME: /^[a-zA-Z0-9._]{1,24}$/,
  /** Telegram username */
  TELEGRAM_USERNAME: /^[a-zA-Z0-9_]{5,32}$/,
  /** Только цифры */
  DIGITS_ONLY: /^\d+$/,
  /** Цифры с десятичной точкой */
  DECIMAL: /^\d+(\.\d{1,2})?$/,
  /** Телефон (российский формат) */
  PHONE_RU:
    /^(\+7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/,
} as const;

/**
 * Сообщения об ошибках валидации
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: "Это поле обязательно для заполнения",
  INVALID_EMAIL: "Неверный формат email",
  INVALID_URL: "Неверный формат URL",
  INVALID_PHONE: "Неверный формат телефона",
  MIN_LENGTH: (min: number) => `Минимальная длина: ${min} символов`,
  MAX_LENGTH: (max: number) => `Максимальная длина: ${max} символов`,
  MIN_VALUE: (min: number) => `Минимальное значение: ${min}`,
  MAX_VALUE: (max: number) => `Максимальное значение: ${max}`,
  INVALID_NUMBER: "Значение должно быть числом",
  INVALID_INTEGER: "Значение должно быть целым числом",
  FILE_TOO_LARGE: (maxMB: number) =>
    `Файл слишком большой. Максимальный размер: ${maxMB} МБ`,
  INVALID_FILE_TYPE: (allowed: string[]) =>
    `Недопустимый тип файла. Разрешены: ${allowed.join(", ")}`,
  TOO_MANY_FILES: (max: number) => `Слишком много файлов. Максимум: ${max}`,
  MIN_ITEMS: (min: number) => `Минимальное количество элементов: ${min}`,
  MAX_ITEMS: (max: number) => `Максимальное количество элементов: ${max}`,
} as const;

/**
 * Валидация email
 */
export function validateEmail(email: string): {
  isValid: boolean;
  error?: string;
} {
  if (!email) {
    return { isValid: false, error: VALIDATION_MESSAGES.REQUIRED };
  }
  if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
    return { isValid: false, error: VALIDATION_MESSAGES.INVALID_EMAIL };
  }
  return { isValid: true };
}

/**
 * Валидация URL
 */
export function validateUrl(url: string): { isValid: boolean; error?: string } {
  if (!url) {
    return { isValid: false, error: VALIDATION_MESSAGES.REQUIRED };
  }
  if (!VALIDATION_PATTERNS.URL.test(url)) {
    return { isValid: false, error: VALIDATION_MESSAGES.INVALID_URL };
  }
  return { isValid: true };
}

/**
 * Валидация длины строки
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
): { isValid: boolean; error?: string } {
  if (value.length < min) {
    return { isValid: false, error: VALIDATION_MESSAGES.MIN_LENGTH(min) };
  }
  if (value.length > max) {
    return { isValid: false, error: VALIDATION_MESSAGES.MAX_LENGTH(max) };
  }
  return { isValid: true };
}

/**
 * Валидация числа в диапазоне
 */
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
): { isValid: boolean; error?: string } {
  if (value < min) {
    return { isValid: false, error: VALIDATION_MESSAGES.MIN_VALUE(min) };
  }
  if (value > max) {
    return { isValid: false, error: VALIDATION_MESSAGES.MAX_VALUE(max) };
  }
  return { isValid: true };
}

/**
 * Валидация размера файла
 */
export function validateFileSize(
  file: File,
  maxSizeMB: number,
): { isValid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: VALIDATION_MESSAGES.FILE_TOO_LARGE(maxSizeMB),
    };
  }
  return { isValid: true };
}

/**
 * Валидация типа файла
 */
export function validateFileType(
  file: File,
  allowedTypes: string[],
): { isValid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: VALIDATION_MESSAGES.INVALID_FILE_TYPE(allowedTypes),
    };
  }
  return { isValid: true };
}

/**
 * Валидация изображения
 */
export function validateImage(file: File): {
  isValid: boolean;
  error?: string;
} {
  // Проверка типа
  const typeValidation = validateFileType(file, [
    ...FILE_VALIDATION.ALLOWED_IMAGE_TYPES,
  ]);
  if (!typeValidation.isValid) {
    return typeValidation;
  }

  // Проверка размера
  const sizeValidation = validateFileSize(file, FILE_VALIDATION.MAX_SIZE_MB);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  return { isValid: true };
}
