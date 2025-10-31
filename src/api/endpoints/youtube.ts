// ============================================
// YouTube Client API Endpoints
// ============================================
// Endpoints для управления YouTube клиентом
// Используется админами для настройки YouTube API сессий
// ============================================

import { apiRequest } from "../client";
import type {
  YtClientSessionOutputDto,
  YtClientAddInputDto,
  PaginationUtil,
} from "../types";

// ====== GET /yt-client - Получение списка YouTube сессий ======

export interface GetYtSessionsParams {
  page?: number; // default: 1
  size?: number; // default: 50
}

export interface YtSessionsResponse {
  totalCount: number;
  pagesCount: number;
  page: number;
  size: number;
  items: YtClientSessionOutputDto[];
}

/**
 * Получение списка YouTube сессий с пагинацией
 *
 * @param params - Параметры пагинации
 * @returns Promise с пагинированным списком YouTube сессий
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * const sessions = await getYtSessions({
 *   page: 1,
 *   size: 20
 * });
 * ```
 */
export async function getYtSessions(
  params: GetYtSessionsParams = {},
): Promise<YtSessionsResponse> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  return apiRequest<YtSessionsResponse>(`/yt-client?${query}`);
}

// ====== POST /yt-client/add - Добавление новой YouTube сессии ======

/**
 * Добавление новой YouTube сессии
 *
 * @param data - YouTube API токен и название сессии
 * @returns Promise<void> (201 Created)
 *
 * @throws APIError 400 - Incorrect input data или session already exists
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @note Требует Authorization header с admin token
 * @note token должен быть валидным YouTube API ключом (35-40 символов, начинается с AIza)
 *
 * @example
 * ```typescript
 * await addYtSession({
 *   token: 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
 *   name: 'YouTube API Key 1'
 * });
 * ```
 */
export async function addYtSession(
  data: YtClientAddInputDto,
): Promise<void> {
  return apiRequest<void>("/yt-client/add", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ====== DELETE /yt-client/{sessionId} - Удаление YouTube сессии ======

/**
 * Удаление YouTube сессии
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
 * await deleteYtSession(123);
 * ```
 */
export async function deleteYtSession(sessionId: number): Promise<void> {
  return apiRequest<void>(`/yt-client/${sessionId}`, {
    method: "DELETE",
  });
}

