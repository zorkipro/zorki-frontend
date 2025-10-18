/**
 * Мапперы для слияния черновиков с опубликованными данными
 * Используется для отображения неопубликованных изменений в редакторе профиля
 */

import type { Blogger } from "@/types/blogger";
import type { PublicGetBloggerByIdOutputDto } from "@/api/types";
import { mapApiDetailBloggerToLocal } from "./profile-mappers";

/**
 * Сливает данные черновиков с основными данными блогера
 * Используется для отображения неопубликованных изменений в редакторе профиля
 *
 * Приоритет: черновики переопределяют опубликованные данные
 *
 * @param apiResponse - полный ответ от GET /blogger/public/{bloggerId}
 * @returns объект с объединенными данными и флагами наличия черновиков
 *
 * @example
 * const { mergedProfile, hasDrafts, draftInfo } = mergeDraftsWithPublished(apiResponse);
 * if (hasDrafts) {
 *   // У блогера есть неопубликованные изменения
 * }
 */
export function mergeDraftsWithPublished(
  apiResponse: PublicGetBloggerByIdOutputDto,
): {
  mergedProfile: Blogger;
  hasDrafts: boolean;
  draftInfo: {
    hasProfileDraft: boolean;
    hasPriceDraft: boolean;
    hasCoverageDraft: boolean;
  };
} {
  const hasProfileDraft = !!apiResponse.profileDraft;
  const hasPriceDraft =
    !!apiResponse.priceDraft && apiResponse.priceDraft.length > 0;
  const hasCoverageDraft =
    !!apiResponse.coverageDraft && apiResponse.coverageDraft.length > 0;
  const hasAnyDrafts = hasProfileDraft || hasPriceDraft || hasCoverageDraft;

  // Создаем копию основного ответа для модификации
  const modifiedResponse: PublicGetBloggerByIdOutputDto = {
    ...apiResponse,
    // Переопределяем основные поля данными из черновиков профиля
    name: hasProfileDraft
      ? apiResponse.profileDraft?.name || apiResponse.name
      : apiResponse.name,
    lastName: hasProfileDraft
      ? apiResponse.profileDraft?.lastName || apiResponse.lastName
      : apiResponse.lastName,
    contactLink: hasProfileDraft
      ? apiResponse.profileDraft?.contactLink || apiResponse.contactLink
      : apiResponse.contactLink,
    workFormat: hasProfileDraft
      ? apiResponse.profileDraft?.workFormat || apiResponse.workFormat
      : apiResponse.workFormat,
    genderType: hasProfileDraft
      ? apiResponse.profileDraft?.genderType || apiResponse.genderType
      : apiResponse.genderType,
    isBarterAvailable: hasProfileDraft
      ? (apiResponse.profileDraft?.isBarterAvailable ??
        apiResponse.isBarterAvailable)
      : apiResponse.isBarterAvailable,
    isMartRegistry: hasProfileDraft
      ? (apiResponse.profileDraft?.isMartRegistry ?? apiResponse.isMartRegistry)
      : apiResponse.isMartRegistry,
  };

  // Обновляем социальные аккаунты с данными из черновиков профиля
  if (hasProfileDraft && apiResponse.social) {
    modifiedResponse.social = apiResponse.social.map((social) => ({
      ...social,
      description: social.description,
      avatar: social.avatar,
    }));
  }

  // Обновляем цены с данными из черновиков цен
  if (hasPriceDraft && apiResponse.price) {
    modifiedResponse.price = apiResponse.price.map((price) => {
      // Ищем соответствующий черновик цены по типу
      const priceDraft = apiResponse.priceDraft?.find(
        (draft) => draft.type === price.type,
      );

      if (priceDraft) {
        return {
          ...price,
          postPrice: priceDraft.postPrice || price.postPrice,
          storiesPrice: priceDraft.storiesPrice || price.storiesPrice,
          integrationPrice:
            priceDraft.integrationPrice || price.integrationPrice,
        };
      }

      return price;
    });
  }

  // Обновляем охват с данными из черновиков охвата
  if (hasCoverageDraft && apiResponse.social) {
    modifiedResponse.social = apiResponse.social.map((social) => {
      // Ищем соответствующий черновик охвата по типу
      const coverageDraft = apiResponse.coverageDraft?.find(
        (draft) => draft.type === social.type,
      );

      if (coverageDraft) {
        return {
          ...social,
          coverage: coverageDraft.coverage,
        };
      }

      return social;
    });
  }

  // Преобразуем модифицированный ответ в Blogger
  const mergedProfile = mapApiDetailBloggerToLocal(modifiedResponse);

  return {
    mergedProfile,
    hasDrafts: hasAnyDrafts,
    draftInfo: {
      hasProfileDraft,
      hasPriceDraft,
      hasCoverageDraft,
    },
  };
}

/**
 * Извлекает информацию о черновиках из API ответа
 * Используется для отображения индикаторов наличия неопубликованных изменений
 *
 * @param apiResponse - ответ от GET /blogger/public/{bloggerId}
 * @returns информация о наличии черновиков
 *
 * @example
 * const { hasDrafts, draftTypes, draftSummary } = extractDraftInfo(apiResponse);
 * // "Есть черновики: Профиль, Цены"
 */
export function extractDraftInfo(apiResponse: PublicGetBloggerByIdOutputDto): {
  hasDrafts: boolean;
  draftTypes: string[];
  draftSummary: string;
} {
  const hasProfileDraft = !!apiResponse.profileDraft;
  const hasPriceDraft =
    !!apiResponse.priceDraft && apiResponse.priceDraft.length > 0;
  const hasCoverageDraft =
    !!apiResponse.coverageDraft && apiResponse.coverageDraft.length > 0;
  const hasAnyDrafts = hasProfileDraft || hasPriceDraft || hasCoverageDraft;

  const draftTypes: string[] = [];
  if (hasProfileDraft) draftTypes.push("Профиль");
  if (hasPriceDraft) draftTypes.push("Цены");
  if (hasCoverageDraft) draftTypes.push("Охват");

  const draftSummary = hasAnyDrafts
    ? `Есть черновики: ${draftTypes.join(", ")}`
    : "Нет черновиков";

  return {
    hasDrafts: hasAnyDrafts,
    draftTypes,
    draftSummary,
  };
}
