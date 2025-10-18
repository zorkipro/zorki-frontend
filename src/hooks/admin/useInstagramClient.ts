// ============================================
// Instagram Client Management Hook
// ============================================
// Хук для управления Instagram клиентом
// Используется админами для настройки Instagram аккаунтов
// ============================================

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { igClientLogin } from "@/api/endpoints/instagram";
import type {
  IgClientLoginInputDto,
  IgClientLoginOutputDto,
} from "@/api/types";

interface UseInstagramClientReturn {
  // Состояние загрузки
  loading: boolean;
  error: string | null;

  // Состояние авторизации
  isAuthorized: boolean;
  isVerify: boolean;

  // Действия
  login: (data: IgClientLoginInputDto) => Promise<IgClientLoginOutputDto>;

  // Утилиты
  clearError: () => void;
  reset: () => void;
}

/**
 * Хук для управления Instagram клиентом
 *
 * Workflow:
 * 1. Админ вводит username и password
 * 2. Вызывается login() - аккаунт авторизуется
 * 3. Если успешно - аккаунт готов к использованию
 *
 * @returns объект с состоянием и методами управления
 *
 * @example
 * ```typescript
 * const {
 *   loading,
 *   error,
 *   isAuthorized,
 *   isVerify,
 *   login,
 *   clearError,
 *   reset
 * } = useInstagramClient();
 *
 * // Логин
 * const loginResult = await login({
 *   username: 'my_instagram_account',
 *   password: 'my_password'
 * });
 * ```
 */
export const useInstagramClient = (): UseInstagramClientReturn => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isVerify, setIsVerify] = useState(false);

  // Логин Instagram аккаунта
  const login = useCallback(
    async (data: IgClientLoginInputDto): Promise<IgClientLoginOutputDto> => {
      try {
        setLoading(true);
        setError(null);

        const result = await igClientLogin(data);

        setIsAuthorized(result.isAuthorized);
        setIsVerify(result.isVerify);

        if (result.isAuthorized && result.isVerify) {
          toast({
            title: "Успешно",
            description:
              "Instagram аккаунт авторизован и готов к использованию",
          });
        } else {
          toast({
            title: "Ошибка авторизации",
            description: "Не удалось авторизовать Instagram аккаунт",
            variant: "destructive",
          });
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Ошибка авторизации Instagram";
        setError(errorMessage);

        toast({
          title: "Ошибка",
          description: errorMessage,
          variant: "destructive",
        });

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Очистка ошибки
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Сброс состояния
  const reset = useCallback(() => {
    setError(null);
    setIsAuthorized(false);
    setIsVerify(false);
  }, []);

  return {
    loading,
    error,
    isAuthorized,
    isVerify,
    login,
    clearError,
    reset,
  };
};
