import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { APIError } from "@/api/client";
import { getBloggerById } from "@/api/endpoints/blogger";
import { logError } from "@/utils/logger";
import type { Screenshot } from "@/types/profile";

/**
 * Хук для загрузки скриншотов
 */
export const useScreenshotLoader = (
  profileId?: string,
  platform: string = "instagram",
  isEditorPage: boolean = false,
) => {
  const { user } = useAuth();
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchScreenshots = useCallback(
    async (forceFetch = false) => {
      if (!profileId) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Загружаем информацию о блогере, которая включает скриншоты
        const bloggerData = await getBloggerById(Number(profileId));
        
        // Ищем скриншоты для нужной платформы
        const platformScreenshots: Screenshot[] = [];
        
        // Сначала проверяем одобренные платформы
        if (bloggerData.social) {
          for (const social of bloggerData.social) {
            if (social.type.toLowerCase() === platform.toLowerCase() && social.statsFiles) {
              // Преобразуем API формат в локальный формат Screenshot
              const platformScreenshotsData = social.statsFiles.map(file => ({
                id: file.id,
                influencer_id: Number(profileId),
                platform: social.type.toLowerCase(),
                file_name: file.name,
                file_url: file.publicUrl,
                file_size: file.size * 1024, // Конвертируем KB в байты
                width: file.width,
                height: file.height,
                created_at: file.createdAt,
                is_draft: false,
              }));
              
              platformScreenshots.push(...platformScreenshotsData);
            }
          }
        }
        
        // Затем проверяем платформы на модерации (socialMediaDrafts)
        if (bloggerData.socialMediaDrafts) {
          for (const socialDraft of bloggerData.socialMediaDrafts) {
            if (socialDraft.type.toLowerCase() === platform.toLowerCase() && socialDraft.statsFiles) {
              // Преобразуем API формат в локальный формат Screenshot
              const platformScreenshotsData = socialDraft.statsFiles.map(file => ({
                id: file.id,
                influencer_id: Number(profileId),
                platform: socialDraft.type.toLowerCase(),
                file_name: file.name,
                file_url: file.publicUrl,
                file_size: file.size * 1024, // Конвертируем KB в байты
                width: file.width,
                height: file.height,
                created_at: file.createdAt,
                is_draft: false,
              }));
              
              platformScreenshots.push(...platformScreenshotsData);
            }
          }
        }

        setScreenshots(platformScreenshots);
      } catch (error: unknown) {
        logError("Error fetching screenshots:", error);

        if (error instanceof APIError) {
          setError(error.message);
        } else {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to fetch screenshots",
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [profileId, platform, isEditorPage],
  );

  useEffect(() => {
    if (profileId) {
      fetchScreenshots();
    }
  }, [profileId, platform]);

  return {
    screenshots,
    loading,
    error,
    fetchScreenshots,
    setScreenshots,
  };
};
