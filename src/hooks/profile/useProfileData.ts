import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getBloggerById } from "@/api/endpoints/blogger";
import { mapApiDetailBloggerToLocal } from "@/utils/api/mappers";
import { APIError } from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/utils/errorHandler";

/**
 * Преобразует YouTube ID канала в полный URL
 * 
 * @param externalId - ID канала YouTube (например, UCtGJ_XI0ZGwEmKZaj3VQITw)
 * @param username - username канала (например, Ivleeva)
 * @returns полный URL канала
 */
function convertYouTubeIdToUrl(externalId: string, username?: string): string {
  // Если externalId null или undefined, обрабатываем как пустую строку
  const safeExternalId = externalId || "";
  
  // Если это уже URL, возвращаем как есть
  if (safeExternalId.startsWith('http')) {
    return safeExternalId;
  }
  
  // Если есть username, используем его для создания URL с @handle
  if (username && username.trim()) {
    // Убираем @ если он есть в начале
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
    return `https://www.youtube.com/@${cleanUsername}`;
  }
  
  // Если externalId пустой, возвращаем пустую строку
  if (!safeExternalId || !safeExternalId.trim()) {
    return "";
  }
  
  // Если это ID канала (начинается с UC), создаем URL с ID
  if (safeExternalId.startsWith('UC')) {
    return `https://www.youtube.com/channel/${safeExternalId}`;
  }
  
  // Если это handle без @, добавляем @
  if (!safeExternalId.startsWith('@')) {
    return `https://www.youtube.com/@${safeExternalId}`;
  }
  
  // Если это handle с @, создаем URL
  return `https://www.youtube.com/${safeExternalId}`;
}

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
              profile_url: social.type === 'YOUTUBE' 
                ? convertYouTubeIdToUrl(social.externalId || "", social.username)
                : social.externalId || "",
              subscribers: parseInt(social.subscribers || "0"),
              er: social.er || 0,
              reach: parseInt(social.postCoverage || "0"),
              price: social.type === 'YOUTUBE' 
                ? parseFloat(
                    detailedBlogger.price.find((p) => p.type === social.type)
                      ?.integrationPrice || "0",
                  )
                : parseFloat(
                    detailedBlogger.price.find((p) => p.type === social.type)
                      ?.postPrice || "0",
                  ),
              storyReach: parseInt(social.coverage || "0"),
              storyPrice: parseFloat(
                detailedBlogger.price.find((p) => p.type === social.type)
                  ?.storiesPrice || "0",
              ),
              ...(platformName === "youtube" && {
                views: parseInt(social.postCoverage || "0"),
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
