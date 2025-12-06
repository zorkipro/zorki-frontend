// ============================================
// TikTok Client API Endpoints
// ============================================
// Endpoints для управления TikTok клиентом
// Используется админами для настройки TikTok API сессий
// ============================================

import { apiRequest } from "../client";
import type {
  TtClientSessionOutputDto,
  TtClientAddInputDto,
} from "../types";

// ====== GET /tt-client - Получение списка TikTok сессий ======

export interface GetTtSessionsParams {
  page?: number; // default: 1
  size?: number; // default: 50
}

export interface TtSessionsResponse {
  totalCount: number;
  pagesCount: number;
  page: number;
  size: number;
  items: TtClientSessionOutputDto[];
}

/**
 * Получение списка TikTok сессий с пагинацией
 *
 * @param params - Параметры пагинации
 * @returns Promise с пагинированным списком TikTok сессий
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * const sessions = await getTtSessions({
 *   page: 1,
 *   size: 20
 * });
 * ```
 */
export async function getTtSessions(
  params: GetTtSessionsParams = {},
): Promise<TtSessionsResponse> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  return apiRequest<TtSessionsResponse>(`/tt-client?${query}`);
}

// ====== POST /tt-client/add - Добавление новой TikTok сессии ======

/**
 * Добавление новой TikTok сессии
 *
 * @param data - TikTok API токен, название сессии и кредиты
 * @returns Promise<void> (201 Created)
 *
 * @throws APIError 400 - Incorrect input data или session already exists
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * await addTtSession({
 *   token: 'your_tiktok_token',
 *   name: 'TikTok API Key 1',
 *   credits: 1000
 * });
 * ```
 */
export async function addTtSession(
  data: TtClientAddInputDto,
): Promise<void> {
  return apiRequest<void>("/tt-client/add", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ====== DELETE /tt-client/{sessionId} - Удаление TikTok сессии ======

/**
 * Удаление TikTok сессии
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
 * await deleteTtSession(123);
 * ```
 */
export async function deleteTtSession(sessionId: number): Promise<void> {
  return apiRequest<void>(`/tt-client/${sessionId}`, {
    method: "DELETE",
  });
}

// ====== POST /tt-client/start-parsing - Запуск парсинга TikTok ======

/**
 * Запуск парсинга TikTok
 *
 * @returns Promise<void> (201 Created)
 *
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * await startTtParsing();
 * ```
 */
export async function startTtParsing(): Promise<void> {
  return apiRequest<void>("/tt-client/start-parsing", {
    method: "POST",
  });
}
