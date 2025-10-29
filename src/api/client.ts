/**
 * API Client - основной клиент для работы с Backend API
 * Использует модульную архитектуру:
 * - TokenManager - управление токенами
 * - ResponseHandler - обработка ответов
 * - ApiErrorHandler - обработка ошибок
 */

import { tokenManager } from "./core/TokenManager";
import { responseHandler } from "./core/ResponseHandler";
import { apiErrorHandler, APIError } from "./core/ApiErrorHandler";
import type { ApiRequestOptions } from "./core/types";

// Re-export types and classes for backward compatibility
export type {
  BadRequestErrorFieldExceptionDto,
  BadRequestExceptionDto,
  ApiRequestOptions,
} from "./core/types";
export { APIError } from "./core/ApiErrorHandler";
export { tokenManager } from "./core/TokenManager";

//API Configuration
const API_BASE_URL = import.meta.env.DEV
  ? "/api" // Прокси в режиме разработки
  : import.meta.env.VITE_API_BASE_URL;
/**
 * Базовая функция для выполнения API запросов
 * Автоматически добавляет токен аутентификации и обрабатывает ошибки
 *
 * @param endpoint - путь API endpoint (например, '/blogger/profile')
 * @param options - опции запроса (метод, body, headers и т.д.)
 * @returns Promise с данными типа T
 * @throws {APIError} при ошибках API или сети
 *
 * @example
 * const data = await apiRequest<UserProfile>('/user/profile', {
 *   method: 'GET'
 * });
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { skipAuth = false, skipAuthErrorHandling = false, baseUrl, ...fetchOptions } = options;

  // Получаем токен если не пропущена аутентификация
  const token = skipAuth ? null : await tokenManager.getAuthToken();

  // Подготавливаем заголовки
  const headers: Record<string, string> = {
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  // Устанавливаем Content-Type только если это не FormData и не передан в headers
  if (!(fetchOptions.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // Добавляем токен если есть и не передан Authorization в headers
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${baseUrl || API_BASE_URL}${endpoint}`;

  // Добавляем логирование для отладки
  if (endpoint.includes('/auth/admin/') || endpoint.includes('/admin/') || endpoint.includes('/auth/client/')) {
    console.log("🌐 API Request Debug:", {
      url,
      method: fetchOptions.method,
      headers,
      body: fetchOptions.body,
      skipAuth,
      tokenType: token ? 'present' : 'missing',
      tokenValue: token ? `${token.substring(0, 20)}...` : 'none',
      tokenLength: token ? token.length : 0,
      tokenStartsWith: token ? token.substring(0, 10) : 'none',
      apiBaseUrl: API_BASE_URL
    });
  }

  try {
    // Выполняем запрос
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Обрабатываем ответ через ResponseHandler
    const { data, hasError, errorData } =
      await responseHandler.parseResponse<T>(response, endpoint);

    // Если есть ошибка - обрабатываем
    if (hasError && errorData) {
      // Для 401 ошибок очищаем токены и перенаправляем
      // НО пропускаем, если skipAuthErrorHandling = true
      if (
        apiErrorHandler.shouldRedirect(errorData.statusCode) &&
        !skipAuthErrorHandling
      ) {
        apiErrorHandler.handleAuthError(errorData);
      }

      throw new APIError(errorData);
    }

    return data as T;
  } catch (error) {
    // Если уже APIError - пробрасываем дальше
    if (error instanceof APIError) {
      throw error;
    }

    // Обрабатываем прочие ошибки (сеть, парсинг и т.д.)
    throw apiErrorHandler.handleError(error, endpoint);
  }
}

// Export API_BASE_URL for other modules
export { API_BASE_URL };
