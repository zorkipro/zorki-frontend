import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getBloggerById } from "@/api/endpoints/blogger";
import { mapApiDetailBloggerToLocal } from "@/utils/api/mappers";
import { APIError } from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/utils/errorHandler";

/**
 * Hook for loading blogger profile data
 */
export const useProfileData = () => {
  const { user, bloggerInfo, bloggerInfoLoading } = useAuth();
  const { toast } = useToast();
  const { handleError } = useErrorHandler({
    showToast: (message: string, type?: "error" | "warning" | "info") => {
      toast({
        title:
          type === "error"
            ? "Ошибка"
            : type === "warning"
              ? "Предупреждение"
              : "Информация",
        description: message,
        variant: type === "error" ? "destructive" : "default",
      });
    },
    showNotifications: true,
  });
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [availablePlatforms, setAvailablePlatforms] = useState<
    Record<string, any>
  >({});

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError("");

      // Используем данные из AuthContext вместо отдельного запроса
      if (bloggerInfo) {
        const detailedBlogger = await getBloggerById(bloggerInfo.id);

        const transformedBlogger = mapApiDetailBloggerToLocal(detailedBlogger);

        setProfile(transformedBlogger);

        // Преобразуем платформы в нужный формат
        const platformsData: Record<string, any> = {};
        if (detailedBlogger.social) {
          detailedBlogger.social.forEach((social) => {
            const platformName = social.type.toLowerCase();
            platformsData[platformName] = {
              username: social.username || "",
              profile_url: social.externalId || "",
              subscribers: parseInt(social.subscribers || "0"),
              er: social.er || 0,
              reach: parseInt(social.coverage || "0"),
              price: parseFloat(
                detailedBlogger.price.find((p) => p.type === social.type)
                  ?.postPrice || "0",
              ),
              storyReach: 0,
              storyPrice: parseFloat(
                detailedBlogger.price.find((p) => p.type === social.type)
                  ?.storiesPrice || "0",
              ),
              ...(platformName === "youtube" && {
                views: parseInt(social.totalViews || "0"),
              }),
            };
          });
        }

        setAvailablePlatforms(platformsData);
      } else {
        // Пользователь не связан с блогером
        setError(
          "Профиль не найден. Используйте страницу настройки профиля для создания.",
        );
      }
    } catch (err: unknown) {
      // Используем универсальный обработчик ошибок (он уже логирует)
      const processedError = handleError(err, {
        showNotification: true,
        logError: true,
      });

      setError(processedError.message);
    } finally {
      setLoading(false);
    }
  }, [user, bloggerInfo, handleError]);

  // Автоматически загружаем профиль при изменении bloggerInfo
  useEffect(() => {
    if (user && bloggerInfo && !bloggerInfoLoading) {
      fetchProfile();
    }
  }, [user, bloggerInfo, bloggerInfoLoading, fetchProfile]);

  // Дополнительно обновляем профиль при изменении ID блогера
  useEffect(() => {
    if (user && bloggerInfo?.id && !bloggerInfoLoading) {
      fetchProfile();
    }
  }, [user, bloggerInfo?.id, bloggerInfoLoading, fetchProfile]);

  return {
    profile,
    loading,
    error,
    availablePlatforms,
    setProfile,
    setAvailablePlatforms,
    fetchProfile,
  };
};
