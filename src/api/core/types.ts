/**
 * API Core Types
 * Типы для работы с API client
 */

/**
 * Детали поля с ошибкой валидации
 */
export interface BadRequestErrorFieldExceptionDto {
  /** Сообщение об ошибке */
  message: string;
  /** Название поля с ошибкой */
  field: string;
  /** Ключ ошибки для i18n */
  errorKey: string;
}

/**
 * DTO для ошибки Bad Request (400)
 */
export interface BadRequestExceptionDto {
  /** Сообщение об ошибке */
  message: string;
  /** HTTP статус код */
  statusCode: number;
  /** Массив ошибок валидации полей или null */
  errorField: BadRequestErrorFieldExceptionDto[] | null;
}

/**
 * Опции для API запроса
 */
export interface ApiRequestOptions extends RequestInit {
  /** Пропустить автоматическое добавление токена */
  skipAuth?: boolean;
  /** Кастомный базовый URL */
  baseUrl?: string;
}
