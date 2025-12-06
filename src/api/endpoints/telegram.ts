// ============================================
// Telegram Client API Endpoints
// ============================================
// Endpoints для управления Telegram клиентом
// Используется админами для настройки Telegram аккаунтов
// ============================================

import { apiRequest } from "../client";
import type {
  TgClientLoginInputDto,
  TgClientLoginOutputDto,
  TgClientConfirmInputDto,
  TgClientConfirmOutputDto,
  TgClientSessionsOutputDto,
} from "../types";

// ====== POST /tg-client/login - Логин Telegram аккаунта ======

/**
 * Логин нового Telegram аккаунта
 *
 * @param data - phone, apiHash, apiId
 * @returns Promise с состоянием авторизации
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * const result = await tgClientLogin({
 *   phone: '+1234567890',
 *   apiHash: 'your_api_hash_32_chars_long',
 *   apiId: 123456789
 * });
 *
 * if (result.isAuthorized && result.isVerify) {
 * }
 * ```
 */
export async function tgClientLogin(
  data: TgClientLoginInputDto,
): Promise<TgClientLoginOutputDto> {
  return apiRequest<TgClientLoginOutputDto>("/tg-client/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ====== POST /tg-client/confirm - Подтверждение логина Telegram ======

/**
 * Подтверждение логина Telegram аккаунта с кодом
 *
 * @param data - phone, code
 * @returns Promise с состоянием авторизации
 *
 * @throws APIError 400 - Incorrect input data or can not confirm and login telegram account
 * @throws APIError 401 - Unauthorized (требуется admin token)
 * @throws APIError 404 - Session for telegram account not found
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * const result = await tgClientConfirm({
 *   phone: '+1234567890',
 *   code: '12345'
 * });
 *
 * if (result.isAuthorized && result.isVerify) {
 * }
 * ```
 */
export async function tgClientConfirm(
  data: TgClientConfirmInputDto,
): Promise<TgClientConfirmOutputDto> {
  return apiRequest<TgClientConfirmOutputDto>("/tg-client/confirm", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ====== GET /tg-client - Получение списка Telegram сессий ======

export interface GetTgSessionsParams {
  page?: number; // default: 1
  size?: number; // default: 50
  isAuthorized?: boolean; // default: true
}

export interface TgSessionsResponse {
  totalCount: number;
  pagesCount: number;
  page: number;
  size: number;
  items: TgClientSessionsOutputDto[];
}

/**
 * Получение списка Telegram сессий с пагинацией и фильтрацией
 *
 * @param params - Параметры пагинации и фильтрации
 * @returns Promise с пагинированным списком Telegram сессий
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * const sessions = await getTgSessions({
 *   page: 1,
 *   size: 20,
 *   isAuthorized: true
 * });
 * ```
 */
export async function getTgSessions(
  params: GetTgSessionsParams = {},
): Promise<TgSessionsResponse> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === "boolean") {
        query.append(key, value ? "true" : "false");
      } else {
        query.append(key, String(value));
      }
    }
  });

  return apiRequest<TgSessionsResponse>(`/tg-client?${query}`);
}

// ====== POST /tg-client/logout/{sessionId} - Выход из Telegram сессии ======

/**
 * Выход из Telegram сессии
 *
 * @param sessionId - ID сессии для выхода
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized (требуется admin token)
 * @throws APIError 404 - Session not found
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * await logoutTgSession(123);
 * ```
 */
export async function logoutTgSession(sessionId: number): Promise<void> {
  return apiRequest<void>(`/tg-client/logout/${sessionId}`, {
    method: "POST",
  });
}

// ====== DELETE /tg-client/{sessionId} - Удаление Telegram сессии ======

/**
 * Удаление Telegram сессии
 *
 * @param sessionId - ID сессии для удаления
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized (требуется admin token)
 * @throws APIError 404 - Session not found
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * await deleteTgSession(123);
 * ```
 */
export async function deleteTgSession(sessionId: number): Promise<void> {
  return apiRequest<void>(`/tg-client/${sessionId}`, {
    method: "DELETE",
  });
}

// ====== POST /tg-client/start-parsing - Запуск парсинга Telegram ======

/**
 * Запуск парсинга Telegram
 *
 * @returns Promise<void> (201 Created)
 *
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * await startTgParsing();
 * ```
 */
export async function startTgParsing(): Promise<void> {
  return apiRequest<void>("/tg-client/start-parsing", {
    method: "POST",
  });
}
