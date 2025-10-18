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
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить файлы',
          variant: 'destructive',
        });
        throw error;
      } finally {
        setUploading(false);
      }
    },
    [bloggerId, platform, toast, onUploadSuccess]
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