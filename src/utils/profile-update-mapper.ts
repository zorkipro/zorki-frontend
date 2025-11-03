/**
 * Утилиты для маппинга изменений профиля в поля BloggerContext
 * Обеспечивает селективное обновление только измененных полей
 */

import type { EditData } from "@/types/profile";
import type { ClientBloggerInfo } from "@/api/types";

/**
 * Маппинг полей EditData в поля ClientBloggerInfo
 */
export interface ProfileUpdateMapping {
  // Основная информация
  full_name?: string;
  description?: string;
  gender?: string;
  legal_form?: string;
  contact_url?: string;

  // Статус верификации
  verification_status?: "NEW" | "APPROVED" | "REJECTED" | "MODERATION";

  // Дополнительные поля
  [key: string]: any;
}

/**
 * Преобразует изменения EditData в поля для обновления BloggerContext
 * @param changes - изменения из формы редактирования
 * @returns объект с полями для селективного обновления
 */
export function mapProfileChangesToBloggerFields(
  changes: Partial<EditData>,
): Partial<ClientBloggerInfo> {
  const mappedFields: Partial<ClientBloggerInfo> = {};

  // Маппинг основных полей (только те, что есть в ClientBloggerInfo)
  if (changes.full_name !== undefined) {
    mappedFields.name = changes.full_name;
  }

  // Маппинг статуса верификации (если изменился)
  if ((changes as any).verification_status !== undefined) {
    mappedFields.verificationStatus = (changes as any).verification_status;
  }

  return mappedFields;
}

/**
 * Проверяет, есть ли реальные изменения в данных
 * @param oldData - старые данные
 * @param newData - новые данные
 * @returns true если есть изменения, false если данные идентичны
 */
export function hasProfileChanges(
  oldData: Partial<EditData>,
  newData: Partial<EditData>,
): boolean {
  const keys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);

  for (const key of keys) {
    const typedKey = key as keyof EditData;
    if (oldData[typedKey] !== newData[typedKey]) {
      return true;
    }
  }

  return false;
}
