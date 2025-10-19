// ============================================
// Client-Blogger API Endpoints
// ============================================
// POST /client/blogger/link - Связывание клиента с блогером по Instagram username
// ============================================

import { apiRequest } from "../client";
import type {
  ClientLinkToBloggerInputDto,
  ClientAuthMeOutputDto,
} from "../types";

// ====== POST /client/blogger/link ======

/**
 * Связать текущего клиента (пользователя) с блогером по Instagram username
 *
 * @param username - Instagram username блогера (без @)
 * @returns Promise<void> (201 Created)
 *
 * @throws APIError 400 - Incorrect input data или IG user not found
 * @throws APIError 401 - Unauthorized (нет токена пользователя)
 * @throws APIError 403 - Блогер уже связан с другим пользователем ИЛИ пользователь уже связан с блогером
 *
 * @note Требует Authorization header с user token (Supabase)
 * @note Создает запрос на модерацию (BloggerLinkRequest со статусом MODERATION)
 * @note Админ должен одобрить запрос через /admin/link/blogger-client/approve/{requestId}
 *
 * @example
 * ```typescript
 * try {
 *   await linkClientToBlogger('anna_petrova');
 * } catch (error) {
 *   if (error.statusCode === 403) {
 *     // blogger_already_linked_to_another_user
 *     // client_already_linked_to_blogger
 *   }
 * }
 * ```
 */
export async function linkClientToBlogger(username: string): Promise<void> {
  const data: ClientLinkToBloggerInputDto = { username };

  return apiRequest<void>("/client/blogger/link", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ====== GET /auth/client/me - Получение информации о текущем клиенте ======

/**
 * Получение информации о текущем авторизованном клиенте
 *
 * @returns Promise с информацией о клиенте и связанном блогере
 * @throws APIError 401 - Unauthorized (тихо игнорируется в BloggerContext)
 *
 * @note Требует Authorization header с client token (Supabase JWT)
 * @note Возвращает JWT payload и информацию о связанном блогере (если есть)
 * @note 401 ошибки обрабатываются тихо - пользователь может быть не связан с блогером
 *
 * @example
 * ```typescript
 * try {
 *   const clientInfo = await getClientMe();
 *   if (clientInfo.blogger) {
 *     // Пользователь связан с блогером
 *   } else {
 *     // Пользователь не связан с блогером
 *   }
 * } catch (error) {
 *   // 401 ошибки обрабатываются тихо в BloggerContext
 * }
 * ```
 */
export async function getClientMe(): Promise<ClientAuthMeOutputDto> {
  return apiRequest<ClientAuthMeOutputDto>("/auth/client/me", {
    method: "GET",
    skipAuthErrorHandling: true, // Тихо игнорируем 401 ошибки - пользователь может быть не связан с блогером
  });
}
