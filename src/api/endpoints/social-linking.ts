// ============================================
// Social Media Linking API Endpoints
// ============================================
// Endpoints для связывания социальных сетей с блогерами
// Пользователи отправляют запросы, админы их одобряют
// ============================================

import { apiRequest } from '../client';
import type {
  BloggerLinkMediaTgRequestInputDto,
  BloggerLinkMediaYtRequestInputDto,
  BloggerLinkMediaIgRequestInputDto,
} from '../types';

// ====== USER REQUESTS (требуют user-auth-jwt-schema) ======

/**
 * Отправить запрос на связывание Telegram канала с блогером
 *
 * @param bloggerId - ID блогера
 * @param data - username Telegram канала
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data. Request has been sent. Account already linked
 * @throws APIError 401 - Unauthorized
 * @throws APIError 404 - Blogger not found
 *
 * @note Требует Authorization header с user token
 *
 * @example
 * ```typescript
 * await linkTgChannelRequest(123, {
 *   username: 'my_telegram_channel'
 * });
 * ```
 */
export async function linkTgChannelRequest(
  bloggerId: number,
  data: BloggerLinkMediaTgRequestInputDto
): Promise<void> {
  return apiRequest<void>(`/blogger/link/social/tg/${bloggerId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Отправить запрос на связывание YouTube канала с блогером
 *
 * @param bloggerId - ID блогера
 * @param data - channel URL или username
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data. Request has been sent. Account already linked
 * @throws APIError 401 - Unauthorized
 * @throws APIError 404 - Blogger not found
 *
 * @note Требует Authorization header с user token
 *
 * @example
 * ```typescript
 * await linkYtChannelRequest(123, {
 *   channel: 'https://youtube.com/@my_channel'
 * });
 * ```
 */
export async function linkYtChannelRequest(
  bloggerId: number,
  data: BloggerLinkMediaYtRequestInputDto
): Promise<void> {
  return apiRequest<void>(`/blogger/link/social/yt/${bloggerId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Отправить запрос на связывание Instagram аккаунта с блогером
 *
 * @param bloggerId - ID блогера
 * @param data - username Instagram аккаунта
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data. Request has been sent. Account already linked
 * @throws APIError 401 - Unauthorized
 * @throws APIError 404 - Blogger not found
 *
 * @note Требует Authorization header с user token
 *
 * @example
 * ```typescript
 * await linkIgUserRequest(123, {
 *   username: 'my_instagram_account'
 * });
 * ```
 */
export async function linkIgUserRequest(
  bloggerId: number,
  data: BloggerLinkMediaIgRequestInputDto
): Promise<void> {
  return apiRequest<void>(`/blogger/link/social/ig/${bloggerId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ====== ADMIN APPROVALS (требуют admin-auth-jwt-schema) ======

/**
 * Одобрить связывание Telegram канала с блогером (админ)
 *
 * @param bloggerId - ID блогера
 * @param requestId - ID запроса на связывание
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized
 * @throws APIError 403 - The request does not belong to the user
 * @throws APIError 404 - Blogger or channel not found
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * await linkTgChannel(123, 456);
 * ```
 */
export async function linkTgChannel(bloggerId: number, requestId: number): Promise<void> {
  return apiRequest<void>(`/blogger/link/social/tg/${bloggerId}/${requestId}`, {
    method: 'POST',
  });
}

/**
 * Одобрить связывание YouTube канала с блогером (админ)
 *
 * @param bloggerId - ID блогера
 * @param requestId - ID запроса на связывание
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized
 * @throws APIError 403 - The request does not belong to the user
 * @throws APIError 404 - Blogger or channel not found
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * await linkYtChannel(123, 456);
 * ```
 */
export async function linkYtChannel(bloggerId: number, requestId: number): Promise<void> {
  return apiRequest<void>(`/blogger/link/social/yt/${bloggerId}/${requestId}`, {
    method: 'POST',
  });
}

/**
 * Одобрить связывание Instagram аккаунта с блогером (админ)
 *
 * @param bloggerId - ID блогера
 * @param requestId - ID запроса на связывание
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized
 * @throws APIError 403 - The request does not belong to the user
 * @throws APIError 404 - Blogger or ig user not found
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * await linkIgUser(123, 456);
 * ```
 */
export async function linkIgUser(bloggerId: number, requestId: number): Promise<void> {
  return apiRequest<void>(`/blogger/link/social/ig/${bloggerId}/${requestId}`, {
    method: 'POST',
  });
}
