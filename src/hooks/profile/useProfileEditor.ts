import { useEffect } from "react";
import { useProfileLoader } from "./useProfileLoader";
import { useProfileForm } from "./useProfileForm";
import { useProfileSaver } from "./useProfileSaver";
import { useTopics } from "@/hooks/useTopics";

export const useProfileEditor = () => {
  const {
    profile,
    availablePlatforms,
    loading: loaderLoading,
    error,
    loadProfileWithDrafts,
    refetch,
    setAvailablePlatforms,
    hasDrafts,
    rawApiResponse,
  } = useProfileLoader();

  const { topicLookup, loading: topicsLoading } = useTopics();

  const {
    formData,
    activeTab,
    editingSection,
    updateFormData,
    setFormData,
    setActiveTab,
    setEditingSection,
  } = useProfileForm();

  const { saving, handleSave } = useProfileSaver(
    profile,
    formData,
    setAvailablePlatforms,
    topicLookup,
    updateFormData,
    refetch,
    loadProfileWithDrafts,
    setFormData,
  );

  useEffect(() => {
    if (loaderLoading || !profile?.id || !rawApiResponse || formData.full_name) return;
    loadProfileWithDrafts().then((data) => data && setFormData(data));
  }, [profile?.id, loaderLoading, rawApiResponse, formData.full_name]);

  return {
    profile,
    availablePlatforms,
    formData,
    activeTab,
    editingSection,
    loading: loaderLoading || topicsLoading,
    saving,
    error,
    updateFormData,
    setFormData,
    setActiveTab,
    setEditingSection,
    handleSave,
    refetch,
    setAvailablePlatforms,
    hasDrafts,
  };
};
