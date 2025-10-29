import { useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { APIError } from "@/api/client";
import { logError } from "@/utils/logger";
import { useScreenshotLoader } from "./useScreenshotLoader";
import { useScreenshotUploader } from "./useScreenshotUploader";
import { useStatsFileManagement } from "./useStatsFileManagement";
import type { Screenshot } from "@/types/profile";

/**
 * Главный хук для управления скриншотами
 * Объединяет загрузку, удаление и кеширование
 */
export const useScreenshotManager = (
  profileId?: string,
  platform: string = "instagram",
  isEditorPage: boolean = false,
  onScreenshotsUpdate?: (platform: string, screenshots: Screenshot[]) => void,
) => {
  const { toast } = useToast();

  // Загрузка скриншотов
  const { screenshots, loading, error, fetchScreenshots, setScreenshots } =
    useScreenshotLoader(profileId, platform, isEditorPage);

  // Синхронизируем скриншоты с availablePlatforms при загрузке
  useEffect(() => {
    if (screenshots.length > 0 && onScreenshotsUpdate) {
      onScreenshotsUpdate(platform, screenshots);
    }
  }, [screenshots, platform, onScreenshotsUpdate]);

  // Загрузка новых скриншотов
  const {
    uploading,
    error: uploadError,
    uploadScreenshot: upload,
    uploadMultipleScreenshots: uploadMultiple,
  } = useScreenshotUploader(profileId, platform, screenshots);

  // Управление удалением файлов
  const { deleting, confirmDelete } = useStatsFileManagement();

  // Upload with cache update
  const uploadScreenshot = useCallback(
    async (file: File, userId: string) => {
      const result = await upload(file, userId);
      if (result && profileId) {
        const newScreenshots = [result, ...screenshots];
        setScreenshots(newScreenshots);
        
        // Обновляем availablePlatforms если есть callback
        if (onScreenshotsUpdate) {
          onScreenshotsUpdate(platform, newScreenshots);
        }
      }
    },
    [upload, profileId, setScreenshots, screenshots, onScreenshotsUpdate, platform],
  );

  const uploadMultipleScreenshots = useCallback(
    async (files: File[], userId: string) => {
      const results = await uploadMultiple(files, userId);
      if (results.length > 0 && profileId) {
        const newScreenshots = [...results, ...screenshots];
        setScreenshots(newScreenshots);
        
        // Обновляем availablePlatforms если есть callback
        if (onScreenshotsUpdate) {
          onScreenshotsUpdate(platform, newScreenshots);
        }
      }
    },
    [uploadMultiple, profileId, setScreenshots, screenshots, onScreenshotsUpdate, platform],
  );

  // Удаление скриншота с обновлением кеша
  const deleteScreenshot = useCallback(
    async (screenshot: Screenshot) => {
      if (!profileId) {
        toast({
          title: "Ошибка",
          description: "ID профиля не найден",
          variant: "destructive",
        });
        return;
      }

      try {
        await confirmDelete(
          Number(profileId),
          screenshot.id,
          screenshot.file_name,
        );

        // Обновляем кеш - удаляем скриншот из списка
        const newScreenshots = screenshots.filter((s) => s.id !== screenshot.id);
        setScreenshots(newScreenshots);
        
        // Обновляем availablePlatforms если есть callback
        if (onScreenshotsUpdate) {
          onScreenshotsUpdate(platform, newScreenshots);
        }
      } catch (error) {
        // Ошибка уже обработана в confirmDelete
        logError("Error deleting screenshot:", error);
      }
    },
    [profileId, confirmDelete, setScreenshots, screenshots, onScreenshotsUpdate, platform, toast],
  );

  // Cache management
  return {
    screenshots,
    uploading: uploading || deleting,
    loading,
    error: error || uploadError,
    uploadScreenshot,
    uploadMultipleScreenshots,
    deleteScreenshot,
    fetchScreenshots,
  };
};
