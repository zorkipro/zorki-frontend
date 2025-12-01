// ============================================
// Admin Social Media Linking Hook
// ============================================
// Хук для админов для прямого связывания социальных сетей с блогерами
// Админы могут добавлять платформы напрямую без модерации
// ============================================

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/utils/errorHandler";
import {
  adminLinkTgChannelToBlogger,
  adminLinkYtChannelToBlogger,
  adminLinkTikTokChannelToBlogger,
} from "@/api/endpoints/admin";
import type {
  BloggerLinkMediaTgRequestInputDto,
  BloggerLinkMediaYtRequestInputDto,
  BloggerLinkMediaTtRequestInputDto,
} from "@/api/types";

interface UseAdminSocialLinkingReturn {
  // Состояние загрузки
  loading: boolean;
  error: string | null;

  // Действия для админов (прямое связывание без модерации)
  linkTgChannel: (
    bloggerId: number,
    data: BloggerLinkMediaTgRequestInputDto,
  ) => Promise<void>;
  linkYtChannel: (
    bloggerId: number,
    data: BloggerLinkMediaYtRequestInputDto,
  ) => Promise<void>;
  linkTikTokChannel: (
    bloggerId: number,
    data: BloggerLinkMediaTtRequestInputDto,
  ) => Promise<void>;

  // Утилиты
  clearError: () => void;
}

/**
 * Хук для админов для прямого связывания социальных сетей с блогерами
 * 
 * В отличие от useSocialLinking, этот хук напрямую связывает платформы
 * без необходимости модерации запросов.
 *
 * @returns объект с методами для связывания социальных сетей
 *
 * @example
 * ```typescript
 * const {
 *   loading,
 *   error,
 *   linkTgChannel,
 *   linkYtChannel,
 *   clearError
 * } = useAdminSocialLinking();
 *
 * // Админ напрямую связывает Telegram канал
 * await linkTgChannel(123, { username: 'my_channel' });
 *
 * // Админ напрямую связывает YouTube канал
 * await linkYtChannel(123, { channel: 'my_channel' });
 * ```
 */
export const useAdminSocialLinking = (): UseAdminSocialLinkingReturn => {
  const { toast } = useToast();
  const { handleError } = useErrorHandler({ showNotifications: true });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Прямое связывание Telegram канала (админ)
  const linkTgChannel = useCallback(
    async (
      bloggerId: number,
      data: BloggerLinkMediaTgRequestInputDto,
    ): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        await adminLinkTgChannelToBlogger(bloggerId, data);

        toast({
          title: "Успешно",
          description: "Telegram канал успешно связан с блогером",
        });
      } catch (err) {
        // Обработка специфичных ошибок Telegram
        let errorMessage = "Ошибка связывания канала";
        if (err instanceof Error) {
          if (err.message.includes("not a channel")) {
            errorMessage = "Не удалось найти канал Telegram. Возможные причины:\n• Канал не существует или удален\n• Канал является приватным\n• Проблемы с доступом к Telegram API\n• Неверный формат username\n\nПопробуйте:\n• Проверить правильность написания\n• Использовать другой публичный канал\n• Попробовать позже";
          } else if (err.message.includes("already linked")) {
            errorMessage = "Этот канал уже привязан к другому блогеру";
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

  // Прямое связывание YouTube канала (админ)
  const linkYtChannel = useCallback(
    async (
      bloggerId: number,
      data: BloggerLinkMediaYtRequestInputDto,
    ): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        await adminLinkYtChannelToBlogger(bloggerId, data);

        toast({
          title: "Успешно",
          description: "YouTube канал успешно связан с блогером",
        });
      } catch (err) {
        // Обработка специфичных ошибок YouTube
        let errorMessage = "Ошибка связывания канала";
        if (err instanceof Error) {
          if (err.message.includes("not found") || err.message.includes("channel not found")) {
            errorMessage = "Канал YouTube не найден. Возможные причины:\n• Канал не существует или удален\n• Канал является приватным\n• Неверный формат URL или handle\n• Проблемы с доступом к YouTube API\n\nПопробуйте:\n• Проверить правильность написания\n• Использовать другой публичный канал\n• Проверить канал в YouTube";
          } else if (err.message.includes("already linked")) {
            errorMessage = "Этот канал уже привязан к другому блогеру";
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

  // Прямое связывание TikTok канала (админ)
  const linkTikTokChannel = useCallback(
    async (
      bloggerId: number,
      data: BloggerLinkMediaTtRequestInputDto,
    ): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        await adminLinkTikTokChannelToBlogger(bloggerId, data);

        toast({
          title: "Успешно",
          description: "TikTok аккаунт успешно связан с блогером",
        });
      } catch (err) {
        // Обработка специфичных ошибок TikTok
        let errorMessage = "Ошибка связывания аккаунта";
        if (err instanceof Error) {
          if (err.message.includes("not found") || err.message.includes("account not found")) {
            errorMessage = "TikTok аккаунт не найден. Возможные причины:\n• Аккаунт не существует или удален\n• Аккаунт является приватным\n• Неверный формат username\n• Проблемы с доступом к TikTok API\n\nПопробуйте:\n• Проверить правильность написания\n• Использовать другой публичный аккаунт\n• Проверить аккаунт в TikTok";
          } else if (err.message.includes("already linked")) {
            errorMessage = "Этот аккаунт уже привязан к другому блогеру";
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

  // Очистка ошибки
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    linkTgChannel,
    linkYtChannel,
    linkTikTokChannel,
    clearError,
  };
};

