/**
 * ResponseHandler - обработка HTTP ответов
 * Отвечает за парсинг ответов и валидацию статусов
 */

import { logger } from "@/utils/logger";
import type { BadRequestExceptionDto } from "./types";

/**
 * Результат обработки ответа
 */
export interface ParsedResponse<T = unknown> {
  /** Распарсенные данные */
  data: T | undefined;
  /** Есть ли ошибка */
  hasError: boolean;
  /** Данные ошибки если есть */
  errorData?: BadRequestExceptionDto;
}

/**
 * Класс для обработки HTTP ответов
 */
export class ResponseHandler {
  private static instance: ResponseHandler;

  private constructor() {}

  /**
   * Получить singleton instance
   */
  static getInstance(): ResponseHandler {
    if (!ResponseHandler.instance) {
      ResponseHandler.instance = new ResponseHandler();
    }
    return ResponseHandler.instance;
  }

  /**
   * Проверяет является ли ответ JSON
   */
  private isJsonResponse(response: Response): boolean {
    const contentType = response.headers.get("content-type");
    return !!(contentType && contentType.includes("application/json"));
  }

  /**
   * Обработать HTTP ответ
   *
   * @param response - HTTP Response object
   * @param endpoint - endpoint для логирования
   * @returns распарсенный ответ
   */
  async parseResponse<T>(
    response: Response,
    endpoint: string,
  ): Promise<ParsedResponse<T>> {
    // Логируем ответ для админских эндпоинтов
    if (endpoint.includes('/admin/')) {
      console.log('📥 API Response Debug:', {
        endpoint,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        ok: response.ok
      });
    }

    // Handle 204 No Content
    if (response.status === 204) {
      console.log('✅ 204 No Content response for:', endpoint);
      return {
        data: undefined,
        hasError: false,
      };
    }

    // Проверяем наличие JSON контента
    const hasJsonContent = this.isJsonResponse(response);

    // Парсим JSON если есть
    let data: unknown;
    if (hasJsonContent) {
      try {
        data = await response.json();
      } catch (error) {
        logger.error("Failed to parse JSON response", error, {
          component: "ResponseHandler",
          endpoint,
          status: response.status,
        });

        // Если парсинг провалился, но ответ OK - возвращаем undefined
        if (response.ok) {
          return { data: undefined, hasError: false };
        }

        // Иначе создаем ошибку
        return {
          data: undefined,
          hasError: true,
          errorData: {
            message: "Failed to parse response",
            statusCode: response.status,
            errorField: null,
          },
        };
      }
    } else {
      // Нет JSON контента
      if (response.ok) {
        return { data: undefined, hasError: false };
      }

      // Не OK и нет JSON - создаем ошибку
      data = {
        message: response.statusText || "Unknown error",
        statusCode: response.status,
        errorField: null,
      };
    }

    // Проверяем статус ответа
    if (!response.ok) {
      logger.error("API Error Response", {
        component: "ResponseHandler",
        status: response.status,
        statusText: response.statusText,
        data,
        endpoint,
      });

      // Дополнительная диагностика для 500 ошибок
      if (response.status === 500) {
        logger.error("500 Error Details", {
          component: "ResponseHandler",
          responseBody: data,
          headers: Object.fromEntries(response.headers.entries()),
          url: endpoint,
        });
      }

      return {
        data: undefined,
        hasError: true,
        errorData: data as BadRequestExceptionDto,
      };
    }

    // Успешный ответ

    return {
      data: data as T,
      hasError: false,
    };
  }

  /**
   * Создать Response из ошибки (для тестирования)
   */
  createErrorResponse(
    message: string,
    statusCode: number,
  ): BadRequestExceptionDto {
    return {
      message,
      statusCode,
      errorField: null,
    };
  }
}

// Export singleton instance
export const responseHandler = ResponseHandler.getInstance();
