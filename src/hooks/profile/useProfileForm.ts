/**
 * Хук для управления состоянием формы редактирования профиля
 *
 * Отвечает за:
 * - Хранение данных формы (formData)
 * - Обновление данных формы
 * - Состояние UI (activeTab, editingSection)
 * - Валидацию изменений
 *
 * Следует принципу Single Responsibility - только управление состоянием формы.
 */

import { useState, useCallback, useMemo } from "react";
import type { EditData, PlatformData } from "@/types/profile";
import type { PlatformType } from "@/types/platform";
import { ALL_PLATFORMS } from "@/types/platform";

/**
 * Начальные данные формы (пустые значения)
 */
export const INITIAL_FORM_DATA: EditData = {
  full_name: "",
  description: "",
  avatar_url: "",
  contact_link: "",
  work_format: "",
  gender_type: "",
  barter_available: false,
  mart_registry: false,
  cooperation_conditions: "",
  instagram_username: "",
  instagram_profile_url: "",
  instagram_followers: "",
  instagram_engagement_rate: "",
  instagram_post_reach: "",
  instagram_story_reach: "",
  instagram_post_price: "",
  instagram_story_price: "",
  tiktok_username: "",
  tiktok_profile_url: "",
  tiktok_followers: "",
  tiktok_engagement_rate: "",
  tiktok_post_reach: "",
  tiktok_story_reach: "",
  tiktok_post_price: "",
  tiktok_story_price: "",
  youtube_username: "",
  youtube_profile_url: "",
  youtube_followers: "",
  youtube_engagement_rate: "",
  youtube_post_reach: "",
  youtube_story_reach: "",
  youtube_post_price: "",
  youtube_story_price: "",
  telegram_username: "",
  telegram_profile_url: "",
  telegram_followers: "",
  telegram_engagement_rate: "",
  telegram_post_reach: "",
  telegram_story_reach: "",
  telegram_post_price: "",
  telegram_story_price: "",
  topics: [],
  banned_topics: [],
};

export interface ProfileFormReturn {
  /** Данные формы */
  formData: EditData;
  /** Активная вкладка платформы */
  activeTab: PlatformType | string;
  /** Редактируемая секция */
  editingSection: string | null;
  /** Обновить данные формы (partial update) */
  updateFormData: (data: Partial<EditData>) => void;
  /** Установить данные формы полностью */
  setFormData: (data: EditData) => void;
  /** Сбросить форму к начальному состоянию */
  resetForm: () => void;
  /** Установить активную вкладку */
  setActiveTab: (tab: PlatformType | string) => void;
  /** Установить редактируемую секцию */
  setEditingSection: (section: string | null) => void;
  /** Проверить, есть ли несохраненные изменения */
  hasUnsavedChanges: (originalData: EditData) => boolean;
}

/**
 * Хук для управления состоянием формы редактирования профиля
 *
 * @param initialData - Начальные данные формы (опционально)
 * @returns Состояние формы и функции управления
 *
 * @example
 * const { formData, updateFormData, resetForm } = useProfileForm(loadedData);
 *
 * // Обновить одно поле
 * updateFormData({ full_name: 'Новое имя' });
 *
 * // Сбросить форму
 * resetForm();
 */
export const useProfileForm = (initialData?: EditData): ProfileFormReturn => {
  const [formData, setFormDataState] = useState<EditData>(
    initialData || INITIAL_FORM_DATA,
  );
  const [activeTab, setActiveTab] = useState<PlatformType | string>(
    "instagram",
  );
  const [editingSection, setEditingSection] = useState<string | null>(null);

  /**
   * Обновляет данные формы (partial update)
   * Логирует изменения в режиме отладки
   */
  const updateFormData = useCallback((data: Partial<EditData>) => {
    setFormDataState((prev) => {
      const updated = { ...prev, ...data };

      return updated;
    });
  }, []);

  /**
   * Устанавливает данные формы полностью
   */
  const setFormData = useCallback((data: EditData) => {
    setFormDataState(data);
  }, []);

  /**
   * Сбрасывает форму к начальному состоянию
   */
  const resetForm = useCallback(() => {
    setFormDataState(initialData || INITIAL_FORM_DATA);
    setEditingSection(null);
  }, [initialData]);

  /**
   * Проверяет, есть ли несохраненные изменения
   * Сравнивает текущие данные формы с оригинальными
   */
  const hasUnsavedChanges = useCallback(
    (originalData: EditData): boolean => {
      // Сравниваем все поля
      const keys = Object.keys(formData) as (keyof EditData)[];

      for (const key of keys) {
        const current = formData[key];
        const original = originalData[key];

        // Специальная обработка для массивов
        if (Array.isArray(current) && Array.isArray(original)) {
          if (current.length !== original.length) {
            return true;
          }
          if (current.some((item, index) => item !== original[index])) {
            return true;
          }
          continue;
        }

        // Сравнение примитивов
        if (current !== original) {
          return true;
        }
      }

      return false;
    },
    [formData],
  );

  return {
    formData,
    activeTab,
    editingSection,
    updateFormData,
    setFormData,
    resetForm,
    setActiveTab,
    setEditingSection,
    hasUnsavedChanges,
  };
};
