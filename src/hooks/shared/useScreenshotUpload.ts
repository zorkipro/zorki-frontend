import { logError } from '@/utils/logger';

interface UseScreenshotUploadProps {
  uploadScreenshot: (file: File, userId: string) => Promise<void>;
  uploadMultipleScreenshots: (files: File[], userId: string) => Promise<void>;
}

interface UseScreenshotUploadReturn {
  handleScreenshotUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

/**
 * Переиспользуемый хук для обработки загрузки скриншотов
 * Используется в ProfileEditor и AdminBloggerEditor
 */
export const useScreenshotUpload = ({
  uploadScreenshot,
  uploadMultipleScreenshots,
}: UseScreenshotUploadProps): UseScreenshotUploadReturn => {
  const handleScreenshotUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) {
      logError('No files selected for upload');
      return;
    }

    // Получаем userId из контекста или пропсов
    // В реальном использовании это должно передаваться как параметр
    const userId = 'current-user-id'; // Это должно быть получено из контекста

    if (!userId) {
      logError('Missing userId for screenshot upload');
      return;
    }

    try {
      // Convert FileList to Array
      const fileArray = Array.from(files);

      if (fileArray.length === 1) {
        // Single file upload
        await uploadScreenshot(fileArray[0], userId);
      } else {
        // Multiple files upload
        await uploadMultipleScreenshots(fileArray, userId);
      }
    } catch (error) {
      logError('Error uploading screenshots:', error);
      // Error handling is done in the upload functions
    } finally {
      // Clear the input
      event.target.value = '';
    }
  };

  return {
    handleScreenshotUpload,
  };
};
