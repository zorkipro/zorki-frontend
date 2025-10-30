/**
 * Хук для загрузки данных профиля блогера
 *
 * Отвечает за:
 * - Загрузку основных данных профиля
 * - Загрузку тем (topics) и запрещенных тем (banned_topics)
 * - Загрузку черновиков (drafts)
 * - Объединение данных из разных источников
 *
 * Следует принципу Single Responsibility - только загрузка данных.
 */

import { useState, useCallback } from "react";
import { getBloggerById } from "@/api/endpoints/blogger";
import { mapApiDetailBloggerToLocal } from "@/utils/api/mappers";
import type { Influencer, PlatformData, EditData } from "@/types/profile";
import { useProfileData } from "./useProfileData";
import { useProfileDrafts } from "./useProfileDrafts";
import { ALL_PLATFORMS } from "@/types/platform";

interface LoaderState {
  /** Данные профиля */
  profile: Influencer | null;
  /** Доступные платформы */
  availablePlatforms: Record<string, PlatformData> | null;
  /** Темы блогера */
  topics: number[];
  /** Запрещенные темы */
  bannedTopics: number[];
  /** Флаг загрузки */
  loading: boolean;
  /** Ошибка загрузки */
  error: string | null;
}

export interface ProfileLoaderReturn extends LoaderState {
  /** Обновить данные профиля */
  refetch: () => Promise<void>;
  /** Загрузить данные профиля и черновиков */
  loadProfileWithDrafts: () => Promise<EditData | null>;
  /** Обновить профиль локально */
  setProfile: (profile: Influencer | null) => void;
  /** Обновить платформы локально */
  setAvailablePlatforms: (
    platforms:
      | Record<string, PlatformData>
      | ((prev: Record<string, PlatformData>) => Record<string, PlatformData>),
  ) => void;
  /** Есть ли черновики */
  hasDrafts: boolean;
}

/**
 * Хук для загрузки данных профиля блогера
 *
 * @example
 * const { profile, loading, loadProfileWithDrafts } = useProfileLoader();
 *
 * useEffect(() => {
 *   const data = await loadProfileWithDrafts();
 *   if (data) setFormData(data);
 * }, []);
 */
export const useProfileLoader = (): ProfileLoaderReturn => {
  const {
    profile,
    rawApiResponse,
    loading: dataLoading,
    error,
    availablePlatforms,
    setProfile,
    setAvailablePlatforms,
    fetchProfile: fetchProfileData,
  } = useProfileData();

  const { hasDrafts, loadDrafts } = useProfileDrafts(profile?.id);

  const [topics, setTopics] = useState<number[]>([]);
  const [bannedTopics, setBannedTopics] = useState<number[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);

  /**
   * Загружает темы и запрещенные темы блогера через API
   */
  const loadTopics = useCallback(
    async (
      profileId: string,
    ): Promise<{ topics: number[]; bannedTopics: number[] }> => {
      setLoadingTopics(true);

      try {
        const endTimer = () => {};

        // Загружаем профиль через API, который содержит актуальные темы
        const apiProfile = await getBloggerById(Number(profileId));
        const localProfile = mapApiDetailBloggerToLocal(apiProfile);

        // Получаем темы из профиля (они уже в правильном формате)
        // ПРИОРИТЕТ ЧЕРНОВИКАМ: если есть черновик профиля, используем тематики из него
        const profileDraft = apiProfile.profileDraft;
        const loadedTopics = profileDraft?.topics?.map(t => t.id) || localProfile.topics || [];
        const loadedBannedTopics = profileDraft?.restrictedTopics?.map(t => t.id) || localProfile.restrictedTopics || [];

        setTopics(loadedTopics);
        setBannedTopics(loadedBannedTopics);

        endTimer();

        return { topics: loadedTopics, bannedTopics: loadedBannedTopics };
      } catch (err) {
        return { topics: [], bannedTopics: [] };
      } finally {
        setLoadingTopics(false);
      }
    },
    [],
  );

  /**
   * Преобразует данные профиля и платформ в формат EditData
   */
  const convertToEditData = useCallback(
    (
      profile: Influencer,
      platforms: Record<string, PlatformData>,
      topics: number[],
      bannedTopics: number[],
    ): EditData => {
      const editData: EditData = {
        full_name: profile.name || "",
        description: profile.promoText || "",
        avatar_url: profile.avatar || "",
        contact_link: profile.contact_url || "",
        work_format: profile.workFormat || "",
        gender_type: profile.gender || "",
        barter_available: profile.allowsBarter ?? false,
        mart_registry: profile.inMartRegistry ?? false,
        cooperation_conditions: profile.cooperationConditions || "",
        topics,
        banned_topics: bannedTopics,
      } as EditData;

      // Добавляем данные платформ
      ALL_PLATFORMS.forEach((platform) => {
        const platformData = platforms[platform];
        if (platformData) {
          editData[`${platform}_username`] = platformData.username || "";
          editData[`${platform}_profile_url`] = platformData.profile_url || "";
          editData[`${platform}_followers`] =
            platformData.subscribers?.toString() || "";
          editData[`${platform}_engagement_rate`] =
            platformData.er?.toString() || "";
          editData[`${platform}_post_reach`] =
            platformData.reach?.toString() || "";
          editData[`${platform}_story_reach`] =
            platformData.storyReach?.toString() || "";
          editData[`${platform}_post_price`] =
            platformData.price?.toString() || "";
          editData[`${platform}_story_price`] =
            platformData.storyPrice?.toString() || "";
          editData[`${platform}_integration_price`] =
            platformData.price?.toString() || "";
        }
      });

      return editData;
    },
    [],
  );

  /**
   * Загружает профиль и возвращает данные с учетом черновиков
   * Основная функция для инициализации формы редактирования
   */
  const loadProfileWithDrafts =
    useCallback(async (): Promise<EditData | null> => {
      if (!profile || !availablePlatforms) {
        await fetchProfileData();
      }

      if (!profile || !availablePlatforms || !rawApiResponse) {
        return null;
      }

      // Загружаем темы
      const { topics: loadedTopics, bannedTopics: loadedBannedTopics } =
        await loadTopics(profile.id);

      // Пытаемся загрузить черновики
      const draftFormData = await loadDrafts(
        rawApiResponse!,
        availablePlatforms,
        loadedTopics,
        loadedBannedTopics,
      );

      if (draftFormData) {
        return draftFormData;
      }

      // Нет черновиков - используем опубликованные данные

      return convertToEditData(
        profile,
        availablePlatforms,
        loadedTopics,
        loadedBannedTopics,
      );
    }, [
      profile,
      rawApiResponse,
      availablePlatforms,
      fetchProfileData,
      loadTopics,
      loadDrafts,
      convertToEditData,
    ]);

  /**
   * Обновляет данные профиля
   */
  const refetch = useCallback(async () => {
    await fetchProfileData();

    if (profile) {
      await loadTopics(profile.id);
    }
  }, [fetchProfileData, loadTopics, profile]);

  return {
    profile,
    availablePlatforms,
    topics,
    bannedTopics,
    loading: dataLoading || loadingTopics,
    error,
    refetch,
    loadProfileWithDrafts,
    setProfile,
    setAvailablePlatforms,
    hasDrafts,
  };
};
