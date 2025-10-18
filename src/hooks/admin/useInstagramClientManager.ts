import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { APIError } from "@/api/client";
import { logError } from "@/utils/logger";
import { igClientLogin } from "@/api/endpoints/instagram";

interface InstagramClientConfig {
  username: string;
  password: string;
}

export const useInstagramClientManager = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const loginInstagramClient = useCallback(
    async (config: InstagramClientConfig) => {
      try {
        setIsLoading(true);

        const result = await igClientLogin({
          username: config.username,
          password: config.password,
        });

        if (result.isAuthorized && result.isVerify) {
          toast({
            title: "Успех",
            description: "Instagram клиент успешно настроен",
            variant: "default",
          });
          return true;
        } else {
          toast({
            title: "Ошибка",
            description: "Не удалось авторизовать Instagram клиент",
            variant: "destructive",
          });
          return false;
        }
      } catch (error: unknown) {
        logError("Instagram client login failed:", error);

        let errorMessage = "Неизвестная ошибка";
        if (error instanceof APIError) {
          if (error.message.includes("can not load ig session")) {
            errorMessage =
              "Не удалось загрузить сессию Instagram. Проверьте учетные данные.";
          } else {
            errorMessage = error.message;
          }
        }

        toast({
          title: "Ошибка",
          description: errorMessage,
          variant: "destructive",
        });

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  return {
    loginInstagramClient,
    isLoading,
  };
};
