/**
 * Type Guard функции для безопасной работы с типами
 *
 * Используются вместо `as any` для type-safe преобразований.
 * Все функции возвращают boolean и выполняют runtime проверку типов.
 */

import type {
  ApiGender,
  ApiWorkFormat,
  ApiVerificationStatus,
  LinkRequestStatus,
} from '@/api/types';
import type { PlatformType } from '@/types/platform';
import { APIError } from '@/api/client';

/**
 * Type guard: проверка, является ли ошибка APIError
 *
 * @param error - Объект ошибки
 * @returns true, если это APIError
 *
 * @example
 * try {
 *   await apiRequest(...)
 * } catch (error) {
 *   if (isApiError(error)) {
 *     // error.statusCode, error.message
 *   }
 * }
 */
export function isApiError(error: unknown): error is APIError {
  return error instanceof APIError;
}

/**
 * Type guard: проверка Error объекта
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Type guard: проверка, является ли значение PlatformType
 */
export function isPlatformType(value: unknown): value is PlatformType {
  return (
    typeof value === 'string' && ['instagram', 'tiktok', 'youtube', 'telegram'].includes(value)
  );
}

/**
 * Type guard: проверка, является ли значение ApiWorkFormat
 */
export function isWorkFormat(value: unknown): value is ApiWorkFormat {
  return (
    typeof value === 'string' &&
    ['SOLE_PROPRIETOR', 'SELF_EMPLOYED', 'SERVICE_CONTRACT', 'LLC'].includes(value)
  );
}

/**
 * Type guard: проверка, является ли значение локальным форматом работы
 */
export function isLocalWorkFormat(
  value: unknown
): value is 'ИП' | 'профдоход' | 'договор подряда' | 'ООО' {
  return typeof value === 'string' && ['ИП', 'профдоход', 'договор подряда', 'ООО'].includes(value);
}

/**
 * Type guard: проверка, является ли значение ApiGender
 */
export function isGenderType(value: unknown): value is ApiGender {
  return typeof value === 'string' && ['MALE', 'FEMALE', 'COUPLE', 'PUBLIC_PAGE'].includes(value);
}

/**
 * Type guard: проверка, является ли значение локальным типом пола
 */
export function isLocalGenderType(
  value: unknown
): value is 'мужчина' | 'женщина' | 'пара' | 'паблик' {
  return typeof value === 'string' && ['мужчина', 'женщина', 'пара', 'паблик'].includes(value);
}

/**
 * Type guard: проверка, является ли значение ApiVerificationStatus
 */
export function isVerificationStatus(value: unknown): value is ApiVerificationStatus {
  return typeof value === 'string' && ['NEW', 'APPROVED', 'REJECTED', 'MODERATION'].includes(value);
}

/**
 * Type guard: проверка, является ли значение LinkRequestStatus
 */
export function isLinkRequestStatus(value: unknown): value is LinkRequestStatus {
  return typeof value === 'string' && ['APPROVED', 'REJECTED', 'MODERATION'].includes(value);
}

/**
 * Type guard: проверка, содержит ли объект обязательные поля профиля
 */
export interface RequiredProfileFields {
  name: string;
  lastName: string;
}

export function hasRequiredProfileFields(data: unknown): data is RequiredProfileFields {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const profile = data as Partial<RequiredProfileFields>;

  return (
    typeof profile.name === 'string' &&
    profile.name.length > 0 &&
    typeof profile.lastName === 'string' &&
    profile.lastName.length > 0
  );
}

/**
 * Type guard: проверка, является ли значение строкой
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard: проверка, является ли значение числом
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Type guard: проверка, является ли значение boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Type guard: проверка, является ли значение объектом (не null, не array)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard: проверка, является ли значение массивом
 */
export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Type guard: проверка, является ли значение массивом строк
 */
export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/**
 * Type guard: проверка, является ли значение массивом чисел
 */
export function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'number');
}

/**
 * Type guard: проверка, является ли значение null или undefined
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Type guard: проверка, не является ли значение null или undefined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type guard: проверка, является ли значение пустой строкой
 */
export function isEmptyString(value: unknown): value is '' {
  return value === '';
}

/**
 * Type guard: проверка, является ли значение непустой строкой
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Type guard: проверка, является ли значение положительным числом
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && value > 0 && !isNaN(value);
}

/**
 * Type guard: проверка, является ли значение неотрицательным числом
 */
export function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && value >= 0 && !isNaN(value);
}

/**
 * Type guard: проверка, является ли значение функцией
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * Type guard: проверка, является ли значение Promise
 */
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    typeof (value as { then: unknown }).then === 'function'
  );
}

/**
 * Type guard: проверка, содержит ли объект поле id
 */
export interface HasId {
  id: string | number;
}

export function hasId(value: unknown): value is HasId {
  return (
    isObject(value) &&
    'id' in value &&
    (typeof value.id === 'string' || typeof value.id === 'number')
  );
}

/**
 * Type guard: проверка, содержит ли объект поле с сообщением об ошибке
 */
export interface HasErrorMessage {
  message: string;
}

export function hasErrorMessage(value: unknown): value is HasErrorMessage {
  return isObject(value) && 'message' in value && typeof value.message === 'string';
}

/**
 * Утверждение типа (throws если проверка не прошла)
 *
 * @param condition - Условие для проверки
 * @param message - Сообщение об ошибке
 * @throws {Error} Если условие ложно
 *
 * @example
 * function processUser(user: unknown) {
 *   assertType(hasRequiredProfileFields(user), 'Invalid user data');
 *   // Теперь TypeScript знает, что user имеет тип RequiredProfileFields
 *   // user.name
 * }
 */
export function assertType(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Type assertion failed: ${message}`);
  }
}

/**
 * Безопасное приведение к строке
 */
export function asString(value: unknown, defaultValue = ''): string {
  return isString(value) ? value : defaultValue;
}

/**
 * Безопасное приведение к числу
 */
export function asNumber(value: unknown, defaultValue = 0): number {
  return isNumber(value) ? value : defaultValue;
}

/**
 * Безопасное приведение к boolean
 */
export function asBoolean(value: unknown, defaultValue = false): boolean {
  return isBoolean(value) ? value : defaultValue;
}

/**
 * Безопасное приведение к массиву
 */
export function asArray<T>(value: unknown, defaultValue: T[] = []): T[] {
  return Array.isArray(value) ? value : defaultValue;
}
