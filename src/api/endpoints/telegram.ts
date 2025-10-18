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
