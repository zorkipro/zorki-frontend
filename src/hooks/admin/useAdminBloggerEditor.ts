// ============================================
// Хук для редактирования блогера администратором
// ============================================
// Используется в AdminBloggerEditor.tsx
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAllBloggers } from '@/api/endpoints/blogger';
import type { PublicGetAllBloggersOutputDto } from '@/api/types';
import type { EditData, PlatformData } from '@/types/profile';
import { logger } from '@/utils/logger';

/**
 * Хук для редактирования блогера администратором
 */
export const useAdminBloggerEditor = (username?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<PublicGetAllBloggersOutputDto | null>(null);
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
    tiktok_username: '',
    tiktok_profile_url: '',
    tiktok_followers: '0',
    tiktok_engagement_rate: '0',
    tiktok_post_reach: '0',
    tiktok_story_reach: '0',
    tiktok_post_price: '0',
    tiktok_story_price: '0',
    youtube_username: '',
    youtube_profile_url: '',
    youtube_followers: '0',
    youtube_engagement_rate: '0',
    youtube_post_reach: '0',
    youtube_story_reach: '0',
    youtube_post_price: '0',
    youtube_story_price: '0',
    telegram_username: '',
    telegram_profile_url: '',
    telegram_followers: '0',
    telegram_engagement_rate: '0',
    telegram_post_reach: '0',
    telegram_story_reach: '0',
    telegram_post_price: '0',
    telegram_story_price: '0',
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
      // Используем существующий API для поиска блогера по username
      const response = await getAllBloggers({
        username: username,
        socialType: 'INSTAGRAM',
        page: 1,
        size: 1,
      });

      if (response.items && response.items.length > 0) {
        const bloggerData = response.items[0];
        logger.debug('Загруженные данные блогера', {
          component: 'useAdminBloggerEditor',
          bloggerId: bloggerData.id,
          socialUsername: bloggerData.social?.username,
        });
        setProfile(bloggerData);

        // Инициализируем formData данными блогера
        // Приоритет имени: title из социального аккаунта -> name -> username
        const displayName =
          bloggerData.social?.title ||
          bloggerData.name ||
          bloggerData.social?.username ||
          'Неизвестный блогер';
        const fullName =
          bloggerData.social?.title ||
          [bloggerData.name, bloggerData.lastName].filter(Boolean).join(' ') ||
          bloggerData.social?.username ||
          'Неизвестный блогер';
        setFormData((prev) => ({
          ...prev,
          full_name: fullName,
          description: bloggerData.social?.description || '',
          avatar_url: bloggerData.social?.avatar || '',
          gender_type:
            bloggerData.genderType === 'MALE'
              ? 'мужчина'
              : bloggerData.genderType === 'FEMALE'
                ? 'женщина'
                : '',
          instagram_username: bloggerData.social?.username || '',
          instagram_followers: bloggerData.social?.subscribers || '0',
          instagram_engagement_rate: bloggerData.social?.er?.toString() || '0',
          instagram_post_reach: bloggerData.social?.coverage || '0',
          instagram_story_reach: bloggerData.social?.coverage || '0',
          instagram_post_price: bloggerData.price?.postPrice || '0',
          instagram_story_price: bloggerData.price?.storiesPrice || '0',
        }));

        // Устанавливаем доступные платформы
        const platforms: Record<string, PlatformData> = {};
        if (bloggerData.social) {
          // Используем postCoverage если есть, иначе coverage
          const socialData = bloggerData.social;
          const postCoverage = (socialData as any).postCoverage || bloggerData.social.coverage;

          const platformData: PlatformData = {
            username: bloggerData.social.username,
            subscribers: parseInt(bloggerData.social.subscribers || '0'),
            er: bloggerData.social.er || 0,
            reach: parseInt(postCoverage || '0'), // используем postCoverage если есть
            price: parseFloat(bloggerData.price?.postPrice || '0'),
            storyReach: parseInt(bloggerData.social.coverage || '0'), // используем coverage как fallback
            storyPrice: parseFloat(bloggerData.price?.storiesPrice || '0'),
          };
          logger.debug('Social data loaded', {
            component: 'useAdminBloggerEditor',
            socialType: bloggerData.social.type,
            hasStats: !!bloggerData.social.stats,
            coverage: bloggerData.social.coverage,
            postCoverage: socialData.postCoverage,
            parsedReach: platformData.reach,
          });
          platforms[bloggerData.social.type.toLowerCase()] = platformData;
        }
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
      logger.error('Ошибка загрузки данных блогера', err, {
        component: 'useAdminBloggerEditor',
        username,
      });
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
      setSaving(true);

      try {
        toast({
          title: 'TODO',
          description: 'Backend API для сохранения изменений блогера пока не реализован',
          variant: 'destructive',
        });

        // Обновляем локальные данные
        setFormData((prev) => ({ ...prev, ...data }));
      } catch (err: unknown) {
        logger.error('Ошибка сохранения изменений блогера', err, {
          component: 'useAdminBloggerEditor',
          profileId: profile?.id,
        });
        toast({
          title: 'Ошибка',
          description: 'Не удалось сохранить изменения',
          variant: 'destructive',
        });
      } finally {
        setSaving(false);
      }
    },
    [profile?.id, toast]
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
