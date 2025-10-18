// ============================================
// Stats File Management Hook (для блогеров)
// ============================================
// Хук для управления файлами статистики блогера
// Функционал удаления файлов с подтверждением
// ============================================

import { useState, useCallback } from "react";
import { deleteBloggerStatsFile } from "@/api/endpoints/blogger";
import { useToast } from "@/hooks/use-toast";

interface UseStatsFileManagementReturn {
  // Состояние удаления
  deleting: boolean;
  error: string | null;

  // Функции
  deleteFile: (bloggerId: number, fileId: number) => Promise<void>;
  confirmDelete: (
    bloggerId: number,
    fileId: number,
    fileName: string,
  ) => Promise<void>;

  // Утилиты
  clearError: () => void;
}

/**
 * Хук для управления файлами статистики блогера
 *
 * Предоставляет функционал удаления файлов:
 * - deleteFile - удаление файла без подтверждения
 * - confirmDelete - удаление с подтверждением (показывает toast)
 *
 * @returns объект с функциями управления файлами и состоянием
 *
 * @example
 * ```typescript
 * const {
 *   deleting,
 *   error,
 *   deleteFile,
 *   confirmDelete,
 *   clearError
 * } = useStatsFileManagement();
 *
 * // Удаление с подтверждением
 * await confirmDelete(123, 456, 'screenshot.jpg');
 *
 * // Прямое удаление
 * await deleteFile(123, 456);
 * ```
 */
export const useStatsFileManagement = (): UseStatsFileManagementReturn => {
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Очистка ошибки
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Удаление файла
  const deleteFile = useCallback(
    async (bloggerId: number, fileId: number): Promise<void> => {
      try {
        setDeleting(true);
        setError(null);

        await deleteBloggerStatsFile(bloggerId, fileId);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Ошибка удаления файла";
        setError(errorMessage);
        throw err; // Пробрасываем ошибку для обработки в компоненте
      } finally {
        setDeleting(false);
      }
    },
    [],
  );

  // Удаление с подтверждением
  const confirmDelete = useCallback(
    async (
      bloggerId: number,
      fileId: number,
      fileName: string,
    ): Promise<void> => {
      try {
        await deleteFile(bloggerId, fileId);

        toast({
          title: "Файл удален",
          description: `Файл "${fileName}" успешно удален`,
        });
      } catch (err) {
        toast({
          title: "Ошибка удаления",
          description: "Не удалось удалить файл",
          variant: "destructive",
        });
      }
    },
    [deleteFile, toast],
  );

  return {
    deleting,
    error,
    deleteFile,
    confirmDelete,
    clearError,
  };
};
