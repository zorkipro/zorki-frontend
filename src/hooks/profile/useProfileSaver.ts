import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBlogger } from "@/contexts/BloggerContext";
import { updateBloggerProfile, updateBloggerSocialPrice } from "@/api/endpoints/blogger";
import { mapLocalToApiUpdate } from "@/utils/api/mappers";
import { mapProfileChangesToBloggerFields } from "@/utils/profile-update-mapper";
import { APIError } from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import { getPlatformPrices, getPlatformField, safeParseFloatOrUndefined, safeParseFloat } from "@/utils/platform-field-helpers";
import type { Influencer, PlatformData } from "@/types/profile";
import type { EditData } from "@/types/profile";
import { ALL_PLATFORMS, platformToApi } from "@/types/platform";

export const useProfileSaver = (
  profile: Influencer | null,
  formData: EditData,
  setAvailablePlatforms: (
    fn: (prev: Record<string, PlatformData>) => Record<string, PlatformData>,
  ) => void,
  topicLookup: Record<string, number>,
  updateFormData?: (data: Partial<EditData>) => void,
  refetch?: () => Promise<void>,
  loadProfileWithDrafts?: () => Promise<EditData | null>,
  setFormData?: (data: EditData) => void,
) => {
  const { user } = useAuth();
  const { updateBloggerFields } = useBlogger();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const savePlatformPrices = useCallback(
    async (data: Partial<EditData>, profileId: number) => {
      for (const platform of ALL_PLATFORMS) {
        const { postPrice, storyPrice, integrationPrice } = getPlatformPrices(data, platform);
        if (!postPrice && !storyPrice && !integrationPrice) continue;

        const priceUpdateData: any = { type: platformToApi(platform) };
        if (postPrice !== undefined) priceUpdateData.postPrice = safeParseFloatOrUndefined(String(postPrice));
        if (storyPrice !== undefined && platform === 'instagram') {
          priceUpdateData.storiesPrice = safeParseFloatOrUndefined(String(storyPrice));
        }
        if (integrationPrice !== undefined) {
          priceUpdateData.integrationPrice = safeParseFloatOrUndefined(String(integrationPrice));
        }

        if (priceUpdateData.postPrice ?? priceUpdateData.storiesPrice ?? priceUpdateData.integrationPrice) {
          await updateBloggerSocialPrice(profileId, priceUpdateData);
        }
      }
    },
    [],
  );

  const updatePlatformsState = useCallback(
    (data: Partial<EditData>, prev: Record<string, PlatformData>) => {
      const getValue = (key: keyof EditData) => data[key] ?? formData[key];
      const result = { ...prev };
      
      ALL_PLATFORMS.forEach((platform) => {
        if (!prev[platform]) return;

        const update: Partial<PlatformData> = {};
        const postPrice = getValue(getPlatformField(platform, "post_price"));
        const storyPrice = getValue(getPlatformField(platform, "story_price"));
        const integrationPrice = getValue(getPlatformField(platform, "integration_price"));
        const postReach = getValue(getPlatformField(platform, "post_reach"));
        const storyReach = getValue(getPlatformField(platform, "story_reach"));

        if (postPrice !== undefined) update.price = safeParseFloat(String(postPrice), prev[platform].price);
        if (storyPrice !== undefined) update.storyPrice = safeParseFloat(String(storyPrice), prev[platform].storyPrice);
        if (integrationPrice !== undefined) update.integrationPrice = safeParseFloat(String(integrationPrice), prev[platform].integrationPrice);
        if (postReach !== undefined) update.reach = safeParseFloat(String(postReach), prev[platform].reach);
        if (storyReach !== undefined) update.storyReach = safeParseFloat(String(storyReach), prev[platform].storyReach);

        if (Object.keys(update).length > 0) {
          result[platform] = { ...prev[platform], ...update };
        }
      });

      return result;
    },
    [formData],
  );

  const handleSave = useCallback(
    async (data: Partial<EditData>) => {
      if (!user || !profile) return;

      try {
        setSaving(true);

        const profileUpdateData = mapLocalToApiUpdate({ ...formData, ...data }, topicLookup);
        await updateBloggerProfile(Number(profile.id), profileUpdateData);

        await savePlatformPrices(data, Number(profile.id));
        setAvailablePlatforms((prev) => updatePlatformsState(data, prev));

        const bloggerFields = mapProfileChangesToBloggerFields(data);
        if (Object.keys(bloggerFields).length > 0) {
          updateBloggerFields(bloggerFields);
        }

        // Обновляем только измененные данные локально, без полной перезагрузки страницы
        // Это обеспечивает точечное обновление только измененных компонентов
        updateFormData?.(data);
        
        toast({ title: "Успешно", description: "Профиль обновлен" });
        
        // Примечание: refetch убран для избежания полной перезагрузки страницы
        // Данные уже обновлены локально через updateFormData, updateBloggerFields и setAvailablePlatforms
        // При необходимости синхронизации с сервером refetch можно вызвать вручную отдельно
      } catch (err: unknown) {
        const message = err instanceof APIError ? err.message : "Не удалось сохранить изменения";
        toast({
          title: "Ошибка",
          description: message,
          variant: "destructive",
        });
      } finally {
        setSaving(false);
      }
    },
    [user, profile, formData, topicLookup, savePlatformPrices, updatePlatformsState, setAvailablePlatforms, updateBloggerFields, toast, updateFormData],
  );

  return {
    saving,
    handleSave,
  };
};
