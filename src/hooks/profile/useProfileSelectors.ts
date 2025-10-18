/**
 * Селекторы для оптимизированного доступа к данным профиля
 * Предотвращают ненужные перерисовки компонентов
 */

import { useMemo } from "react";
import type { ClientBloggerInfo } from "@/api/types";
import type { Blogger } from "@/types/blogger";

/**
 * Селектор для основной информации профиля
 * Перерисовывается только при изменении имени или username
 */
export function useProfileBasicInfo(bloggerInfo: ClientBloggerInfo | null) {
  return useMemo(() => {
    if (!bloggerInfo) return null;

    return {
      id: bloggerInfo.id,
      name: bloggerInfo.name,
      lastName: bloggerInfo.lastName,
      username: bloggerInfo.username,
      createdAt: bloggerInfo.createdAt,
      updatedAt: bloggerInfo.updatedAt,
    };
  }, [
    bloggerInfo?.id,
    bloggerInfo?.name,
    bloggerInfo?.lastName,
    bloggerInfo?.username,
    bloggerInfo?.createdAt,
    bloggerInfo?.updatedAt,
  ]);
}

/**
 * Селектор для статуса верификации
 * Перерисовывается только при изменении статуса
 */
export function useVerificationStatus(bloggerInfo: ClientBloggerInfo | null) {
  return useMemo(() => {
    if (!bloggerInfo) return null;

    return {
      verificationStatus: bloggerInfo.verificationStatus,
      isVerified: bloggerInfo.verificationStatus === "APPROVED",
      isPending: bloggerInfo.verificationStatus === "MODERATION",
      isRejected: bloggerInfo.verificationStatus === "REJECTED",
    };
  }, [bloggerInfo?.verificationStatus]);
}

/**
 * Селектор для Blogger типа (для совместимости)
 * Перерисовывается только при изменении основных полей
 */
export function useBloggerData(
  bloggerInfo: ClientBloggerInfo | null,
): Blogger | null {
  return useMemo(() => {
    if (!bloggerInfo) return null;

    return {
      id: bloggerInfo.id.toString(),
      name: bloggerInfo.name || "",
      handle: bloggerInfo.username || "",
      avatar: "", // ClientBloggerInfo не содержит avatar
      promoText: "", // ClientBloggerInfo не содержит description
      platforms: {},
      followers: 0,
      postPrice: 0,
      storyPrice: 0,
      postReach: 0,
      storyReach: 0,
      engagementRate: 0,
      gender: undefined,
      category: "",
      topics: [],
      allowsBarter: false,
      inMartRegistry: false,
      legalForm: undefined,
      restrictedTopics: [],
      cooperationConditions: "",
      workFormat: "",
      paymentTerms: "",
      contact_url: "",
      verificationStatus: bloggerInfo.verificationStatus,
    };
  }, [
    bloggerInfo?.id,
    bloggerInfo?.name,
    bloggerInfo?.username,
    bloggerInfo?.verificationStatus,
  ]);
}
