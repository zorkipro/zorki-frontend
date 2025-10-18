import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { APIError } from "@/api/client";
import { logError } from "@/utils/logger";

interface InstagramClientStatus {
  isActive: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useInstagramClientStatus = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<InstagramClientStatus>({
    isActive: false,
    isLoading: true,
    error: null,
  });

  const checkStatus = async () => {
    try {
      setStatus((prev) => ({ ...prev, isLoading: true, error: null }));

      // Попробуем создать тестового блогера с известным username
      // Если это не сработает, значит Instagram клиент не настроен
      const testUsername = "instagram"; // Официальный аккаунт Instagram

      // Здесь можно добавить специальный endpoint для проверки статуса клиента
      // Пока что будем полагаться на ошибки при создании блогера

      setStatus({
        isActive: true, // Предполагаем, что активен, пока не получим ошибку
        isLoading: false,
        error: null,
      });
    } catch (error) {
      logError("Instagram client status check failed:", error);

      let errorMessage = "Неизвестная ошибка";
      if (error instanceof APIError) {
        if (error.message.includes("username not found")) {
          errorMessage = "Instagram клиент не настроен или недоступен";
        } else if (error.message.includes("parsing ig error")) {
          errorMessage = "Ошибка парсинга Instagram данных";
        } else {
          errorMessage = error.message;
        }
      }

      setStatus({
        isActive: false,
        isLoading: false,
        error: errorMessage,
      });
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return {
    ...status,
    refresh: checkStatus,
  };
};
