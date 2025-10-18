// ============================================
// Social Media Linking Hook
// ============================================
// Хук для связывания социальных сетей с блогерами
// Пользователи отправляют запросы, админы их одобряют
// ============================================

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/utils/errorHandler";
import {
  linkTgChannelRequest,
  linkYtChannelRequest,
  linkIgUserRequest,
  linkTgChannel,
  linkYtChannel,
  linkIgUser,
} from "@/api/endpoints/social-linking";
import type {
  BloggerLinkMediaTgRequestInputDto,
  BloggerLinkMediaYtRequestInputDto,
  BloggerLinkMediaIgRequestInputDto,
} from "@/api/types";

interface UseSocialLinkingReturn {
  // Состояние загрузки
  loading: boolean;
  error: string | null;

  // Действия для пользователей (отправка запросов)
  requestTgLink: (
    bloggerId: number,
    data: BloggerLinkMediaTgRequestInputDto,
  ) => Promise<void>;
  requestYtLink: (
    bloggerId: number,
    data: BloggerLinkMediaYtRequestInputDto,
  ) => Promise<void>;
  requestIgLink: (
    bloggerId: number,
    data: BloggerLinkMediaIgRequestInputDto,
  ) => Promise<void>;

  // Действия для админов (одобрение запросов)
  approveTgLink: (bloggerId: number, requestId: number) => Promise<void>;
  approveYtLink: (bloggerId: number, requestId: number) => Promise<void>;
  approveIgLink: (bloggerId: number, requestId: number) => Promise<void>;

  // Утилиты
  clearError: () => void;
}

/**
 * Хук для связывания социальных сетей с блогерами
 *
 * Workflow:
 * 1. Пользователь отправляет запрос на связывание (requestTgLink, requestYtLink, requestIgLink)
 * 2. Админ получает уведомление о запросе
 * 3. Админ одобряет или отклоняет запрос (approveTgLink, approveYtLink, approveIgLink)
 *
 * @returns объект с методами для связывания социальных сетей
 *
 * @example
 * ```typescript
 * const {
 *   loading,
 *   error,
 *   requestTgLink,
 *   requestYtLink,
 *   requestIgLink,
 *   approveTgLink,
 *   approveYtLink,
 *   approveIgLink,
 *   clearError
 * } = useSocialLinking();
 *
 * // Пользователь отправляет запрос
 * await requestTgLink(123, { username: 'my_channel' });
 *
 * // Админ одобряет запрос
 * await approveTgLink(123, 456);
 * ```
 */
export const useSocialLinking = (): UseSocialLinkingReturn => {
  const { toast } = useToast();
  const { handleError } = useErrorHandler({ showNotifications: true });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Отправка запроса на связывание Telegram канала
  const requestTgLink = useCallback(
    async (
      bloggerId: number,
      data: BloggerLinkMediaTgRequestInputDto,
    ): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        await linkTgChannelRequest(bloggerId, data);

        toast({
          title: "Запрос отправлен",
          description:
            "Запрос на связывание Telegram канала отправлен на модерацию",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Ошибка отправки запроса";
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

  // Отправка запроса на связывание YouTube канала
  const requestYtLink = useCallback(
    async (
      bloggerId: number,
      data: BloggerLinkMediaYtRequestInputDto,
    ): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        await linkYtChannelRequest(bloggerId, data);

        toast({
          title: "Запрос отправлен",
          description:
            "Запрос на связывание YouTube канала отправлен на модерацию",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Ошибка отправки запроса";
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

  // Отправка запроса на связывание Instagram аккаунта
  const requestIgLink = useCallback(
    async (
      bloggerId: number,
      data: BloggerLinkMediaIgRequestInputDto,
    ): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        await linkIgUserRequest(bloggerId, data);

        toast({
          title: "Запрос отправлен",
          description:
            "Запрос на связывание Instagram аккаунта отправлен на модерацию",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Ошибка отправки запроса";
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

  // Одобрение связывания Telegram канала (админ)
  const approveTgLink = useCallback(
    async (bloggerId: number, requestId: number): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        await linkTgChannel(bloggerId, requestId);

        toast({
          title: "Успешно",
          description: "Telegram канал успешно связан с блогером",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Ошибка одобрения запроса";
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

  // Одобрение связывания YouTube канала (админ)
  const approveYtLink = useCallback(
    async (bloggerId: number, requestId: number): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        await linkYtChannel(bloggerId, requestId);

        toast({
          title: "Успешно",
          description: "YouTube канал успешно связан с блогером",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Ошибка одобрения запроса";
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

  // Одобрение связывания Instagram аккаунта (админ)
  const approveIgLink = useCallback(
    async (bloggerId: number, requestId: number): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        await linkIgUser(bloggerId, requestId);

        toast({
          title: "Успешно",
          description: "Instagram аккаунт успешно связан с блогером",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Ошибка одобрения запроса";
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

  return {
    loading,
    error,
    requestTgLink,
    requestYtLink,
    requestIgLink,
    approveTgLink,
    approveYtLink,
    approveIgLink,
    clearError,
  };
};
