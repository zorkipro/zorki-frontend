// ============================================
// Хук для редактирования блогера администратором
// ============================================
// Используется в AdminBloggerEditor.tsx
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAllBloggers, getBloggerById } from '@/api/endpoints/blogger';
import { adminUpdateBlogger, adminUpdateBloggerSocialPrice } from '@/api/endpoints/admin';
import { mapEditDataToProfileUpdate, mapPlatformPricesToUpdate, mapGenderFromApi, mapWorkFormatFromApi } from '@/utils/api/admin-blogger-mappers';
import type { PublicGetAllBloggersOutputDto, PublicGetBloggerByIdOutputDto } from '@/api/types';
import type { EditData, PlatformData } from '@/types/profile';
import type { ApiSocialType } from '@/api/types';
import { logger } from '@/utils/logger';
import { normalizeUsername } from '@/utils/username';

/**
 * Хук для редактирования блогера администратором
 */
export const useAdminBloggerEditor = (username?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<PublicGetBloggerByIdOutputDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EditData>({
    full_name: '',
    description: '',
    avatar_url: '',
    barter_available: false,
    mart_registry: false,
    contact_link: '',
    work_format: '',
    gender_type: '',
    cooperation_conditions: '',
    instagram_username: '',
    instagram_profile_url: '',
    instagram_followers: '0',
    instagram_engagement_rate: '0',
    instagram_post_reach: '0',
    instagram_story_reach: '0',
    instagram_post_price: '0',
    instagram_story_price: '0',
    instagram_integration_price: '0',
    tiktok_username: '',
    tiktok_profile_url: '',
    tiktok_followers: '0',
    tiktok_engagement_rate: '0',
    tiktok_post_reach: '0',
    tiktok_story_reach: '0',
    tiktok_post_price: '0',
    tiktok_story_price: '0',
    tiktok_integration_price: '0',
    youtube_username: '',
    youtube_profile_url: '',
    youtube_followers: '0',
    youtube_engagement_rate: '0',
    youtube_post_reach: '0',
    youtube_story_reach: '0',
    youtube_post_price: '0',
    youtube_story_price: '0',
    youtube_integration_price: '0',
    telegram_username: '',
    telegram_profile_url: '',
    telegram_followers: '0',
    telegram_engagement_rate: '0',
    telegram_post_reach: '0',
    telegram_story_reach: '0',
    telegram_post_price: '0',
    telegram_story_price: '0',
    telegram_integration_price: '0',
    topics: [],
    banned_topics: [],
  });
  const [activeTab, setActiveTab] = useState('instagram');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [availablePlatforms, setAvailablePlatforms] = useState<Record<string, PlatformData>>({});

  const fetchBloggerData = useCallback(async () => {
    if (!username) {
      setError('Username не указан');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Нормализуем username - убираем @ если есть
      const normalizedUsername = normalizeUsername(username);

      // Сначала находим блогера по username через публичный API
      const response = await getAllBloggers({
        username: normalizedUsername,
        socialType: 'INSTAGRAM',
        page: 1,
        size: 1,
      });

      if (response.items && response.items.length > 0) {
        const bloggerSummary = response.items[0];
        
        // Получаем полные данные блогера по ID
        const bloggerDetails = await getBloggerById(bloggerSummary.id);

        setProfile(bloggerDetails);

        // Инициализируем formData полными данными блогера
        // Приоритет: черновики > основные данные
        const profileData = bloggerDetails.profileDraft || bloggerDetails;
        const fullName = profileData.name && profileData.lastName 
          ? `${profileData.name} ${profileData.lastName}`.trim()
          : profileData.name || bloggerDetails.social?.[0]?.username || 'Неизвестный блогер';

        setFormData((prev) => ({
          ...prev,
          full_name: fullName,
          description: profileData.description || '',
          avatar_url: bloggerDetails.social?.[0]?.avatar || '',
          contact_link: profileData.contactLink || '',
          work_format: profileData.workFormat ? (mapWorkFormatFromApi(profileData.workFormat) || '') as "ИП" | "профдоход" | "договор подряда" | "ООО" | "" : '',
          gender_type: profileData.genderType ? (mapGenderFromApi(profileData.genderType) || '') as "мужчина" | "женщина" | "пара" | "паблик" | "" : '',
          barter_available: profileData.isBarterAvailable || false,
          mart_registry: profileData.isMartRegistry || false,
          // Используем темы из черновиков или основных данных
          topics: profileData.topics?.map(t => t.id) || [],
          banned_topics: profileData.restrictedTopics?.map(t => t.id) || [],
          // Данные Instagram (первая социальная сеть)
          instagram_username: bloggerDetails.social?.[0]?.username || '',
          instagram_followers: bloggerDetails.social?.[0]?.subscribers || '0',
          instagram_engagement_rate: bloggerDetails.social?.[0]?.er?.toString() || '0',
          instagram_post_reach: bloggerDetails.social?.[0]?.postCoverage || '0',
          instagram_story_reach: bloggerDetails.social?.[0]?.coverage || '0',
          instagram_post_price: bloggerDetails.price?.find(p => p.type === 'INSTAGRAM')?.postPrice?.toString() || '0',
          instagram_story_price: bloggerDetails.price?.find(p => p.type === 'INSTAGRAM')?.storiesPrice?.toString() || '0',
          instagram_integration_price: bloggerDetails.price?.find(p => p.type === 'INSTAGRAM')?.integrationPrice?.toString() || '0',
          // YouTube цены
          youtube_post_price: bloggerDetails.price?.find(p => p.type === 'YOUTUBE')?.postPrice?.toString() || '0',
          youtube_story_price: bloggerDetails.price?.find(p => p.type === 'YOUTUBE')?.storiesPrice?.toString() || '0',
          youtube_integration_price: bloggerDetails.price?.find(p => p.type === 'YOUTUBE')?.integrationPrice?.toString() || '0',
          // TikTok цены
          tiktok_post_price: bloggerDetails.price?.find(p => p.type === 'TIKTOK')?.postPrice?.toString() || '0',
          tiktok_story_price: bloggerDetails.price?.find(p => p.type === 'TIKTOK')?.storiesPrice?.toString() || '0',
          tiktok_integration_price: bloggerDetails.price?.find(p => p.type === 'TIKTOK')?.integrationPrice?.toString() || '0',
          // Telegram цены
          telegram_post_price: bloggerDetails.price?.find(p => p.type === 'TELEGRAM')?.postPrice?.toString() || '0',
          telegram_story_price: bloggerDetails.price?.find(p => p.type === 'TELEGRAM')?.storiesPrice?.toString() || '0',
          telegram_integration_price: bloggerDetails.price?.find(p => p.type === 'TELEGRAM')?.integrationPrice?.toString() || '0',
        }));

        // Устанавливаем данные в formData

        // Устанавливаем доступные платформы для всех социальных сетей
        const platforms: Record<string, PlatformData> = {};
        
        bloggerDetails.social?.forEach((social) => {
          const platformData: PlatformData = {
            username: social.username,
            subscribers: parseInt(social.subscribers || '0'),
            er: social.er || 0,
            reach: parseInt(social.postCoverage || '0'), // Охват публикаций
            price: 0,
            storyReach: parseInt(social.coverage || '0'), // Охват сторис
            storyPrice: 0,
          };

          // Приоритет: черновики цен > основные цены
          const priceData = bloggerDetails.priceDraft || bloggerDetails.price;
          const priceForPlatform = priceData?.find(p => p.type === social.type);
          if (priceForPlatform) {
            // Для YouTube используем integrationPrice, для остальных - postPrice
            if (social.type === 'YOUTUBE') {
              platformData.price = parseFloat(priceForPlatform.integrationPrice || '0');
            } else {
              platformData.price = parseFloat(priceForPlatform.postPrice || '0');
            }
            platformData.storyPrice = parseFloat(priceForPlatform.storiesPrice || '0');
            platformData.integrationPrice = parseFloat(priceForPlatform.integrationPrice || '0');
          }

          platforms[social.type.toLowerCase()] = platformData;
        });

        setAvailablePlatforms(platforms);

      } else {
        setError('Блогер не найден');
        toast({
          title: 'Ошибка',
          description: `Блогер с username "${username}" не найден`,
          variant: 'destructive',
        });
      }
    } catch (err: unknown) {
      logger.error('Ошибка загрузки данных блогера', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки данных блогера';
      setError(errorMessage);

      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные блогера',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [username, toast]);

  const updateFormData = useCallback((updates: Partial<EditData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleSave = useCallback(
    async (data: Partial<EditData>) => {
      if (!profile?.id) {
        logger.error('Cannot save: profile ID missing');
        return;
      }

      setSaving(true);
      setError(null);

      try {
        // Определяем, какие данные обновляем
        const profileFields = ['full_name', 'description', 'contact_link', 'work_format', 
          'gender_type', 'barter_available', 'mart_registry', 'topics', 'banned_topics'];
        
        // Поля охвата сторис тоже сохраняются через профильный API
        const storyReachFields = ['story_reach'];
        
        const hasProfileChanges = Object.keys(data).some(key => 
          profileFields.includes(key) || storyReachFields.some(field => key.includes(field))
        );

        const priceFields = ['post_price', 'story_price', 'integration_price'];
        const hasPriceChanges = Object.keys(data).some(key =>
          priceFields.some(field => key.includes(field))
        );

        // Сохраняем изменения профиля
        if (hasProfileChanges) {
          const profileDto = mapEditDataToProfileUpdate(data);
          await adminUpdateBlogger(profile.id, profileDto);
        }

        // Сохраняем изменения цен для каждой платформы
        if (hasPriceChanges) {
          const platforms: ApiSocialType[] = ['INSTAGRAM', 'YOUTUBE', 'TELEGRAM', 'TIKTOK'];
          
          for (const platform of platforms) {
            const priceDto = mapPlatformPricesToUpdate(platform, data);
            if (priceDto) {
              await adminUpdateBloggerSocialPrice(profile.id, priceDto);
            }
          }
        }

        // Обновляем локальное состояние
        setFormData((prev) => ({ ...prev, ...data }));

        toast({
          title: 'Успешно',
          description: 'Изменения сохранены',
          variant: 'default',
        });

        // Перезагружаем данные блогера
        await fetchBloggerData();

      } catch (err: unknown) {
        logger.error('Error saving blogger changes', err);
        
        const errorMessage = err instanceof Error ? err.message : 'Не удалось сохранить изменения';
        setError(errorMessage);
        
        toast({
          title: 'Ошибка',
          description: errorMessage,
          variant: 'destructive',
        });
        
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [profile?.id, toast, fetchBloggerData]
  );

  useEffect(() => {
    if (username) {
      fetchBloggerData();
    }
  }, [fetchBloggerData]);

  return {
    profile,
    formData,
    loading,
    saving,
    error,
    activeTab,
    editingSection,
    availablePlatforms,
    updateFormData,
    handleSave,
    setActiveTab,
    setEditingSection,
    setAvailablePlatforms,
    refetch: fetchBloggerData,
  };
};
