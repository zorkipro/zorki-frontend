// ============================================
// Хук для управления файлами статистики администратором
// ============================================
// Используется в AdminBloggerEditor.tsx для загрузки и удаления файлов статистики
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import { 
  adminUploadBloggerStats, 
  adminDeleteBloggerStatsFile 
} from '@/api/endpoints/admin';
import { validateStatsFiles } from '@/api/types';
import { FILE_VALIDATION } from '@/config/validation';
import type { ApiSocialType } from '@/api/types';
import type { Screenshot } from '@/types/profile';

/**
 * Хук для управления файлами статистики блогера администратором
 * 
 * @param bloggerId - ID блогера
 * @param platform - тип социальной платформы
 * @param existingFiles - существующие файлы статистики
 * @returns объект с состоянием и методами для работы с файлами
 */
export const useAdminStatsFileManagement = (
  bloggerId: string | undefined,
  platform: ApiSocialType,
  existingFiles: Screenshot[] = [],
  onUploadSuccess?: () => void
) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<Screenshot[]>(existingFiles);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const prevExistingFilesRef = useRef<Screenshot[]>(existingFiles);

  useEffect(() => {
    // Проверяем, действительно ли изменились файлы
    const hasChanged = 
      existingFiles.length !== prevExistingFilesRef.current.length ||
      existingFiles.some((file, index) => 
        !prevExistingFilesRef.current[index] || 
        file.id !== prevExistingFilesRef.current[index].id
      );

    if (hasChanged) {
      setFiles(existingFiles);
      prevExistingFilesRef.current = existingFiles;
    }
  }, [existingFiles]);

  /**
   * Загружает файлы статистики на сервер
   * 
   * @param filesToUpload - массив файлов для загрузки
   * @throws Error если bloggerId не указан
   */
  const uploadFiles = useCallback(
    async (filesToUpload: File[]) => {
      if (!bloggerId) {
        throw new Error('Blogger ID is required');
      }

      // Валидация файлов
      const validationError = validateStatsFiles(filesToUpload);
      if (validationError) {
        throw new Error(validationError);
      }

      // Проверка общего количества файлов для социальной сети
      const currentFilesCount = existingFiles.length;
      const totalFilesCount = currentFilesCount + filesToUpload.length;
      
      if (totalFilesCount > FILE_VALIDATION.MAX_STATS_FILES) {
        throw new Error(`Слишком много файлов для ${platform}. Максимум: ${FILE_VALIDATION.MAX_STATS_FILES} файлов. Текущих: ${currentFilesCount}, пытаетесь добавить: ${filesToUpload.length}`);
      }

      setUploading(true);
      try {
        await adminUploadBloggerStats(parseInt(bloggerId), platform, filesToUpload);
        
        toast({
          title: 'Успешно',
          description: `Загружено файлов: ${filesToUpload.length}`,
          variant: 'default',
        });

        // Вызываем callback для обновления данных профиля
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } catch (error) {
        logger.error('Error uploading stats files', error);
        
        let errorMessage = 'Не удалось загрузить файлы';
        let errorTitle = 'Ошибка';
        
        if (error instanceof Error) {
          if (error.message.includes('Слишком много файлов для')) {
            errorMessage = error.message;
            errorTitle = 'Слишком много файлов';
          } else if (error.message.includes('Максимум') && error.message.includes('файлов')) {
            errorMessage = error.message;
            errorTitle = 'Слишком много файлов';
          } else if (error.message.includes('Неподдерживаемый формат')) {
            errorMessage = error.message;
            errorTitle = 'Неподдерживаемый формат';
          } else if (error.message.includes('слишком большой')) {
            errorMessage = error.message;
            errorTitle = 'Файл слишком большой';
          } else {
            errorMessage = error.message;
          }
        }
        
        toast({
          title: errorTitle,
          description: errorMessage,
          variant: 'destructive',
        });
        throw error;
      } finally {
        setUploading(false);
      }
    },
    [bloggerId, platform, toast, onUploadSuccess, existingFiles.length]
  );

  /**
   * Удаляет файл статистики с сервера
   * 
   * @param fileId - ID файла для удаления
   * @throws Error если bloggerId не указан
   */
  const deleteFile = useCallback(
    async (fileId: number) => {
      if (!bloggerId) {
        throw new Error('Blogger ID is required');
      }

      setDeleting(true);
      try {
        await adminDeleteBloggerStatsFile(parseInt(bloggerId), fileId);
        
        // Обновляем локальный стейт
        setFiles(prev => prev.filter(f => f.id !== fileId));
        
        toast({
          title: 'Успешно',
          description: 'Файл удалён',
          variant: 'default',
        });

        // Вызываем callback для обновления данных профиля
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } catch (error) {
        logger.error('Error deleting stats file', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить файл',
          variant: 'destructive',
        });
        throw error;
      } finally {
        setDeleting(false);
      }
    },
    [bloggerId, toast]
  );

  return {
    files,
    uploading,
    deleting,
    uploadFiles,
    deleteFile,
  };
};