import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { adminCreateBlogger } from "@/api/endpoints/admin";
import { normalizeUsername } from "@/utils/username";

export const useAdminBloggerActions = (onUpdate: () => void) => {
  const { toast } = useToast();

  const addBlogger = useCallback(
    async (instagramUsername: string) => {
      const cleanUsername = normalizeUsername(instagramUsername.trim());
      try {
        await adminCreateBlogger(cleanUsername);
        toast({
          title: "Успех",
          description: `Блогер @${cleanUsername} успешно создан`,
        });
        onUpdate();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Произошла неизвестная ошибка при создании блогера";
        let description = errorMessage;
        
        if (error instanceof Error) {
          if (error.message.includes("username not found")) {
            description = `Instagram аккаунт @${instagramUsername} не найден или недоступен`;
          } else if (error.message.includes("parsing ig error")) {
            description = "Не удалось загрузить данные из Instagram";
          }
        }
        
        toast({
          title: "Ошибка",
          description,
          variant: "destructive",
        });
        throw error;
      }
    },
    [onUpdate, toast],
  );

  return { addBlogger };
};
