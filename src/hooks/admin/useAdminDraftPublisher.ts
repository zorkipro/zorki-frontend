import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { APIError } from "@/api/client";
import { useAdminBloggerActions } from "./useAdminBloggerActions";
import { logger } from "@/utils/logger";

export const useAdminDraftPublisher = (onUpdate: () => void) => {
  const { toast } = useToast();
  const { updateBlogger } = useAdminBloggerActions(onUpdate);

  // Публикация черновиков при верификации
  const publishDraftChanges = useCallback(async (influencerId: string) => {
    try {
      throw new Error(
        "Публикация черновиков через API пока не реализована. Обратитесь к backend разработчику для добавления POST /admin/blogger/:id/publish-drafts endpoint.",
      );
    } catch (error) {
      logError("Error publishing draft changes:", error);
      throw error;
    }
  }, []);

  const approveBlogger = useCallback(
    async (id: string) => {
      try {
        throw new Error(
          "Одобрение блогеров через API пока не реализовано. Обратитесь к backend разработчику для добавления POST /admin/blogger/:id/approve endpoint.",
        );
      } catch (error: unknown) {
        logger.error("Error approving blogger", error, {
          component: "useAdminDraftPublisher",
          influencerId,
        });

        if (error instanceof APIError) {
          toastRef.current({
            title: "Ошибка API",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toastRef.current({
            title: "Ошибка",
            description:
              error instanceof Error
                ? error.message
                : "Не удалось одобрить блогера",
            variant: "destructive",
          });
        }
        throw error;
      }
    },
    [toastRef],
  );

  const rejectBlogger = useCallback(
    async (id: string) => {
      try {
        // Method: POST
        // Auth: Required (admin-auth-jwt-schema)
        // Base URL: ${API_BASE_URL}
        //
        // Path Parameters:
        //   id: number (required)
        //
        // Request Body: AdminRejectBloggerInputDto
        //   - verificationStatus: 'REJECTED' (required)
        //   - reason?: string
        //
        // Response: AdminRejectBloggerOutputDto
        //   - id: number
        //   - verificationStatus: 'REJECTED'
        //   - reason?: string
        //   - updatedAt: string
        //
        // Implementation:
        //   import { rejectAdminBlogger } from '@/api/endpoints/admin';
        //   const result = await rejectAdminBlogger(parseInt(id), { reason: 'Не прошел модерацию' });
        //
        // Notes:
        //   - Backend endpoint НЕ РЕАЛИЗОВАН
        //   - Нужно добавить AdminBloggerController в backend
        //   - Пока показываем ошибку
        //
        // Backend: AdminBloggerController.rejectBlogger() - НЕ РЕАЛИЗОВАН
        // Prisma: Blogger model (verificationStatus field)
        // ============================================

        throw new Error(
          "Отклонение блогеров через API пока не реализовано. Обратитесь к backend разработчику для добавления POST /admin/blogger/:id/reject endpoint.",
        );
      } catch (error: unknown) {
        logger.error("Error rejecting blogger", error, {
          component: "useAdminDraftPublisher",
          influencerId,
        });

        if (error instanceof APIError) {
          toastRef.current({
            title: "Ошибка API",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toastRef.current({
            title: "Ошибка",
            description:
              error instanceof Error
                ? error.message
                : "Не удалось отклонить блогера",
            variant: "destructive",
          });
        }
        throw error;
      }
    },
    [toastRef],
  );

  return {
    publishDraftChanges,
    approveBlogger,
    rejectBlogger,
  };
};
