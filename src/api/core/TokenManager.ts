/**
 * TokenManager - управление токенами аутентификации
 * Отвечает за получение и управление токенами согласно приоритету
 */

import { supabase } from "@/integrations/supabase/client";
import { getAccessToken } from "@/utils/googleAuth";
import { logger } from "@/utils/logger";

/**
 * Приоритет токенов:
 * 1. adminToken (sessionStorage) - для админских операций
 * 2. adminTempToken (sessionStorage) - для подтверждения 2FA
 * 3. accessToken (sessionStorage) - основной токен для пользователей
 * 4. supabaseToken (session) - fallback из Supabase сессии
 */
export class TokenManager {
  private static instance: TokenManager;

  private constructor() {}

  /**
   * Получить singleton instance
   */
  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Получение токена аутентификации согласно приоритету
   *
   * @returns токен или null если токен не найден
   */
  async getAuthToken(): Promise<string | null> {
    // 1. Admin token from sessionStorage (для админских операций)
    const adminToken = sessionStorage.getItem("adminToken");
    if (adminToken) {
      return adminToken;
    }

    // 2. Admin temp token for 2FA (для подтверждения 2FA)
    const adminTempToken = sessionStorage.getItem("adminTempToken");
    if (adminTempToken) {
      return adminTempToken;
    }

    // 3. Access Token из sessionStorage (основной токен для пользователей)
    const accessToken = getAccessToken();
    if (accessToken) {
      return accessToken;
    }

    // 4. Fallback: Supabase токен из сессии
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const supabaseToken = session?.access_token || null;

      if (supabaseToken) {
        return supabaseToken;
      }
    } catch (error) {
      logger.error("Error getting Supabase session", error, {
        component: "TokenManager",
      });
    }

    return null;
  }

  /**
   * Очистить все токены (при выходе из системы)
   */
  clearAllTokens(): void {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminTempToken");
  }

  /**
   * Очистить админские токены (при выходе из админки)
   */
  clearAdminTokens(): void {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminTempToken");
  }

  /**
   * Проверить наличие токена аутентификации
   */
  async hasAuthToken(): Promise<boolean> {
    const token = await this.getAuthToken();
    return token !== null;
  }

  /**
   * Получить тип текущего токена
   */
  getCurrentTokenType(): "admin" | "admin_temp" | "access" | "supabase" | null {
    if (sessionStorage.getItem("adminToken")) return "admin";
    if (sessionStorage.getItem("adminTempToken")) return "admin_temp";
    if (getAccessToken()) return "access";
    return "supabase"; // Проверка Supabase требует async, предполагаем
  }
}

// Export singleton instance
export const tokenManager = TokenManager.getInstance();
