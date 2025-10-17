import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { APIError } from '@/api/client';
import { logError } from '@/utils/logger';
import { useScreenshotLoader } from './useScreenshotLoader';
import { useScreenshotUploader } from './useScreenshotUploader';
import type { Screenshot } from '@/types/profile';

/**
 * Главный хук для управления скриншотами
 * Объединяет загрузку, удаление и кеширование
 */
export const useScreenshotManager = (
  profileId?: string,
  platform: string = 'instagram',
  isEditorPage: boolean = false
) => {
  const { toast } = useToast();

  // Загрузка скриншотов
  const { screenshots, loading, error, fetchScreenshots, setScreenshots } = useScreenshotLoader(
    profileId,
    platform,
    isEditorPage
  );

  // Загрузка новых скриншотов
  const {
    uploading,
    error: uploadError,
    uploadScreenshot: upload,
    uploadMultipleScreenshots: uploadMultiple,
  } = useScreenshotUploader(profileId, platform);

  // Удаление скриншота
  const deleteScreenshot = useCallback(
    async (screenshot: Screenshot) => {
      try {
        throw new Error(
          'Удаление скриншотов через API пока не реализовано. Обратитесь к backend разработчику для добавления DELETE /blogger/screenshot/:screenshotId endpoint.'
        );
      } catch (error: unknown) {
        logError('Error deleting screenshot:', error);

        if (error instanceof APIError) {
          toast({
            title: 'Ошибка API',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          const errorMessage =
            error instanceof Error ? error.message : 'Не удалось удалить скриншот';
          toast({
            title: 'Ошибка',
            description: errorMessage,
            variant: 'destructive',
          });
        }
      }
    },
    [toast]
  );

  // Upload with cache update
  const uploadScreenshot = useCallback(
    async (file: File, userId: string) => {
      const result = await upload(file, userId);
      if (result && profileId) {
        setScreenshots((prev) => [result, ...prev]);
      }
    },
    [upload, profileId, setScreenshots]
  );

  const uploadMultipleScreenshots = useCallback(
    async (files: File[], userId: string) => {
      const results = await uploadMultiple(files, userId);
      if (results.length > 0 && profileId) {
        setScreenshots((prev) => [...results, ...prev]);
      }
    },
    [uploadMultiple, profileId, setScreenshots]
  );

  // Cache management
  return {
    screenshots,
    uploading,
    loading,
    error: error || uploadError,
    uploadScreenshot,
    uploadMultipleScreenshots,
    deleteScreenshot,
    fetchScreenshots,
  };
};
