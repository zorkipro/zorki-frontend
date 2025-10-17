import { useEffect } from 'react';
import { useProfileLoader } from './useProfileLoader';
import { useProfileForm } from './useProfileForm';
import { useProfileSaver } from './useProfileSaver';
import { useTopics } from '@/hooks/useTopics';
import { logger } from '@/utils/logger';

/**
 * Главный хук для редактирования профиля
 *
 * Композиция из трех специализированных хуков:
 * - useProfileLoader - загрузка данных профиля и черновиков
 * - useProfileForm - управление состоянием формы
 * - useProfileSaver - сохранение изменений
 *
 * Следует принципам SOLID:
 * - Single Responsibility - каждый хук отвечает за свою область
 * - Open/Closed - легко расширять функциональность через композицию
 * - Dependency Inversion - зависит от абстракций (интерфейсов хуков)
 *
 * @example
 * const {
 *   profile,
 *   formData,
 *   loading,
 *   updateFormData,
 *   handleSave,
 * } = useProfileEditor();
 */
export const useProfileEditor = () => {
  // 1. Загрузка данных
  const {
    profile,
    availablePlatforms,
    loading: loaderLoading,
    error,
    loadProfileWithDrafts,
    refetch,
    setAvailablePlatforms,
    hasDrafts,
  } = useProfileLoader();

  // 2. Загрузка топиков для справочника
  const { topicLookup, loading: topicsLoading } = useTopics();

  // 3. Управление формой
  const {
    formData,
    activeTab,
    editingSection,
    updateFormData,
    setFormData,
    resetForm,
    setActiveTab,
    setEditingSection,
    hasUnsavedChanges,
  } = useProfileForm();

  // 4. Сохранение изменений
  const { saving, handleSave } = useProfileSaver(profile, formData, setAvailablePlatforms, topicLookup, updateFormData);

  // Загружаем данные профиля и черновики при монтировании
  useEffect(() => {
    const initializeForm = async () => {
      logger.debug('Initializing profile editor', {
        component: 'useProfileEditor',
        profileId: profile?.id,
      });

      const loadedData = await loadProfileWithDrafts();

      if (loadedData) {
        console.log('useProfileEditor: Setting form data', {
          full_name: loadedData.full_name,
          description: loadedData.description,
          loadedData: loadedData
        });
        setFormData(loadedData);
        logger.debug('Form initialized with data', {
          component: 'useProfileEditor',
          hasDrafts,
          topicsCount: loadedData.topics?.length || 0,
        });
      }
    };

    initializeForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]); // Запускаем только при изменении ID профиля

  // Объединяем все в единый интерфейс (фасад)
  return {
    // Данные профиля
    profile,
    availablePlatforms,

    // Состояние формы
    formData,
    activeTab,
    editingSection,

    // Состояния загрузки/ошибок
    loading: loaderLoading || topicsLoading,
    saving,
    error,

    // Функции управления формой
    updateFormData,
    setFormData,
    resetForm,
    setActiveTab,
    setEditingSection,

    // Функции работы с данными
    handleSave,
    refetch,
    setAvailablePlatforms,

    // Утилиты
    hasUnsavedChanges,
    hasDrafts,
  };
};
