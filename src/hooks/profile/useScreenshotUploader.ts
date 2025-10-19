import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { APIError } from "@/api/client";
import { logError } from "@/utils/logger";
import { uploadBloggerStats } from "@/api/endpoints/blogger";
import { validateStatsFiles } from "@/api/types";
import { FILE_VALIDATION } from "@/config/validation";
import type { ApiSocialType } from "@/api/types";
import type { Screenshot } from "@/types/profile";

/**
 * Хук для загрузки скриншотов
 */
export const useScreenshotUploader = (
  profileId?: string,
  platform: string = "instagram",
  existingScreenshots: Screenshot[] = [],
) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Функция для проверки общего количества файлов для социальной сети
  const validateTotalFileCount = useCallback(
    (newFilesCount: number): string | null => {
      const currentFilesCount = existingScreenshots.length;
      const totalFilesCount = currentFilesCount + newFilesCount;
      
      if (totalFilesCount > FILE_VALIDATION.MAX_STATS_FILES) {
        return `Слишком много файлов для ${platform}. Максимум: ${FILE_VALIDATION.MAX_STATS_FILES} файлов. Текущих: ${currentFilesCount}, пытаетесь добавить: ${newFilesCount}`;
      }
      
      return null;
    },
    [existingScreenshots.length, platform],
  );

  const uploadScreenshot = useCallback(
    async (file: File, userId: string): Promise<any | null> => {
      if (!profileId) {
        logError("No profileId provided to uploadScreenshot");
        return null;
      }

      try {
        setUploading(true);
        setError("");

        // ✅ Реализован API вызов для загрузки статистики
        const bloggerId = parseInt(profileId, 10);
        const socialType = platform.toUpperCase() as ApiSocialType;

        // Валидация файла
        const validationError = validateStatsFiles([file]);
        if (validationError) {
          throw new Error(validationError);
        }

        // Проверка общего количества файлов для социальной сети
        const totalCountError = validateTotalFileCount(1);
        if (totalCountError) {
          throw new Error(totalCountError);
        }

        await uploadBloggerStats(bloggerId, {
          type: socialType,
          files: [file],
        });

        toast({
          title: "Успех",
          description: "Файл статистики успешно загружен",
          variant: "default",
        });

        // Возвращаем объект в формате Screenshot для обновления кеша
        return {
          id: Date.now(), // Временный ID, будет заменен при следующей загрузке
          influencer_id: bloggerId,
          platform: platform.toLowerCase(),
          file_name: file.name,
          file_url: URL.createObjectURL(file), // Временный URL для предпросмотра
          file_size: file.size,
          width: 0, // Будет обновлено при следующей загрузке
          height: 0, // Будет обновлено при следующей загрузке
          created_at: new Date().toISOString(),
          is_draft: false,
        };
      } catch (error: unknown) {
        logError("Error uploading screenshot:", error);

        let errorMessage = "Не удалось загрузить файл статистики";
        let errorTitle = "Ошибка";

        if (error instanceof APIError) {
          // Обрабатываем специфичные ошибки API
          if (error.message.includes("request entity too large")) {
            errorMessage = "Файл слишком большой. Максимальный размер: 10MB";
            errorTitle = "Файл слишком большой";
          } else if (error.message.includes("invalid file type")) {
            errorMessage = "Неподдерживаемый формат файла. Разрешены: JPEG, PNG, GIF, WebP, PDF";
            errorTitle = "Неподдерживаемый формат";
          } else if (error.message.includes("Too many files for") || error.message.includes("too many files")) {
            errorMessage = `Слишком много файлов для ${platform}. Максимум: ${FILE_VALIDATION.MAX_STATS_FILES} файлов для одной социальной сети. Удалите некоторые существующие файлы перед загрузкой новых.`;
            errorTitle = "Слишком много файлов";
          } else {
            errorMessage = error.message;
            errorTitle = "Ошибка API";
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        setError(errorMessage);
        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
        });
        return null;
      } finally {
        setUploading(false);
      }
    },
    [profileId, platform, toast, validateTotalFileCount],
  );

  const uploadMultipleScreenshots = useCallback(
    async (files: File[], userId: string): Promise<any[]> => {
      if (!profileId || files.length === 0) return [];

      try {
        setUploading(true);
        setError("");

        // ✅ Реализован API вызов для массовой загрузки статистики
        const bloggerId = parseInt(profileId, 10);
        const socialType = platform.toUpperCase() as ApiSocialType;

        // Валидация файлов
        const validationError = validateStatsFiles(files);
        if (validationError) {
          throw new Error(validationError);
        }

        // Проверка общего количества файлов для социальной сети
        const totalCountError = validateTotalFileCount(files.length);
        if (totalCountError) {
          throw new Error(totalCountError);
        }

        await uploadBloggerStats(bloggerId, {
          type: socialType,
          files: files,
        });

        toast({
          title: "Успех",
          description: `${files.length} файлов статистики успешно загружено`,
          variant: "default",
        });

        // Возвращаем массив объектов в формате Screenshot для обновления кеша
        return files.map((file, index) => ({
          id: Date.now() + index, // Временный ID, будет заменен при следующей загрузке
          influencer_id: bloggerId,
          platform: platform.toLowerCase(),
          file_name: file.name,
          file_url: URL.createObjectURL(file), // Временный URL для предпросмотра
          file_size: file.size,
          width: 0, // Будет обновлено при следующей загрузке
          height: 0, // Будет обновлено при следующей загрузке
          created_at: new Date().toISOString(),
          is_draft: false,
        }));
      } catch (error: unknown) {
        logError("Error uploading screenshots:", error);

        let errorMessage = "Не удалось загрузить файлы статистики";
        let errorTitle = "Ошибка";

        if (error instanceof APIError) {
          // Обрабатываем специфичные ошибки API
          if (error.message.includes("request entity too large")) {
            errorMessage = "Один или несколько файлов слишком большие. Максимальный размер: 10MB";
            errorTitle = "Файлы слишком большие";
          } else if (error.message.includes("invalid file type")) {
            errorMessage = "Неподдерживаемый формат файла. Разрешены: JPEG, PNG, GIF, WebP, PDF";
            errorTitle = "Неподдерживаемый формат";
          } else if (error.message.includes("Too many files for") || error.message.includes("too many files")) {
            errorMessage = `Слишком много файлов для ${platform}. Максимум: ${FILE_VALIDATION.MAX_STATS_FILES} файлов для одной социальной сети. Удалите некоторые существующие файлы перед загрузкой новых.`;
            errorTitle = "Слишком много файлов";
          } else {
            errorMessage = error.message;
            errorTitle = "Ошибка API";
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        setError(errorMessage);
        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
        });
        return [];
      } finally {
        setUploading(false);
      }
    },
    [profileId, platform, toast, validateTotalFileCount],
  );

  return {
    uploading,
    error,
    uploadScreenshot,
    uploadMultipleScreenshots,
  };
};
