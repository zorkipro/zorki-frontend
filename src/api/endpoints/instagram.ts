// ============================================
// Instagram Client API Endpoints
// ============================================
// Endpoints для управления Instagram клиентом
// Используется админами для настройки Instagram аккаунтов
// ============================================

import { apiRequest } from "../client";
import type {
  IgClientLoginInputDto,
  IgClientLoginOutputDto,
  IgClientSessionsOutputDto,
  GetIgSessionsParams,
  IgSessionsResponse,
} from "../types";

function buildQueryString(params: Record<string, any>): string {
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
  return query.toString();
}

// ====== POST /ig-client/login - Логин Instagram аккаунта ======

/**
 * Логин нового Instagram аккаунта
 *
 * @param data - username, password
 * @returns Promise с состоянием авторизации
 *
 * @throws APIError 400 - Incorrect input data or can not load ig session
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * const result = await igClientLogin({
 *   username: 'your_instagram_username',
 *   password: 'your_password'
 * });
 *
 * if (result.isAuthorized && result.isVerify) {
 * }
 * ```
 */
export async function igClientLogin(
  data: IgClientLoginInputDto,
): Promise<IgClientLoginOutputDto> {
  return apiRequest<IgClientLoginOutputDto>("/ig-client/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ====== POST /ig-client/start-parsing - Запуск парсинга Instagram ======

/**
 * Запуск парсинга Instagram
 *
 * @returns Promise<void> (201 Created)
 *
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * await startIgParsing();
 * ```
 */
export async function startIgParsing(): Promise<void> {
  return apiRequest<void>("/ig-client/start-parsing", {
    method: "POST",
  });
}

// ====== GET /ig-client - Получение списка Instagram сессий ======

/**
 * Получение списка Instagram сессий с пагинацией и фильтрацией
 *
 * @param params - Параметры пагинации и фильтрации
 * @returns Promise с пагинированным списком Instagram сессий
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * const sessions = await getIgSessions({
 *   page: 1,
 *   size: 20,
 *   isAuthorized: true
 * });
 * ```
 */
export async function getIgSessions(
  params: GetIgSessionsParams = {},
): Promise<IgSessionsResponse> {
  return apiRequest<IgSessionsResponse>(`/ig-client?${buildQueryString(params)}`);
}

// ====== DELETE /ig-client/{sessionId} - Удаление Instagram сессии ======

/**
 * Удаление Instagram сессии
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
 * await deleteIgSession(123);
 * ```
 */
export async function deleteIgSession(sessionId: number): Promise<void> {
  return apiRequest<void>(`/ig-client/${sessionId}`, {
    method: "DELETE",
  });
}

// ====== POST /ig-client/logout/{sessionId} - Выход из Instagram сессии ======

/**
 * Выход из Instagram сессии
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
 * await logoutIgSession(123);
 * ```
 */
export async function logoutIgSession(sessionId: number): Promise<void> {
  return apiRequest<void>(`/ig-client/logout/${sessionId}`, {
    method: "POST",
  });
}

// ====== Convenience function for login (wrapper around igClientLogin) ======

/**
 * Удобная функция для логина Instagram аккаунта
 * Обертка вокруг igClientLogin для совместимости
 *
 * @param username - Имя пользователя Instagram
 * @param password - Пароль Instagram
 * @returns Promise с состоянием авторизации
 */
export async function loginIgAccount(
  username: string,
  password: string,
): Promise<IgClientLoginOutputDto> {
  return igClientLogin({ username, password });
}
