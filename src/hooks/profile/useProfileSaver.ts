import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBlogger } from "@/contexts/BloggerContext";
import {
  updateBloggerProfile,
  updateBloggerSocialPrice,
} from "@/api/endpoints/blogger";
import { mapLocalToApiUpdate } from "@/utils/api/mappers";
import {
  mapProfileChangesToBloggerFields,
  logProfileChanges,
} from "@/utils/profile-update-mapper";
import { APIError } from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import { useTopics } from "@/hooks/useTopics";
import type { Influencer, PlatformData } from "@/types/profile";
import type { EditData } from "@/types/profile";
import type { PlatformType } from "@/types/platform";
import { ALL_PLATFORMS, platformToApi } from "@/types/platform";


/**
 * Hook for saving profile changes
 */
export const useProfileSaver = (
  profile: Influencer | null,
  formData: EditData,
  setAvailablePlatforms: (
    fn: (prev: Record<string, PlatformData>) => Record<string, PlatformData>,
  ) => void,
  topicLookup: Record<string, number>,
  updateFormData?: (data: Partial<EditData>) => void,
) => {
  const { user } = useAuth();
  const { updateBloggerFields } = useBlogger();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(
    async (data: Partial<EditData>) => {
      console.log('🚀 handleSave called with data:', data);
      
      if (!user || !profile) return;

      try {
        setSaving(true);

        // Используем mapLocalToApiUpdate для корректного преобразования данных
        const mergedData = { ...formData, ...data };
        const profileUpdateData = mapLocalToApiUpdate(mergedData, topicLookup);

        // Убедиться, что topics и restrictedTopics всегда есть (required поля)
        if (!profileUpdateData.topics) {
          profileUpdateData.topics = [];
        }
        if (!profileUpdateData.restrictedTopics) {
          profileUpdateData.restrictedTopics = [];
        }

        await updateBloggerProfile(Number(profile.id), profileUpdateData);

        // Сохранение цен платформ последовательно (чтобы избежать deadlock)
        console.log('🔄 Processing platforms:', ALL_PLATFORMS);
        console.log('📊 Current data:', data);
        console.log('📊 Current formData:', formData);
        
        // Фильтруем только платформы с изменениями (как в админке)
        const platformsWithChanges = ALL_PLATFORMS.filter((platform) => {
          const postPriceKey = `${platform}_post_price` as keyof EditData;
          const storyPriceKey = `${platform}_story_price` as keyof EditData;
          const integrationPriceKey = `${platform}_integration_price` as keyof EditData;

          // Проверяем ТОЛЬКО data (новые изменения), не formData
          return data[postPriceKey] !== undefined || 
                 data[storyPriceKey] !== undefined || 
                 data[integrationPriceKey] !== undefined;
        });

        console.log('🎯 Platforms with changes:', platformsWithChanges);
        
        const platformPriceUpdates = platformsWithChanges.map((platform) => {
          console.log(`🔍 Processing platform: ${platform}`);
          
          const postPriceKey = `${platform}_post_price` as keyof EditData;
          const storyPriceKey = `${platform}_story_price` as keyof EditData;
          const integrationPriceKey =
            `${platform}_integration_price` as keyof EditData;

          // Берем значения ТОЛЬКО из data (новые изменения), как в админке
          const postPrice = data[postPriceKey];
          const storyPrice = data[storyPriceKey];
          const integrationPrice = data[integrationPriceKey];

          console.log(`🔍 Platform ${platform} prices:`, {
            postPrice,
            storyPrice,
            integrationPrice,
            postPriceKey,
            storyPriceKey,
            integrationPriceKey,
            dataHasPostPrice: data[postPriceKey],
            dataHasStoryPrice: data[storyPriceKey],
            dataHasIntegrationPrice: data[integrationPriceKey],
            formDataHasPostPrice: formData[postPriceKey],
            formDataHasStoryPrice: formData[storyPriceKey],
            formDataHasIntegrationPrice: formData[integrationPriceKey]
          });

          if (postPrice || storyPrice || integrationPrice) {
            const priceUpdateData: any = {
              type: platformToApi(platform),
            };

            // Используем логику как в админке: проверяем !== undefined
            if (postPrice !== undefined) {
              priceUpdateData.postPrice = parseFloat(String(postPrice)) || undefined;
            }
            // Для YouTube не передаем storiesPrice, так как YouTube не имеет сторис
            if (storyPrice !== undefined && platform !== 'youtube') {
              priceUpdateData.storiesPrice = parseFloat(String(storyPrice)) || undefined;
            }
            if (integrationPrice !== undefined) {
              priceUpdateData.integrationPrice = parseFloat(String(integrationPrice)) || undefined;
            }

            // Проверяем, что есть хотя бы одно валидное значение для отправки
            const hasValidData = priceUpdateData.postPrice !== undefined || 
                               priceUpdateData.storiesPrice !== undefined || 
                               priceUpdateData.integrationPrice !== undefined;

            if (!hasValidData) {
              console.log(`⚠️ No valid price data for ${platform}, skipping update`);
              return Promise.resolve();
            }

            console.log('💰 Updating social price:', {
              bloggerId: Number(profile.id),
              platform: platform,
              priceUpdateData
            });

            return updateBloggerSocialPrice(
              Number(profile.id),
              priceUpdateData,
            );
          }

          return Promise.resolve();
        });

        // Выполняем обновления последовательно (как в админке)
        console.log('⏳ Executing platform price updates sequentially...');
        for (const updatePromise of platformPriceUpdates) {
          await updatePromise;
        }
        console.log('✅ Platform price updates completed');

        setAvailablePlatforms((prev) => {
          const updated = { ...prev };
          ALL_PLATFORMS.forEach((platform) => {
            const postPriceKey = `${platform}_post_price` as keyof EditData;
            const storyPriceKey = `${platform}_story_price` as keyof EditData;
            const integrationPriceKey =
              `${platform}_integration_price` as keyof EditData;
            const postReachKey = `${platform}_post_reach` as keyof EditData;
            const storyReachKey = `${platform}_story_reach` as keyof EditData;

            // Для обновления состояния используем новые значения из data, если есть, иначе старые из formData
            const postPrice = data[postPriceKey] !== undefined ? data[postPriceKey] : formData[postPriceKey];
            const storyPrice = data[storyPriceKey] !== undefined ? data[storyPriceKey] : formData[storyPriceKey];
            const integrationPrice = data[integrationPriceKey] !== undefined ? data[integrationPriceKey] : formData[integrationPriceKey];
            const postReach = data[postReachKey] !== undefined ? data[postReachKey] : formData[postReachKey];
            const storyReach = data[storyReachKey] !== undefined ? data[storyReachKey] : formData[storyReachKey];

            if (
              updated[platform] &&
              (postPrice ||
                storyPrice ||
                integrationPrice ||
                postReach ||
                storyReach)
            ) {
              updated[platform] = {
                ...updated[platform],
                price: postPrice
                  ? parseFloat(postPrice as string)
                  : updated[platform].price,
                storyPrice: storyPrice
                  ? parseFloat(storyPrice as string)
                  : updated[platform].storyPrice,
                integrationPrice: integrationPrice
                  ? parseFloat(integrationPrice as string)
                  : updated[platform].integrationPrice,
                reach: postReach
                  ? parseFloat(postReach as string)
                  : updated[platform].reach,
                storyReach: storyReach
                  ? parseFloat(storyReach as string)
                  : updated[platform].storyReach,
              };
            }
          });
          return updated;
        });

        // Обновляем локальное состояние formData для немедленного отображения изменений
        if (updateFormData) {
          updateFormData(data);
        }

        // Селективно обновляем только измененные поля в BloggerContext
        try {
          logProfileChanges(data, "useProfileSaver");
          const bloggerFields = mapProfileChangesToBloggerFields(data);

          if (Object.keys(bloggerFields).length > 0) {
            updateBloggerFields(bloggerFields);
          } else {
          }
        } catch (updateError) {
          // Не прерываем выполнение, так как основное сохранение прошло успешно
        }

        toast({
          title: "Успешно",
          description: "Профиль обновлен",
        });
      } catch (err: unknown) {
        if (err instanceof APIError) {
          toast({
            title: "Ошибка API",
            description: err.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Ошибка",
            description: "Не удалось сохранить изменения",
            variant: "destructive",
          });
        }
      } finally {
        setSaving(false);
      }
    },
    [
      user,
      profile,
      formData,
      setAvailablePlatforms,
      topicLookup,
      updateBloggerFields,
      updateFormData,
    ],
  );

  return {
    saving,
    handleSave,
  };
};
