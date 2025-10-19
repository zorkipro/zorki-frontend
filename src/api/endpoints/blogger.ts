// ============================================
// Blogger API Endpoints
// ============================================
// GET /blogger/public - Список блогеров (с фильтрацией)
// GET /blogger/public/:id - Детальная информация о блогере
// PUT /blogger/:id - Обновление профиля блогера
// PUT /blogger/social-price/:id - Обновление цен социальной сети
// ============================================

import { apiRequest } from "../client";
import type {
  PaginationUtil,
  PublicGetAllBloggersOutputDto,
  PublicGetBloggerByIdOutputDto,
  BloggerUpdateProfileInputDto,
  BloggerUpdateSocialPriceInputDto,
  BloggerUploadStatsInputDto,
  ApiSocialType,
  ApiGender,
} from "../types";

// ====== GET /blogger/public - Список блогеров ======

export interface GetAllBloggersParams {
  page?: number; // default: 1
  size?: number; // default: 50
  username?: string; // Поиск по username
  socialType?: ApiSocialType; // ВАЖНО: если не передать - вернутся только INSTAGRAM!
  gender?: ApiGender;
  topics?: number[]; // Массив ID топиков
  restrictedTopics?: number[]; // Массив ID запрещенных топиков
  subCountFrom?: number; // Min подписчиков
  subCountTo?: number; // Max подписчиков
  postPriceFrom?: number; // Min цена поста
  postPriceTo?: number; // Max цена поста
  storyPriceFrom?: number; // Min цена сториз
  storyPriceTo?: number; // Max цена сториз
  integrationPriceFrom?: number; // Min цена интеграции
  integrationPriceTo?: number; // Max цена интеграции
  isBarterAvailable?: boolean; // Возможен бартер
  isMartRegistry?: boolean; // В реестре МАРТ
}

/**
 * Получить список всех блогеров с фильтрацией
 *
 * @param params - Параметры фильтрации
 * @returns Promise с пагинированным списком блогеров
 *
 * @example
 * ```typescript
 * // Все блогеры (все платформы)
 * const all = await getAllBloggers({ page: 1, size: 50 });
 *
 * // Только Instagram блогеры (default если не передать socialType)
 * const ig = await getAllBloggers({ page: 1, socialType: 'INSTAGRAM' });
 *
 * // С фильтрацией
 * const filtered = await getAllBloggers({
 *   page: 1,
 *   gender: 'FEMALE',
 *   subCountFrom: 10000,
 *   topics: [1, 2, 3], // ID топиков
 *   isBarterAvailable: true,
 * });
 * ```
 */
export async function getAllBloggers(
  params: GetAllBloggersParams = {},
): Promise<PaginationUtil<PublicGetAllBloggersOutputDto[]>> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        // Для массивов добавляем каждый элемент отдельно
        value.forEach((v) => query.append(key, String(v)));
      } else {
        query.append(key, String(value));
      }
    }
  });

  return apiRequest<PaginationUtil<PublicGetAllBloggersOutputDto[]>>(
    `/blogger/public?${query}`,
  );
}

// ====== GET /blogger/public/:id - Детали блогера ======

/**
 * Получить детальную информацию о блогере по ID
 *
 * @param bloggerId - ID блогера
 * @returns Promise с детальной информацией
 *
 * @note Если передан user token - вернутся также drafts этого юзера
 *
 * @example
 * ```typescript
 * const blogger = await getBloggerById(123);
 * ```
 */
export async function getBloggerById(
  bloggerId: number,
): Promise<PublicGetBloggerByIdOutputDto> {
  return apiRequest<PublicGetBloggerByIdOutputDto>(
    `/blogger/public/${bloggerId}`,
  );
}

// ====== PUT /blogger/:id - Обновление профиля ======

/**
 * Обновить профиль блогера
 *
 * @param bloggerId - ID блогера
 * @param data - Данные для обновления (все поля optional)
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Validation error
 * @throws APIError 403 - Blogger does not belong to user
 * @throws APIError 404 - Blogger not found
 *
 * @note topics и restrictedTopics REQUIRED! (можно пустой массив, но нельзя undefined)
 * @note Если блогер не верифицирован - изменения сохраняются в drafts
 *
 * @example
 * ```typescript
 * await updateBloggerProfile(123, {
 *   name: 'Анна',
 *   lastName: 'Петрова',
 *   genderType: 'FEMALE',
 *   topics: [1, 2, 3], // Обязательно!
 *   restrictedTopics: [], // Обязательно!
 *   isBarterAvailable: true,
 * });
 * ```
 */
export async function updateBloggerProfile(
  bloggerId: number,
  data: BloggerUpdateProfileInputDto,
): Promise<void> {
  return apiRequest<void>(`/blogger/${bloggerId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ====== PUT /blogger/social-price/:id - Обновление цен ======

/**
 * Обновить цены социальной сети блогера
 *
 * @param bloggerId - ID блогера
 * @param data - Данные цен (type обязателен!)
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Validation error
 * @throws APIError 403 - Blogger does not belong to user
 * @throws APIError 404 - Blogger not found
 *
 * @note type обязателен! Остальные поля optional
 * @note Если блогер не верифицирован - изменения сохраняются в drafts
 *
 * @example
 * ```typescript
 * await updateBloggerSocialPrice(123, {
 *   type: 'INSTAGRAM', // обязательно!
 *   postPrice: 500,
 *   storiesPrice: 300,
 *   integrationPrice: 1000,
 * });
 * ```
 */
export async function updateBloggerSocialPrice(
  bloggerId: number,
  data: BloggerUpdateSocialPriceInputDto,
): Promise<void> {
  console.log('📡 updateBloggerSocialPrice request:', {
    url: `/blogger/social-price/${bloggerId}`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  return apiRequest<void>(`/blogger/social-price/${bloggerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

// ====== PUT /blogger/stats-upload/:id - Загрузка статистики блогера ======

/**
 * Загрузка файлов статистики для блогера
 *
 * @param bloggerId - ID блогера
 * @param data - Данные для загрузки (тип соцсети и файлы)
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data (неверные файлы или тип)
 * @throws APIError 401 - Unauthorized (требуется blogger token)
 * @throws APIError 404 - Blogger not found
 *
 * @note Требует Authorization header с blogger token
 * @note Поддерживает до 25 файлов за раз
 * @note Поддерживаемые форматы: JPEG, PNG, GIF, WebP, PDF
 * @note Максимальный размер файла: 10MB
 *
 * @example
 * ```typescript
 * const files = [file1, file2, file3]; // File[]
 * await uploadBloggerStats(123, {
 *   type: 'INSTAGRAM',
 *   files: files
 * });
 * ```
 */
export async function uploadBloggerStats(
  bloggerId: number,
  data: BloggerUploadStatsInputDto,
): Promise<void> {
  // Создаем FormData для загрузки файлов
  const formData = new FormData();

  // Добавляем тип социальной сети
  formData.append("type", data.type);

  // Добавляем файлы
  data.files.forEach((file, index) => {
    formData.append(`files`, file);
  });

  return apiRequest<void>(`/blogger/stats-upload/${bloggerId}`, {
    method: "PUT",
    body: formData,
    // Не устанавливаем Content-Type, браузер сам установит multipart/form-data
  });
}

// ====== DELETE /blogger/{bloggerId}/{fileId} - Удаление файла статистики ======

/**
 * Удалить файл статистики блогера
 *
 * @param bloggerId - ID блогера
 * @param fileId - ID файла для удаления
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized (требуется user auth token)
 * @throws APIError 403 - Insufficient rights to perform the operation
 * @throws APIError 404 - Blogger or file not found
 *
 * @note Требует Authorization header с user token
 * @note Только владелец блогера может удалять файлы
 *
 * @example
 * ```typescript
 * await deleteBloggerStatsFile(123, 456);
 * ```
 */
export async function deleteBloggerStatsFile(
  bloggerId: number,
  fileId: number,
): Promise<void> {
  return apiRequest<void>(`/blogger/${bloggerId}/${fileId}`, {
    method: "DELETE",
  });
}
