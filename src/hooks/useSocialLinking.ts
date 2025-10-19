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

        console.log('🚀 Sending Telegram link request:', { bloggerId, data });
        console.log('📡 Request details:', {
          url: `/blogger/link/social/tg/${bloggerId}`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        await linkTgChannelRequest(bloggerId, data);

        toast({
          title: "Запрос отправлен",
          description:
            "Запрос на связывание Telegram канала отправлен на модерацию",
        });
      } catch (err) {
        console.error('❌ Telegram link request failed:', err);
        
        // Обработка специфичных ошибок Telegram
        let errorMessage = "Ошибка отправки запроса";
        if (err instanceof Error) {
          if (err.message.includes("not a channel")) {
            errorMessage = "Не удалось найти канал Telegram. Возможные причины:\n• Канал не существует или удален\n• Канал является приватным\n• Проблемы с доступом к Telegram API\n• Неверный формат username\n\nПопробуйте:\n• Проверить правильность написания\n• Использовать другой публичный канал\n• Попробовать позже";
          } else if (err.message.includes("already linked")) {
            errorMessage = "Этот канал уже привязан к другому блогеру";
          } else if (err.message.includes("request has been sent")) {
            errorMessage = "Запрос на привязку этого канала уже отправлен и ожидает модерации";
          } else if (err.message.includes("blogger not found")) {
            errorMessage = "Профиль блогера не найден";
          } else if (err.message.includes("something went wrong")) {
            errorMessage = "Временная проблема с Telegram API. Попробуйте:\n• Проверить правильность username\n• Использовать другой канал\n• Повторить попытку через несколько минут";
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);

        toast({
          title: "Ошибка добавления платформы",
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

        console.log('🚀 Sending YouTube link request:', { bloggerId, data });
        console.log('📡 YouTube request details:', {
          url: `/blogger/link/social/yt/${bloggerId}`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        await linkYtChannelRequest(bloggerId, data);

        toast({
          title: "Запрос отправлен",
          description:
            "Запрос на связывание YouTube канала отправлен на модерацию",
        });
      } catch (err) {
        console.error('❌ YouTube link request failed:', err);
        
        // Обработка специфичных ошибок YouTube
        let errorMessage = "Ошибка отправки запроса";
        if (err instanceof Error) {
          if (err.message.includes("not found") || err.message.includes("channel not found")) {
            errorMessage = "Канал YouTube не найден. Возможные причины:\n• Канал не существует или удален\n• Канал является приватным\n• Неверный формат URL или handle\n• Проблемы с доступом к YouTube API\n\nПопробуйте:\n• Проверить правильность написания\n• Использовать другой публичный канал\n• Проверить канал в YouTube";
          } else if (err.message.includes("already linked")) {
            errorMessage = "Этот канал уже привязан к другому блогеру";
          } else if (err.message.includes("request has been sent")) {
            errorMessage = "Запрос на привязку этого канала уже отправлен и ожидает модерации";
          } else if (err.message.includes("blogger not found")) {
            errorMessage = "Профиль блогера не найден";
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);

        toast({
          title: "Ошибка добавления платформы",
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
