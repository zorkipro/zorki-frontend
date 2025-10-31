import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getBloggerById } from "@/api/endpoints/blogger";
import { mapApiDetailBloggerToLocal } from "@/utils/api/mappers";
import { APIError } from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/utils/errorHandler";
import type { PublicGetBloggerByIdOutputDto } from "@/api/types";

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
  const { user, bloggerInfo, lastLinkRequest, bloggerInfoLoading } = useAuth();
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
  const [rawApiResponse, setRawApiResponse] = useState<PublicGetBloggerByIdOutputDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [availablePlatforms, setAvailablePlatforms] = useState<
    Record<string, any>
  >({});

  // Отслеживаем предыдущий bloggerId для предотвращения лишних запросов
  const previousBloggerIdRef = useRef<string | number | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError("");

      // Определяем ID блогера: сначала из bloggerInfo, потом из lastLinkRequest
      const bloggerId = bloggerInfo?.id || lastLinkRequest?.bloggerId;
      
      
      if (bloggerId) {
        const detailedBlogger = await getBloggerById(bloggerId);

        // Сохраняем сырой API ответ для черновиков
        setRawApiResponse(detailedBlogger);

        // ПРИОРИТЕТ ЧЕРНОВИКАМ: если есть profileDraft, используем его данные
        const profileDraft = detailedBlogger.profileDraft;
        const mergedBloggerData = {
          ...detailedBlogger,
          // Переопределяем поля черновиками если они есть (не null)
          name: profileDraft?.name !== null && profileDraft?.name !== undefined
            ? profileDraft.name
            : detailedBlogger.name,
          lastName: profileDraft?.lastName !== null && profileDraft?.lastName !== undefined
            ? profileDraft.lastName
            : detailedBlogger.lastName,
          description: profileDraft?.description !== null && profileDraft?.description !== undefined
            ? profileDraft.description
            : detailedBlogger.description,
          contactLink: profileDraft?.contactLink !== null && profileDraft?.contactLink !== undefined
            ? profileDraft.contactLink
            : detailedBlogger.contactLink,
          workFormat: profileDraft?.workFormat !== null && profileDraft?.workFormat !== undefined
            ? profileDraft.workFormat
            : detailedBlogger.workFormat,
          genderType: profileDraft?.genderType !== null && profileDraft?.genderType !== undefined
            ? profileDraft.genderType
            : detailedBlogger.genderType,
          isBarterAvailable: profileDraft?.isBarterAvailable !== null && profileDraft?.isBarterAvailable !== undefined
            ? profileDraft.isBarterAvailable
            : detailedBlogger.isBarterAvailable,
          isMartRegistry: profileDraft?.isMartRegistry !== null && profileDraft?.isMartRegistry !== undefined
            ? profileDraft.isMartRegistry
            : detailedBlogger.isMartRegistry,
          topics: profileDraft?.topics !== null && profileDraft?.topics !== undefined
            ? profileDraft.topics
            : detailedBlogger.topics,
          restrictedTopics: profileDraft?.restrictedTopics !== null && profileDraft?.restrictedTopics !== undefined
            ? profileDraft.restrictedTopics
            : detailedBlogger.restrictedTopics,
        };

        const transformedBlogger = mapApiDetailBloggerToLocal(mergedBloggerData);

        setProfile(transformedBlogger);

        // Преобразуем платформы в нужный формат
        // ПРИОРИТЕТ ЧЕРНОВИКАМ: сначала проверяем priceDraft, потом основные данные
        const platformsData: Record<string, any> = {};
        
        // Сначала добавляем основные платформы (одобренные)
        if (detailedBlogger.social) {
          detailedBlogger.social.forEach((social) => {
            const platformName = social.type.toLowerCase();
            
            // Ищем черновик цены для этой платформы
            const priceDraft = detailedBlogger.priceDraft?.find((p) => p.type === social.type);
            const mainPrice = detailedBlogger.price.find((p) => p.type === social.type);
            
            platformsData[platformName] = {
              username: social.username || "",
              profile_url: social.type === 'YOUTUBE' 
                ? convertYouTubeIdToUrl(social.externalId || "", social.username)
                : social.externalId || "",
              subscribers: parseInt(social.subscribers || "0"),
              er: social.er || 0,
              reach: parseInt(social.postCoverage || "0"),
              
              // ПРИОРИТЕТ ЧЕРНОВИКАМ: если в черновике есть значение (не null), используем его
              price: priceDraft?.postPrice !== null && priceDraft?.postPrice !== undefined
                ? parseFloat(priceDraft.postPrice)
                : (social.type === 'YOUTUBE' 
                  ? parseFloat(mainPrice?.integrationPrice || "0")
                  : parseFloat(mainPrice?.postPrice || "0")),
              
              storyReach: parseInt(social.coverage || "0"),
              
              storyPrice: priceDraft?.storiesPrice !== null && priceDraft?.storiesPrice !== undefined
                ? parseFloat(priceDraft.storiesPrice)
                : parseFloat(mainPrice?.storiesPrice || "0"),
              
              integrationPrice: priceDraft?.integrationPrice !== null && priceDraft?.integrationPrice !== undefined
                ? parseFloat(priceDraft.integrationPrice)
                : parseFloat(mainPrice?.integrationPrice || "0"),
              
              // Добавляем скриншоты из statsFiles
              screenshots: social.statsFiles?.map(file => ({
                id: file.id,
                influencer_id: detailedBlogger.id,
                platform: social.type.toLowerCase(),
                file_name: file.name,
                file_url: file.publicUrl,
                file_size: file.size * 1024, // Конвертируем KB в байты
                width: file.width,
                height: file.height,
                created_at: file.createdAt,
                is_draft: false,
              })) || [],
              
              ...(platformName === "youtube" && {
                views: parseInt(social.postCoverage || "0"),
              }),
            };
          });
        }
        
        // Затем добавляем платформы на модерации (socialMediaDrafts)
        if (detailedBlogger.socialMediaDrafts) {
          detailedBlogger.socialMediaDrafts.forEach((socialDraft) => {
            const platformName = socialDraft.type.toLowerCase();
            
            // Проверяем, есть ли уже одобренная платформа этого типа
            if (!platformsData[platformName]) {
              // Ищем черновик цены для этой платформы
              const priceDraft = detailedBlogger.priceDraft?.find((p) => p.type === socialDraft.type);
              const mainPrice = detailedBlogger.price.find((p) => p.type === socialDraft.type);
              
              platformsData[platformName] = {
                username: socialDraft.username || "",
                profile_url: socialDraft.type === 'YOUTUBE' 
                  ? convertYouTubeIdToUrl(socialDraft.externalId || "", socialDraft.username)
                  : socialDraft.externalId || "",
                subscribers: parseInt(socialDraft.subscribers || "0"),
                er: socialDraft.er || 0,
                reach: parseInt(socialDraft.postCoverage || "0"),
                
                // ПРИОРИТЕТ ЧЕРНОВИКАМ: если в черновике есть значение (не null), используем его
                price: priceDraft?.postPrice !== null && priceDraft?.postPrice !== undefined
                  ? parseFloat(priceDraft.postPrice)
                  : (socialDraft.type === 'YOUTUBE' 
                    ? parseFloat(mainPrice?.integrationPrice || "0")
                    : parseFloat(mainPrice?.postPrice || "0")),
                
                storyReach: parseInt(socialDraft.coverage || "0"),
                
                storyPrice: priceDraft?.storiesPrice !== null && priceDraft?.storiesPrice !== undefined
                  ? parseFloat(priceDraft.storiesPrice)
                  : parseFloat(mainPrice?.storiesPrice || "0"),
                
                integrationPrice: priceDraft?.integrationPrice !== null && priceDraft?.integrationPrice !== undefined
                  ? parseFloat(priceDraft.integrationPrice)
                  : parseFloat(mainPrice?.integrationPrice || "0"),
                
                // Добавляем скриншоты из statsFiles для платформ на модерации
                screenshots: socialDraft.statsFiles?.map(file => ({
                  id: file.id,
                  influencer_id: detailedBlogger.id,
                  platform: socialDraft.type.toLowerCase(),
                  file_name: file.name,
                  file_url: file.publicUrl,
                  file_size: file.size * 1024, // Конвертируем KB в байты
                  width: file.width,
                  height: file.height,
                  created_at: file.createdAt,
                  is_draft: false,
                })) || [],
                
                // Флаг "на модерации" для платформ из socialMediaDrafts
                isPending: true,
                
                ...(platformName === "youtube" && {
                  views: parseInt(socialDraft.postCoverage || "0"),
                }),
              };
            }
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
  }, [user, bloggerInfo, lastLinkRequest, handleError]);

  // Автоматически загружаем профиль при изменении bloggerInfo или lastLinkRequest
  // Используем useRef для отслеживания предыдущего bloggerId, чтобы избежать лишних запросов
  useEffect(() => {
    const bloggerId = bloggerInfo?.id || lastLinkRequest?.bloggerId;
    const currentBloggerId = bloggerId ?? null;
    
    // Загружаем только если:
    // 1. Есть пользователь
    // 2. Есть bloggerId
    // 3. Не идет загрузка
    // 4. bloggerId изменился (предотвращаем дублирование)
    if (user && currentBloggerId && !bloggerInfoLoading && previousBloggerIdRef.current !== currentBloggerId) {
      previousBloggerIdRef.current = currentBloggerId;
      fetchProfile();
    } else if (!currentBloggerId) {
      // Сбрасываем ref если bloggerId стал null
      previousBloggerIdRef.current = null;
    }
  }, [user, bloggerInfo, lastLinkRequest, bloggerInfoLoading, fetchProfile]);

  return {
    profile,
    rawApiResponse,
    loading,
    error,
    availablePlatforms,
    setProfile,
    setAvailablePlatforms,
    fetchProfile,
  };
};
