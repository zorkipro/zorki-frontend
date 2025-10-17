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
import type { StatsFile } from '@/types/profile';

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
  existingFiles: StatsFile[] = []
) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<StatsFile[]>(existingFiles);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const prevExistingFilesRef = useRef<StatsFile[]>(existingFiles);

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

        // Файлы будут обновлены при следующем fetch профиля
        logger.info('Stats files uploaded successfully', {
          component: 'useAdminStatsFileManagement',
          bloggerId,
          platform,
          filesCount: filesToUpload.length,
        });
      } catch (error) {
        logger.error('Error uploading stats files', error, {
          component: 'useAdminStatsFileManagement',
          bloggerId,
          platform,
        });
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
    [bloggerId, platform, toast]
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

        logger.info('Stats file deleted successfully', {
          component: 'useAdminStatsFileManagement',
          bloggerId,
          fileId,
        });
      } catch (error) {
        logger.error('Error deleting stats file', error, {
          component: 'useAdminStatsFileManagement',
          bloggerId,
          fileId,
        });
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