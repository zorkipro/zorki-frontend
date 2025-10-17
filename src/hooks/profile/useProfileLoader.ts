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

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Influencer, PlatformData, EditData } from '@/types/profile';
import { useProfileData } from './useProfileData';
import { useProfileDrafts } from './useProfileDrafts';
import { logger } from '@/utils/logger';
import { ALL_PLATFORMS } from '@/types/platform';

interface LoaderState {
  /** Данные профиля */
  profile: Influencer | null;
  /** Доступные платформы */
  availablePlatforms: Record<string, PlatformData> | null;
  /** Темы блогера */
  topics: string[];
  /** Запрещенные темы */
  bannedTopics: string[];
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
      | ((prev: Record<string, PlatformData>) => Record<string, PlatformData>)
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
    loading: dataLoading,
    error,
    availablePlatforms,
    setProfile,
    setAvailablePlatforms,
    fetchProfile: fetchProfileData,
  } = useProfileData();

  const { hasDrafts, loadDrafts } = useProfileDrafts(profile?.id);

  const [topics, setTopics] = useState<string[]>([]);
  const [bannedTopics, setBannedTopics] = useState<string[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);

  /**
   * Загружает темы и запрещенные темы блогера
   */
  const loadTopics = useCallback(
    async (profileId: string): Promise<{ topics: string[]; bannedTopics: string[] }> => {
      setLoadingTopics(true);

      try {
        const endTimer = logger.startTimer('Load topics and banned topics');

        // Параллельная загрузка тем и запрещенных тем
        const [influencerTopicsResult, influencerBannedTopicsResult] = await Promise.all([
          supabase
            .from('influencer_topics')
            .select(`topic_id, topics!inner(title)`)
            .eq('influencer_id', profileId),
          supabase
            .from('influencer_banned_topics')
            .select(`banned_topic_id, banned_topics!inner(title)`)
            .eq('influencer_id', profileId),
        ]);

        const loadedTopics =
          influencerTopicsResult.data?.map((item) => {
            const itemData = item as unknown as { topics: { title: string } };
            return itemData.topics.title;
          }) || [];

        const loadedBannedTopics =
          influencerBannedTopicsResult.data?.map((item) => {
            const itemData = item as unknown as { banned_topics: { title: string } };
            return itemData.banned_topics.title;
          }) || [];

        setTopics(loadedTopics);
        setBannedTopics(loadedBannedTopics);

        endTimer();

        logger.debug('Topics loaded', {
          component: 'useProfileLoader',
          profileId,
          topicsCount: loadedTopics.length,
          bannedTopicsCount: loadedBannedTopics.length,
        });

        return { topics: loadedTopics, bannedTopics: loadedBannedTopics };
      } catch (err) {
        logger.error('Error loading topics', err, {
          component: 'useProfileLoader',
          profileId,
        });

        return { topics: [], bannedTopics: [] };
      } finally {
        setLoadingTopics(false);
      }
    },
    []
  );

  /**
   * Преобразует данные профиля и платформ в формат EditData
   */
  const convertToEditData = useCallback(
    (
      profile: Influencer,
      platforms: Record<string, PlatformData>,
      topics: string[],
      bannedTopics: string[]
    ): EditData => {
      const editData: EditData = {
        full_name: profile.name || '',
        description: profile.promoText || '',
        avatar_url: profile.avatar || '',
        contact_link: profile.contact_url || '',
        work_format: profile.workFormat || '',
        gender_type: profile.gender || '',
        barter_available: profile.allowsBarter ?? false,
        mart_registry: profile.inMartRegistry ?? false,
        cooperation_conditions: profile.cooperationConditions || '',
        topics,
        banned_topics: bannedTopics,
      } as EditData;

      console.log('convertToEditData: Converting profile data', {
        profile_name: profile.name,
        profile_promoText: profile.promoText,
        editData_full_name: editData.full_name,
        editData_description: editData.description,
        editData: editData
      });

      // Добавляем данные платформ
      ALL_PLATFORMS.forEach((platform) => {
        const platformData = platforms[platform];
        if (platformData) {
          editData[`${platform}_username`] = platformData.username || '';
          editData[`${platform}_profile_url`] = platformData.profile_url || '';
          editData[`${platform}_followers`] = platformData.subscribers?.toString() || '';
          editData[`${platform}_engagement_rate`] = platformData.er?.toString() || '';
          editData[`${platform}_post_reach`] = platformData.reach?.toString() || '';
          editData[`${platform}_story_reach`] = platformData.storyReach?.toString() || '';
          editData[`${platform}_post_price`] = platformData.price?.toString() || '';
          editData[`${platform}_story_price`] = platformData.storyPrice?.toString() || '';
          editData[`${platform}_integration_price`] = platformData.price?.toString() || '';
        }
      });

      return editData;
    },
    []
  );

  /**
   * Загружает профиль и возвращает данные с учетом черновиков
   * Основная функция для инициализации формы редактирования
   */
  const loadProfileWithDrafts = useCallback(async (): Promise<EditData | null> => {
    if (!profile || !availablePlatforms) {
      await fetchProfileData();
    }

    if (!profile || !availablePlatforms) {
      logger.warn('Cannot load profile data - profile or platforms not available', {
        component: 'useProfileLoader',
        hasProfile: !!profile,
        hasPlatforms: !!availablePlatforms,
      });
      return null;
    }

    // Загружаем темы
    const { topics: loadedTopics, bannedTopics: loadedBannedTopics } = await loadTopics(profile.id);

    // Пытаемся загрузить черновики
    const draftFormData = await loadDrafts(
      profile,
      availablePlatforms,
      loadedTopics,
      loadedBannedTopics
    );

    if (draftFormData) {
      logger.debug('Loaded draft data', {
        component: 'useProfileLoader',
        profileId: profile.id,
      });
      return draftFormData;
    }

    // Нет черновиков - используем опубликованные данные
    logger.debug('No drafts found, using published data', {
      component: 'useProfileLoader',
      profileId: profile.id,
    });

    return convertToEditData(profile, availablePlatforms, loadedTopics, loadedBannedTopics);
  }, [profile, availablePlatforms, fetchProfileData, loadTopics, loadDrafts, convertToEditData]);

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
