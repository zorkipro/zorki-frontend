import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { APIError } from '@/api/client';
import { logError } from '@/utils/logger';
import { uploadBloggerStats } from '@/api/endpoints/blogger';
import { validateStatsFiles } from '@/api/types';
import type { ApiSocialType } from '@/api/types';

/**
 * Хук для загрузки скриншотов
 */
export const useScreenshotUploader = (profileId?: string, platform: string = 'instagram') => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const uploadScreenshot = useCallback(
    async (file: File, userId: string): Promise<any | null> => {
      if (!profileId) {
        logError('No profileId provided to uploadScreenshot');
        return null;
      }

      try {
        setUploading(true);
        setError('');

        // ✅ Реализован API вызов для загрузки статистики
        const bloggerId = parseInt(profileId, 10);
        const socialType = platform.toUpperCase() as ApiSocialType;

        // Валидация файла
        const validationError = validateStatsFiles([file]);
        if (validationError) {
          throw new Error(validationError);
        }

        await uploadBloggerStats(bloggerId, {
          type: socialType,
          files: [file],
        });

        toast({
          title: 'Успех',
          description: 'Файл статистики успешно загружен',
          variant: 'default',
        });

        return { success: true };
      } catch (error: unknown) {
        logError('Error uploading screenshot:', error);

        if (error instanceof APIError) {
          setError(error.message);
          toast({
            title: 'Ошибка API',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          const errorMessage =
            error instanceof Error ? error.message : 'Не удалось загрузить файл статистики';
          setError(errorMessage);
          toast({
            title: 'Ошибка',
            description: errorMessage,
            variant: 'destructive',
          });
        }
        return null;
      } finally {
        setUploading(false);
      }
    },
    [profileId, platform, toast]
  );

  const uploadMultipleScreenshots = useCallback(
    async (files: File[], userId: string): Promise<any[]> => {
      if (!profileId || files.length === 0) return [];

      try {
        setUploading(true);
        setError('');

        // ✅ Реализован API вызов для массовой загрузки статистики
        const bloggerId = parseInt(profileId, 10);
        const socialType = platform.toUpperCase() as ApiSocialType;

        // Валидация файлов
        const validationError = validateStatsFiles(files);
        if (validationError) {
          throw new Error(validationError);
        }

        await uploadBloggerStats(bloggerId, {
          type: socialType,
          files: files,
        });

        toast({
          title: 'Успех',
          description: `${files.length} файлов статистики успешно загружено`,
          variant: 'default',
        });

        return files.map(() => ({ success: true }));
      } catch (error: unknown) {
        logError('Error uploading screenshots:', error);

        if (error instanceof APIError) {
          setError(error.message);
          toast({
            title: 'Ошибка API',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          const errorMessage =
            error instanceof Error ? error.message : 'Не удалось загрузить файлы статистики';
          setError(errorMessage);
          toast({
            title: 'Ошибка',
            description: errorMessage,
            variant: 'destructive',
          });
        }
        return [];
      } finally {
        setUploading(false);
      }
    },
    [profileId, platform, toast]
  );

  return {
    uploading,
    error,
    uploadScreenshot,
    uploadMultipleScreenshots,
  };
};
