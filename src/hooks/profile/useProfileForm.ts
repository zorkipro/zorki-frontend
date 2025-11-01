import { useState } from "react";
import type { EditData } from "@/types/profile";
import type { PlatformType } from "@/types/platform";

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
  formData: EditData;
  activeTab: PlatformType | string;
  editingSection: string | null;
  updateFormData: (data: Partial<EditData>) => void;
  setFormData: (data: EditData) => void;
  setActiveTab: (tab: PlatformType | string) => void;
  setEditingSection: (section: string | null) => void;
}

export const useProfileForm = (initialData?: EditData): ProfileFormReturn => {
  const [formData, setFormDataState] = useState<EditData>(
    initialData || INITIAL_FORM_DATA,
  );
  const [activeTab, setActiveTab] = useState<PlatformType | string>("instagram");
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const updateFormData = (data: Partial<EditData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
  };

  const setFormData = (data: EditData) => {
    setFormDataState({ ...data });
  };

  return {
    formData,
    activeTab,
    editingSection,
    updateFormData,
    setFormData,
    setActiveTab,
    setEditingSection,
  };
};
