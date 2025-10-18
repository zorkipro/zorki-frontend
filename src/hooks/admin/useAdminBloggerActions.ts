import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { APIError } from "@/api/client";
import { logError } from "@/utils/logger";
import { useErrorHandler } from "@/utils/errorHandler";
import { adminCreateBlogger } from "@/api/endpoints/admin";
import { normalizeUsername } from "@/utils/username";

export const useAdminBloggerActions = (onUpdate: () => void) => {
  const { toast } = useToast();
  const { handleError } = useErrorHandler({ showNotifications: true });

  const addBlogger = useCallback(
    async (instagramUsername: string) => {
      try {
        // Валидация username
        if (!instagramUsername || !instagramUsername.trim()) {
          throw new Error("Username не может быть пустым");
        }

        // Убираем @ если есть
        const cleanUsername = normalizeUsername(instagramUsername);

        if (cleanUsername.length < 1 || cleanUsername.length > 30) {
          throw new Error("Username должен быть от 1 до 30 символов");
        }

        // Проверяем формат username (только буквы, цифры, точки, подчеркивания)
        const usernameRegex = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9._]{1,30}$/;
        if (!usernameRegex.test(cleanUsername)) {
          throw new Error(
            "Username содержит недопустимые символы. Используйте только буквы, цифры, точки и подчеркивания",
          );
        }

        await adminCreateBlogger(cleanUsername);

        toast({
          title: "Успех",
          description: `Блогер @${cleanUsername} успешно создан`,
          variant: "default",
        });

        onUpdate();
      } catch (error: unknown) {
        // Улучшенная обработка ошибок
        if (error instanceof Error) {
          if (error.message.includes("username not found")) {
            toast({
              title: "Ошибка",
              description: `Instagram аккаунт @${instagramUsername} не найден или недоступен. Проверьте правильность username и убедитесь, что аккаунт существует.`,
              variant: "destructive",
            });
          } else if (error.message.includes("parsing ig error")) {
            toast({
              title: "Ошибка парсинга",
              description:
                "Не удалось загрузить данные из Instagram. Возможно, Instagram клиент не настроен или недоступен.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Ошибка",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Ошибка",
            description: "Произошла неизвестная ошибка при создании блогера",
            variant: "destructive",
          });
        }

        handleError(error, { showNotification: false }); // Не показываем дублирующие уведомления
        throw error;
      }
    },
    [onUpdate, toast, handleError],
  );

  const updateBlogger = useCallback(
    async (id: string, updates: Record<string, unknown>) => {
      try {
        throw new Error(
          "Обновление блогеров через API пока не реализовано. Обратитесь к backend разработчику для добавления PUT /admin/blogger/:id endpoint.",
        );
      } catch (error: unknown) {
        logError("Error updating blogger:", error);

        if (error instanceof APIError) {
          toast({
            title: "Ошибка API",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Ошибка",
            description:
              error instanceof Error
                ? error.message
                : "Не удалось обновить данные блогера",
            variant: "destructive",
          });
        }
        throw error;
      }
    },
    [onUpdate, toast],
  );

  const deleteBlogger = useCallback(
    async (id: string) => {
      try {
        throw new Error(
          "Удаление блогеров через API пока не реализовано. Обратитесь к backend разработчику для добавления DELETE /admin/blogger/:id endpoint.",
        );
      } catch (error: unknown) {
        handleError(error, { showNotification: true });
        throw error;
      }
    },
    [onUpdate],
  );

  const toggleVisibility = useCallback(
    async (id: string, currentVisibility: boolean) => {
      try {
        throw new Error(
          "Изменение видимости блогеров через API пока не реализовано. Обратитесь к backend разработчику для добавления PATCH /admin/blogger/:id/visibility endpoint.",
        );
      } catch (error: unknown) {
        handleError(error, { showNotification: true });
        throw error;
      }
    },
    [onUpdate],
  );

  return {
    addBlogger,
    updateBlogger,
    deleteBlogger,
    toggleVisibility,
  };
};
