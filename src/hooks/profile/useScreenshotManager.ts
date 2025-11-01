import { useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { APIError } from "@/api/client";
import { logError } from "@/utils/logger";
import { useScreenshotLoader } from "./useScreenshotLoader";
import { useScreenshotUploader } from "./useScreenshotUploader";
import { useStatsFileManagement } from "./useStatsFileManagement";
import type { Screenshot } from "@/types/profile";

export const useScreenshotManager = (
  profileId?: string,
  platform: string = "instagram",
  isEditorPage: boolean = false,
  onScreenshotsUpdate?: (platform: string, screenshots: Screenshot[]) => void,
) => {
  const { toast } = useToast();

  const { screenshots, loading, error, fetchScreenshots, setScreenshots } =
    useScreenshotLoader(profileId, platform, isEditorPage);

  useEffect(() => {
    if (!onScreenshotsUpdate || loading) return;
    onScreenshotsUpdate(platform, screenshots);
  }, [loading, platform, screenshots, onScreenshotsUpdate]);

  // Загрузка новых скриншотов
  const {
    uploading,
    error: uploadError,
    uploadScreenshot: upload,
    uploadMultipleScreenshots: uploadMultiple,
  } = useScreenshotUploader(profileId, platform, screenshots);

  // Управление удалением файлов
  const { deleting, deleteFile } = useStatsFileManagement();

  const updateScreenshots = useCallback(
    (newScreenshots: Screenshot[]) => {
      setScreenshots(newScreenshots);
      onScreenshotsUpdate?.(platform, newScreenshots);
    },
    [setScreenshots, onScreenshotsUpdate, platform],
  );

  const uploadScreenshot = useCallback(
    async (file: File, userId: string) => {
      const result = await upload(file, userId);
      if (result && profileId) {
        updateScreenshots([result, ...screenshots]);
      }
    },
    [upload, profileId, screenshots, updateScreenshots],
  );

  const uploadMultipleScreenshots = useCallback(
    async (files: File[], userId: string) => {
      const results = await uploadMultiple(files, userId);
      if (results.length > 0 && profileId) {
        updateScreenshots([...results, ...screenshots]);
      }
    },
    [uploadMultiple, profileId, screenshots, updateScreenshots],
  );

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
        await deleteFile(Number(profileId), screenshot.id);
        updateScreenshots(screenshots.filter((s) => s.id !== screenshot.id));
      } catch (error) {
        toast({
          title: "Ошибка удаления",
          description: "Не удалось удалить скриншот",
          variant: "destructive",
        });
        logError("Error deleting screenshot:", error);
      }
    },
    [profileId, deleteFile, screenshots, updateScreenshots, toast],
  );

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
