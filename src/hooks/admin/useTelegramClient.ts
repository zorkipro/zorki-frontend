// ============================================
// Telegram Client Management Hook
// ============================================
// Хук для управления Telegram клиентом
// Используется админами для настройки Telegram аккаунтов
// ============================================

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { tgClientLogin, tgClientConfirm } from "@/api/endpoints/telegram";
import type {
  TgClientLoginInputDto,
  TgClientLoginOutputDto,
  TgClientConfirmInputDto,
  TgClientConfirmOutputDto,
} from "@/api/types";

interface UseTelegramClientReturn {
  // Состояние загрузки
  loading: boolean;
  error: string | null;

  // Состояние авторизации
  isAuthorized: boolean;
  isVerify: boolean;

  // Действия
  login: (data: TgClientLoginInputDto) => Promise<TgClientLoginOutputDto>;
  confirm: (data: TgClientConfirmInputDto) => Promise<TgClientConfirmOutputDto>;

  // Утилиты
  clearError: () => void;
  reset: () => void;
}

/**
 * Хук для управления Telegram клиентом
 *
 * Workflow:
 * 1. Админ вводит phone, apiHash, apiId
 * 2. Вызывается login() - отправляется SMS код
 * 3. Админ вводит полученный код
 * 4. Вызывается confirm() - аккаунт подтверждается
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
 *   confirm,
 *   clearError,
 *   reset
 * } = useTelegramClient();
 *
 * // Логин
 * const loginResult = await login({
 *   phone: '+1234567890',
 *   apiHash: 'your_api_hash',
 *   apiId: 123456789
 * });
 *
 * // Подтверждение
 * const confirmResult = await confirm({
 *   phone: '+1234567890',
 *   code: '12345'
 * });
 * ```
 */
export const useTelegramClient = (): UseTelegramClientReturn => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isVerify, setIsVerify] = useState(false);

  // Логин Telegram аккаунта
  const login = useCallback(
    async (data: TgClientLoginInputDto): Promise<TgClientLoginOutputDto> => {
      try {
        setLoading(true);
        setError(null);

        const result = await tgClientLogin(data);

        setIsAuthorized(result.isAuthorized);
        setIsVerify(result.isVerify);

        if (result.isAuthorized && result.isVerify) {
          toast({
            title: "Успешно",
            description: "Telegram аккаунт авторизован и готов к использованию",
          });
        } else if (result.isAuthorized) {
          toast({
            title: "Код отправлен",
            description:
              "SMS код отправлен на указанный номер. Введите код для подтверждения.",
          });
        } else {
          toast({
            title: "Ошибка авторизации",
            description: "Не удалось авторизовать Telegram аккаунт",
            variant: "destructive",
          });
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Ошибка авторизации Telegram";
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

  // Подтверждение логина с кодом
  const confirm = useCallback(
    async (
      data: TgClientConfirmInputDto,
    ): Promise<TgClientConfirmOutputDto> => {
      try {
        setLoading(true);
        setError(null);

        const result = await tgClientConfirm(data);

        setIsAuthorized(result.isAuthorized);
        setIsVerify(result.isVerify);

        if (result.isAuthorized && result.isVerify) {
          toast({
            title: "Успешно",
            description: "Telegram аккаунт подтвержден и готов к использованию",
          });
        } else {
          toast({
            title: "Ошибка подтверждения",
            description: "Неверный код или ошибка подтверждения",
            variant: "destructive",
          });
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Ошибка подтверждения Telegram";
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
    confirm,
    clearError,
    reset,
  };
};
