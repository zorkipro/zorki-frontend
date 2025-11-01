import { useState, useCallback } from "react";
import { getBloggerById } from "@/api/endpoints/blogger";
import { mapApiDetailBloggerToLocal } from "@/utils/api/mappers";
import type { Influencer, PlatformData, EditData } from "@/types/profile";
import type { PublicGetBloggerByIdOutputDto } from "@/api/types";
import { useProfileData } from "./useProfileData";
import { useProfileDrafts } from "./useProfileDrafts";
import { ALL_PLATFORMS } from "@/types/platform";

export interface ProfileLoaderReturn {
  profile: Influencer | null;
  availablePlatforms: Record<string, PlatformData> | null;
  topics: number[];
  bannedTopics: number[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  loadProfileWithDrafts: () => Promise<EditData | null>;
  setProfile: (profile: Influencer | null) => void;
  setAvailablePlatforms: (
    platforms:
      | Record<string, PlatformData>
      | ((prev: Record<string, PlatformData>) => Record<string, PlatformData>),
  ) => void;
  hasDrafts: boolean;
  rawApiResponse: PublicGetBloggerByIdOutputDto | null;
}
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

  const loadTopics = useCallback(
    async (
      profileId: string,
      apiResponse?: PublicGetBloggerByIdOutputDto,
    ): Promise<{ topics: number[]; bannedTopics: number[] }> => {
      setLoadingTopics(true);
      try {
        const apiProfile = apiResponse || await getBloggerById(Number(profileId), { bypassCache: true });
        const localProfile = mapApiDetailBloggerToLocal(apiProfile);
        const isVerified = apiProfile.verificationStatus === 'APPROVED';
        const profileDraft = apiProfile.profileDraft;

        const loadedTopics = isVerified
          ? localProfile.topics || []
          : profileDraft?.topics?.map(t => t.id) || localProfile.topics || [];

        const loadedBannedTopics = isVerified
          ? localProfile.restrictedTopics || []
          : profileDraft?.restrictedTopics?.map(t => t.id) || localProfile.restrictedTopics || [];

        setTopics(loadedTopics);
        setBannedTopics(loadedBannedTopics);
        return { topics: loadedTopics, bannedTopics: loadedBannedTopics };
      } catch {
        return { topics: [], bannedTopics: [] };
      } finally {
        setLoadingTopics(false);
      }
    },
    [],
  );

  const convertToEditData = (
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

    ALL_PLATFORMS.forEach((platform) => {
      const platformData = platforms[platform];
      if (!platformData) return;

      editData[`${platform}_username`] = platformData.username || "";
      editData[`${platform}_profile_url`] = platformData.profile_url || "";
      editData[`${platform}_followers`] = platformData.subscribers?.toString() || "";
      editData[`${platform}_engagement_rate`] = platformData.er?.toString() || "";
      editData[`${platform}_post_reach`] = platformData.reach?.toString() || "";
      editData[`${platform}_story_reach`] = platformData.storyReach?.toString() || "";
      editData[`${platform}_post_price`] = platformData.price?.toString() || "";
      editData[`${platform}_story_price`] = platformData.storyPrice?.toString() || "";
      editData[`${platform}_integration_price`] = platformData.price?.toString() || "";
    });

    return editData;
  };

  const loadProfileWithDrafts = useCallback(async (): Promise<EditData | null> => {
    if (dataLoading || !rawApiResponse) return null;

    if (!profile || !availablePlatforms) {
      await fetchProfileData();
      if (!profile || !availablePlatforms || !rawApiResponse) return null;
    }

    const { topics: loadedTopics, bannedTopics: loadedBannedTopics } =
      await loadTopics(profile.id, rawApiResponse);

    const draftFormData = await loadDrafts(
      rawApiResponse,
      availablePlatforms,
      loadedTopics,
      loadedBannedTopics,
    );

    return draftFormData || convertToEditData(profile, availablePlatforms, loadedTopics, loadedBannedTopics);
  }, [profile, rawApiResponse, availablePlatforms, dataLoading, fetchProfileData, loadTopics, loadDrafts]);

  const refetch = useCallback(async () => {
    await fetchProfileData({ bypassCache: true });
    if (profile) {
      await loadTopics(profile.id, rawApiResponse || undefined);
    }
  }, [fetchProfileData, loadTopics, profile, rawApiResponse]);

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
    rawApiResponse,
  };
};
