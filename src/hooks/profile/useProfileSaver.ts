import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBlogger } from '@/contexts/BloggerContext';
import { updateBloggerProfile, updateBloggerSocialPrice } from '@/api/endpoints/blogger';
import { mapLocalToApiUpdate } from '@/utils/api/mappers';
import { mapProfileChangesToBloggerFields, logProfileChanges } from '@/utils/profile-update-mapper';
import { APIError } from '@/api/client';
import { useToast } from '@/hooks/use-toast';
import { useTopics } from '@/hooks/useTopics';
import type { Influencer, PlatformData } from '@/types/profile';
import type { EditData } from '@/types/profile';
import type { PlatformType } from '@/types/platform';
import { ALL_PLATFORMS, platformToApi } from '@/types/platform';

/**
 * Hook for saving profile changes
 */
export const useProfileSaver = (
  profile: Influencer | null,
  formData: EditData,
  setAvailablePlatforms: (
    fn: (prev: Record<string, PlatformData>) => Record<string, PlatformData>
  ) => void,
  topicLookup: Record<string, number>,
  updateFormData?: (data: Partial<EditData>) => void
) => {
  const { user } = useAuth();
  const { updateBloggerFields } = useBlogger();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(
    async (data: Partial<EditData>) => {
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

        // Сохранение цен платформ параллельно (вместо последовательного await)
        const platformPriceUpdates = ALL_PLATFORMS.map((platform) => {
          const postPriceKey = `${platform}_post_price` as keyof EditData;
          const storyPriceKey = `${platform}_story_price` as keyof EditData;
          const integrationPriceKey = `${platform}_integration_price` as keyof EditData;

          const postPrice = data[postPriceKey] || formData[postPriceKey];
          const storyPrice = data[storyPriceKey] || formData[storyPriceKey];
          const integrationPrice = data[integrationPriceKey] || formData[integrationPriceKey];

          if (postPrice || storyPrice || integrationPrice) {
            const priceUpdateData = {
              type: platformToApi(platform),
              postPrice: postPrice ? parseFloat(postPrice as string) : undefined,
              storiesPrice: storyPrice ? parseFloat(storyPrice as string) : undefined,
              integrationPrice: integrationPrice ? parseFloat(integrationPrice as string) : undefined,
            };

            return updateBloggerSocialPrice(Number(profile.id), priceUpdateData);
          }

          return Promise.resolve();
        });

        // Выполняем все обновления параллельно
        await Promise.all(platformPriceUpdates);

        setAvailablePlatforms((prev) => {
          const updated = { ...prev };
          ALL_PLATFORMS.forEach((platform) => {
            const postPriceKey = `${platform}_post_price` as keyof EditData;
            const storyPriceKey = `${platform}_story_price` as keyof EditData;
            const integrationPriceKey = `${platform}_integration_price` as keyof EditData;
            const postReachKey = `${platform}_post_reach` as keyof EditData;
            const storyReachKey = `${platform}_story_reach` as keyof EditData;

            const postPrice = data[postPriceKey] || formData[postPriceKey];
            const storyPrice = data[storyPriceKey] || formData[storyPriceKey];
            const integrationPrice = data[integrationPriceKey] || formData[integrationPriceKey];
            const postReach = data[postReachKey] || formData[postReachKey];
            const storyReach = data[storyReachKey] || formData[storyReachKey];

            if (updated[platform] && (postPrice || storyPrice || integrationPrice || postReach || storyReach)) {
              updated[platform] = {
                ...updated[platform],
                price: postPrice ? parseFloat(postPrice as string) : updated[platform].price,
                storyPrice: storyPrice
                  ? parseFloat(storyPrice as string)
                  : updated[platform].storyPrice,
                reach: postReach ? parseFloat(postReach as string) : updated[platform].reach,
                storyReach: storyReach ? parseFloat(storyReach as string) : updated[platform].storyReach,
                // Добавляем integrationPrice в PlatformData если нужно
                // Пока оставляем как есть, так как PlatformData может не иметь этого поля
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
          logProfileChanges(data, 'useProfileSaver');
          const bloggerFields = mapProfileChangesToBloggerFields(data);
          
          if (Object.keys(bloggerFields).length > 0) {
            updateBloggerFields(bloggerFields);
          } else {
          }
        } catch (updateError) {
          // Не прерываем выполнение, так как основное сохранение прошло успешно
        }

        toast({
          title: 'Успешно',
          description: 'Профиль обновлен',
        });
      } catch (err: unknown) {

        if (err instanceof APIError) {
          toast({
            title: 'Ошибка API',
            description: err.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Ошибка',
            description: 'Не удалось сохранить изменения',
            variant: 'destructive',
          });
        }
      } finally {
        setSaving(false);
      }
    },
    [user, profile, formData, setAvailablePlatforms, topicLookup, updateBloggerFields, updateFormData]
  );

  return {
    saving,
    handleSave,
  };
};
