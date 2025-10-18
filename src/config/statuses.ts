/**
 * Константы для статусов верификации и видимости
 */

import type { ApiVerificationStatus, LinkRequestStatus } from "@/api/types";

/**
 * Статусы модерации/верификации (соответствует ApiVerificationStatus)
 */
export const MODERATION_STATUSES = {
  NEW: "NEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  MODERATION: "MODERATION",
} as const;

/**
 * Статусы запросов на связывание (соответствует LinkRequestStatus)
 */
export const LINK_REQUEST_STATUSES = {
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  MODERATION: "MODERATION",
} as const;

/**
 * Конфигурация отображения статусов верификации
 */
export const VERIFICATION_STATUS_CONFIG = {
  NEW: {
    label: "Новый",
    color: "bg-gray-500",
    badge: "secondary" as const,
  },
  APPROVED: {
    label: "Одобрен",
    color: "bg-green-500",
    badge: "default" as const,
  },
  REJECTED: {
    label: "Отклонён",
    color: "bg-red-500",
    badge: "destructive" as const,
  },
  MODERATION: {
    label: "На проверке",
    color: "bg-yellow-500",
    badge: "secondary" as const,
  },
  PENDING: {
    label: "На рассмотрении",
    color: "bg-yellow-500",
    badge: "secondary" as const,
  },
} as const;

/**
 * Конфигурация отображения статусов запросов на связывание
 */
export const LINK_REQUEST_CONFIG = {
  APPROVED: {
    label: "Одобрен",
    color: "bg-green-500",
    badge: "default" as const,
  },
  REJECTED: {
    label: "Отклонён",
    color: "bg-red-500",
    badge: "destructive" as const,
  },
  MODERATION: {
    label: "На рассмотрении",
    color: "bg-yellow-500",
    badge: "secondary" as const,
  },
} as const;

export const VISIBILITY_STATUS_CONFIG = {
  VISIBLE: "виден",
  HIDDEN: "скрыт",
  DELETED: "удалён",
} as const;

/**
 * Получить конфигурацию отображения для статуса верификации
 */
export function getVerificationStatusConfig(status: ApiVerificationStatus) {
  return VERIFICATION_STATUS_CONFIG[status] || VERIFICATION_STATUS_CONFIG.NEW;
}

/**
 * Получить конфигурацию отображения для статуса запроса на связывание
 */
export function getLinkRequestStatusConfig(status: LinkRequestStatus) {
  return LINK_REQUEST_CONFIG[status] || LINK_REQUEST_CONFIG.MODERATION;
}

/**
 * Проверка, является ли статус одобренным
 */
export function isApprovedStatus(
  status: ApiVerificationStatus | LinkRequestStatus,
): boolean {
  return status === "APPROVED";
}

/**
 * Проверка, является ли статус отклоненным
 */
export function isRejectedStatus(
  status: ApiVerificationStatus | LinkRequestStatus,
): boolean {
  return status === "REJECTED";
}

/**
 * Проверка, находится ли запрос на модерации
 */
export function isModerationStatus(
  status: ApiVerificationStatus | LinkRequestStatus,
): boolean {
  return status === "MODERATION" || status === "NEW";
}
