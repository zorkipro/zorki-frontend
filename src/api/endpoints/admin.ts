// ============================================
// Admin API Endpoints
// ============================================
// ⚠️ Некоторые endpoints не реализованы на backend.
// См. docs/API_TODOS.md для полного списка и приоритетов.
// ============================================

import { apiRequest } from "../client";
import type {
  AdminLoginInputDto,
  AdminLoginOutputDto,
  AdminSignUpInputDto,
  AdminAuthMeOutputDto,
  AdminLogin2faFakeInputDto,
  AdminGetLinkBloggerClientRequestOutputDto,
  LinkRequestStatus,
  PaginationUtil,
  GetLinkRequestsParams,
  AdminGetBloggersQuery,
  AdminGetBloggersResponse,
  AdminGetBloggersStatsOutputDto,
  AdminCreateBloggerInputDto,
  BloggerUpdateProfileInputDto,
  BloggerUpdateSocialPriceInputDto,
  ApiSocialType,
  ApiGender,
  AdminBloggerWithGender,
  PublicGetBloggerByIdOutputDto,
  // Parser Accounts types
  IgClientSessionsOutputDto,
  IgClientLoginInputDto,
  IgClientLoginOutputDto,
  TgClientLoginInputDto,
  TgClientLoginOutputDto,
  TgClientConfirmInputDto,
  TgClientConfirmOutputDto,
  GetIgSessionsParams,
  IgSessionsResponse,
  BloggerLinkMediaTgRequestInputDto,
  BloggerLinkMediaYtRequestInputDto,
} from "../types";

// ====== POST /auth/admin/login - Логин админа ======

/**
 * Логин админа
 *
 * @param data - username и password
 * @returns Promise с accessToken
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized (неверные credentials)
 *
 * @note Токен нужно сохранить в sessionStorage.setItem('adminToken', accessToken)
 *
 * @example
 * ```typescript
 * const { accessToken } = await adminLogin({
 *   username: 'admin',
 *   password: 'Admin123'
 * });
 * sessionStorage.setItem('adminToken', accessToken);
 * ```
 */
export async function adminLogin(
  data: AdminLoginInputDto,
): Promise<AdminLoginOutputDto> {
  return apiRequest<AdminLoginOutputDto>("/auth/admin/login", {
    method: "POST",
    body: JSON.stringify(data),
    // Используем прокси (убираем baseUrl)
  });
}

// ====== POST /auth/admin/signup - Регистрация админа ======

/**
 * Создание нового админа (требует admin auth)
 *
 * @param data - email, username, password
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data или username/email уже существует
 * @throws APIError 401 - Unauthorized
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * await adminSignUp({
 *   email: 'newadmin@example.com',
 *   username: 'newadmin',
 *   password: 'Admin123'
 * });
 * ```
 */
export async function adminSignUp(data: AdminSignUpInputDto): Promise<void> {
  return apiRequest<void>("/auth/admin/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ====== GET /auth/admin/me - Получение информации о текущем админе ======

/**
 * Получение информации о текущем авторизованном админе
 *
 * @returns Promise с информацией об админе
 * @throws APIError 401 - Unauthorized
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * const adminInfo = await getAdminMe();
 * ```
 */
export async function getAdminMe(): Promise<AdminAuthMeOutputDto> {
  return apiRequest<AdminAuthMeOutputDto>("/auth/admin/me", {
    method: "GET",
  });
}

// ====== POST /auth/admin/2fa/confirm - Подтверждение 2FA ======

/**
 * Подтверждение 2FA кода при логине администратора
 *
 * @param code - 6-значный код подтверждения
 * @returns Promise с полным accessToken
 *
 * @throws APIError 400 - Incorrect input data (неверный код)
 * @throws APIError 401 - Unauthorized (истекший временный токен)
 *
 * @note Требует Authorization header с временным токеном из /auth/admin/login
 * @note После успешного подтверждения получаем полный JWT токен
 *
 * @example
 * ```typescript
 * const { accessToken } = await adminConfirm2FA(123456);
 * sessionStorage.setItem('adminToken', accessToken);
 * ```
 */
export async function adminConfirm2FA(
  code: number,
): Promise<AdminLoginOutputDto> {
  const data: AdminLogin2faFakeInputDto = { code };

  // Получаем временный токен для 2FA подтверждения
  const tempToken = sessionStorage.getItem("adminTempToken");
  if (!tempToken) {
    throw new Error("Временный токен для 2FA не найден. Пожалуйста, войдите заново.");
  }

  // Добавляем логирование для отладки

  return apiRequest<AdminLoginOutputDto>("/auth/admin/2fa/confirm", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuthErrorHandling: true, // НЕ очищать токены автоматически
    // Используем прокси (убираем baseUrl)
    // Используем временный токен напрямую для этого запроса
    headers: {
      "Authorization": `Bearer ${tempToken}`,
      "Content-Type": "application/json"
    }
  });
}

// ====== ADMIN BLOGGER MANAGEMENT ======

/**
 * Получение списка всех блогеров с расширенными фильтрами и пагинацией
 *
 * @param params - Параметры фильтрации и пагинации
 * @returns Promise с пагинированным списком блогеров
 *
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @example
 * ```typescript
 * const bloggers = await adminGetBloggers({
 *   page: 1,
 *   size: 20,
 *   socialType: 'INSTAGRAM',
 *   verificationStatus: 'APPROVED',
 *   isHidden: false
 * });
 * ```
 */
export async function adminGetBloggers(
  params: AdminGetBloggersQuery = {},
): Promise<AdminGetBloggersResponse> {
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

  return apiRequest<AdminGetBloggersResponse>(`/admin/blogger?${query}`);
}

/**
 * Получение общей статистики по блогерам для Dashboard
 *
 * @returns Promise с статистикой блогеров
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @example
 * ```typescript
 * const stats = await adminGetBloggersStats();
 * // stats.totalBloggersCount, stats.totalApprovedBloggersCount, etc.
 * ```
 */
export async function adminGetBloggersStats(): Promise<AdminGetBloggersStatsOutputDto> {
  return apiRequest<AdminGetBloggersStatsOutputDto>("/admin/blogger/stats", {
    method: "GET",
  });
}

/**
 * Создание нового блогера администратором
 *
 * @param username - Instagram username блогера
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data или blogger already exists
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @example
 * ```typescript
 * await adminCreateBlogger('anna_petrova');
 * ```
 */
export async function adminCreateBlogger(username: string): Promise<void> {
  const data: AdminCreateBloggerInputDto = { username };

  return apiRequest<void>("/admin/blogger", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Переключение видимости блогера (показать/скрыть)
 *
 * @param bloggerId - ID блогера
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 404 - Blogger not found
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @example
 * ```typescript
 * await adminToggleBloggerVisibility(123);
 * ```
 */
export async function adminToggleBloggerVisibility(
  bloggerId: number,
): Promise<void> {
  return apiRequest<void>(`/admin/blogger/visibility/${bloggerId}`, {
    method: "PATCH",
  });
}

/**
 * ⚠️ TODO: Backend endpoint required
 *
 * GET /admin/blogger
 * Auth: Required (admin-auth-jwt-schema)
 *
 * Query Parameters:
 *   page?: number = 1
 *   size?: number = 50
 *   verificationStatus?: 'NEW' | 'APPROVED' | 'REJECTED' | 'MODERATION'
 *   isHidden?: boolean
 *   search?: string (по имени или username)
 *
 * Response: PaginationUtil<AdminGetBloggerOutputDto[]>
 *
 * AdminGetBloggerOutputDto {
 *   id, userId, name, lastName, verificationStatus, isHidden,
 *   socialAccounts: Array<{ type, username, subscribers }>,
 *   hasDrafts: boolean,
 *   createdAt, updatedAt
 * }
 *
 * Пример использования:
 * ```typescript
 * export async function adminGetAllBloggers(params: {
 *   page?: number;
 *   size?: number;
 *   verificationStatus?: 'NEW' | 'APPROVED' | 'REJECTED' | 'MODERATION';
 *   isHidden?: boolean;
 *   search?: string;
 * }): Promise<PaginationUtil<AdminGetBloggerOutputDto[]>> {
 *   const query = new URLSearchParams();
 *   Object.entries(params).forEach(([key, value]) => {
 *     if (value !== undefined) query.append(key, String(value));
 *   });
 *   return apiRequest(`/admin/blogger?${query}`);
 * }
 * ```
 */

/**
 * ⚠️ TODO: Backend endpoint required
 *
 * POST /admin/blogger/{id}/approve
 * Auth: Required (admin-auth-jwt-schema)
 *
 * Body: {} // пустой
 * Response: 204 No Content
 *
 * Логика:
 * 1. Изменить verificationStatus на APPROVED
 * 2. Опубликовать все черновики (BloggerUpdateProfileDraft, BloggerSocialPriceDraft, BloggerCoverageSocialDraft)
 * 3. Удалить черновики после публикации
 *
 * Ошибки:
 *   400 - Blogger already approved
 *   404 - Blogger not found
 *   401 - Unauthorized
 *
 * Пример использования:
 * ```typescript
 * export async function adminApproveBlogger(bloggerId: number): Promise<void> {
 *   return apiRequest(`/admin/blogger/${bloggerId}/approve`, {
 *     method: 'POST',
 *     body: JSON.stringify({}),
 *   });
 * }
 * ```
 */

/**
 * ⚠️ TODO: Backend endpoint required
 *
 * POST /admin/blogger/{id}/reject
 * Auth: Required (admin-auth-jwt-schema)
 *
 * Body: { reason?: string }
 * Response: 204 No Content
 *
 * Логика:
 * 1. Изменить verificationStatus на REJECTED
 * 2. НЕ удалять черновики (пользователь может исправить)
 *
 * Ошибки:
 *   400 - Blogger already rejected
 *   404 - Blogger not found
 *   401 - Unauthorized
 *
 * Пример использования:
 * ```typescript
 * export async function adminRejectBlogger(
 *   bloggerId: number,
 *   reason?: string
 * ): Promise<void> {
 *   return apiRequest(`/admin/blogger/${bloggerId}/reject`, {
 *     method: 'POST',
 *     body: JSON.stringify({ reason }),
 *   });
 * }
 * ```
 */

/**
 * ⚠️ TODO: Backend endpoint required
 *
 * PATCH /admin/blogger/{id}/visibility
 * Auth: Required (admin-auth-jwt-schema)
 *
 * Body: { isHidden: boolean }
 * Response: 204 No Content
 *
 * Логика:
 * 1. Обновить isHidden в Blogger
 * 2. Скрытые блогеры НЕ возвращаются в GET /blogger/public
 *
 * Ошибки:
 *   404 - Blogger not found
 *   401 - Unauthorized
 *
 * Пример использования:
 * ```typescript
 * export async function adminToggleBloggerVisibility(
 *   bloggerId: number,
 *   isHidden: boolean
 * ): Promise<void> {
 *   return apiRequest(`/admin/blogger/${bloggerId}/visibility`, {
 *     method: 'PATCH',
 *     body: JSON.stringify({ isHidden }),
 *   });
 * }
 * ```
 */

/**
 * ⚠️ TODO: Backend endpoint required
 *
 * DELETE /admin/blogger/{id}
 * Auth: Required (admin-auth-jwt-schema)
 *
 * Response: 204 No Content
 *
 * Логика:
 * 1. Cascade delete всех связанных данных (SocialAccount, BloggerSocialPrice, drafts, topics)
 * 2. Soft delete vs Hard delete - на усмотрение backend
 *
 * Ошибки:
 *   404 - Blogger not found
 *   401 - Unauthorized
 *
 * Пример использования:
 * ```typescript
 * export async function adminDeleteBlogger(bloggerId: number): Promise<void> {
 *   return apiRequest(`/admin/blogger/${bloggerId}`, {
 *     method: 'DELETE',
 *   });
 * }
 * ```
 */

/**
 * ⚠️ TODO: Backend endpoint required
 * 
 * POST /admin/blogger
 * Auth: Required (admin-auth-jwt-schema)
 * 
 * Body: {
 *   name: string,
 *   lastName: string,
 *   genderType: ApiGender,
 *   socialAccounts: [{
 *     type: 'INSTAGRAM',
 *     username: string // обязательно хотя бы Instagram
 *   }]
 * }
 * 
 * Response: 201 Created
 * {
 *   id: number,
 *   name: string,
 *   lastName: string,
 *   verificationStatus: 'NEW',
 *   createdAt: string
 * }
 * 
 * Логика:
 * 1. Создать Blogger с verificationStatus = NEW
 * 2. Создать SocialAccount для Instagram (обязательно)
 * 3. Запустить парсинг данных из Instagram (если нужно)
 * 
 * Ошибки:
 *   400 - Validation error / Username already exists
 *   401 - Unauthorized
 * 
 * Пример использования:
 * ```typescript
 * export async function adminCreateBlogger(data: {
 *   name: string;
 *   lastName: string;
 *   genderType: ApiGender;
 *   instagramUsername: string;
 * }): Promise<{ id: number }> {
 *   return apiRequest('/admin/blogger', {
 *     method: 'POST',
 *     body: JSON.stringify({
 *       name: data.name,
 *       lastName: data.lastName,
 *       genderType: data.genderType,
 *       socialAccounts: [
 *         { type: 'INSTAGRAM', username: data.instagramUsername }
 *       ]
 *     }),
 *   });
 * }
 * ```

// ====== ADMIN LINK REQUESTS (Backend реализован) ======

/**
 * Получение запросов на связывание блогера с клиентом
 * 
 * @param params - параметры пагинации, сортировки и фильтрации
 * @returns Promise с пагинированным списком запросов
 * 
 * @throws APIError 401 - Unauthorized (требуется admin token)
 * 
 * @example
 * ```typescript
 * const requests = await getAdminLinkRequests({
 *   page: 1,
 *   size: 20,
 *   status: 'MODERATION',
 *   sortDirection: 'desc',
 *   sortField: 'createdAt'
 * });
 * ```
 */
export async function getAdminLinkRequests(
  params: GetLinkRequestsParams = {},
): Promise<PaginationUtil<AdminGetLinkBloggerClientRequestOutputDto[]>> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      query.append(key, String(value));
    }
  });

  return apiRequest<
    PaginationUtil<AdminGetLinkBloggerClientRequestOutputDto[]>
  >(`/admin/link/blogger-client?${query}`);
}

/**
 * Одобрение запроса на связывание блогера с клиентом
 *
 * @param requestId - ID запроса на связывание
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Request already processed
 * @throws APIError 404 - Request not found
 * @throws APIError 401 - Unauthorized
 *
 * @example
 * ```typescript
 * await approveLinkRequest(123);
 * ```
 */
export async function approveLinkRequest(requestId: number): Promise<void> {
  return apiRequest<void>(`/admin/link/blogger-client/approve/${requestId}`, {
    method: "POST",
  });
}

/**
 * Отклонение запроса на связывание блогера с клиентом
 *
 * @param requestId - ID запроса на связывание
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Request already processed
 * @throws APIError 404 - Request not found
 * @throws APIError 401 - Unauthorized
 *
 * @example
 * ```typescript
 * await rejectLinkRequest(123);
 * ```
 */
export async function rejectLinkRequest(requestId: number): Promise<void> {
  return apiRequest<void>(`/admin/link/blogger-client/reject/${requestId}`, {
    method: "POST",
  });
}

/**
 * Удалить файл статистики блогера (только для администраторов)
 *
 * @param bloggerId - ID блогера
 * @param fileId - ID файла для удаления
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized (требуется admin token)
 * @throws APIError 403 - File not belong to this blogger
 * @throws APIError 404 - Blogger or file not found
 *
 * @note Требует Authorization header с admin token
 * @note Администратор может удалять файлы любого блогера
 *
 * @example
 * ```typescript
 * await adminDeleteBloggerStatsFile(123, 456);
 * ```
 */
export async function adminDeleteBloggerStatsFile(
  bloggerId: number,
  fileId: number,
): Promise<void> {
  return apiRequest<void>(`/admin/blogger/${bloggerId}/${fileId}`, {
    method: "DELETE",
  });
}

/**
 * Обновление профиля блогера администратором
 * PUT /admin/blogger/{bloggerId}
 *
 * @param bloggerId - ID блогера
 * @param data - данные для обновления профиля
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized (требуется admin token)
 * @throws APIError 404 - Blogger not found
 *
 * @note Требует Authorization header с admin token
 * @note Все поля опциональны, отправляются только изменённые поля
 *
 * @example
 * ```typescript
 * await adminUpdateBlogger(123, {
 *   name: 'Новое имя',
 *   description: 'Новое описание',
 *   topics: [1, 2, 3]
 * });
 * ```
 */
export async function adminUpdateBlogger(
  bloggerId: number,
  data: BloggerUpdateProfileInputDto,
): Promise<void> {
  return apiRequest<void>(`/admin/blogger/${bloggerId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Обновление цен на соц. платформе блогера
 * PUT /admin/blogger/social-price/{bloggerId}
 *
 * @param bloggerId - ID блогера
 * @param data - данные цен для платформы
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized (требуется admin token)
 * @throws APIError 404 - Blogger or social media not found
 *
 * @note Требует Authorization header с admin token
 * @note Поле type обязательно, остальные поля опциональны
 *
 * @example
 * ```typescript
 * await adminUpdateBloggerSocialPrice(123, {
 *   type: 'INSTAGRAM',
 *   postPrice: 1000,
 *   storiesPrice: 500
 * });
 * ```
 */
export async function adminUpdateBloggerSocialPrice(
  bloggerId: number,
  data: BloggerUpdateSocialPriceInputDto,
): Promise<void> {
  try {
    const result = await apiRequest<void>(`/admin/blogger/social-price/${bloggerId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Загрузка файлов статистики блогера администратором
 * PUT /admin/blogger/stats-upload/{bloggerId}
 *
 * @param bloggerId - ID блогера
 * @param type - тип социальной платформы
 * @param files - массив файлов для загрузки
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data или слишком много файлов
 * @throws APIError 401 - Unauthorized (требуется admin token)
 * @throws APIError 404 - Blogger or social media not found
 *
 * @note Требует Authorization header с admin token
 * @note Максимум 25 файлов, размер до 10MB каждый
 * @note Поддерживаемые форматы: image/jpeg, image/png
 *
 * @example
 * ```typescript
 * await adminUploadBloggerStats(123, 'INSTAGRAM', [file1, file2]);
 * ```
 */
export async function adminUploadBloggerStats(
  bloggerId: number,
  type: ApiSocialType,
  files: File[],
): Promise<void> {
  const formData = new FormData();
  formData.append("type", type);
  files.forEach((file) => formData.append("files", file));

  return apiRequest<void>(`/admin/blogger/stats-upload/${bloggerId}`, {
    method: "PUT",
    body: formData,
    headers: {}, // Убираем Content-Type, браузер сам установит для FormData
  });
}

/**
 * Получение информации о поле блогера через публичный API
 * GET /blogger/public/{bloggerId}
 *
 * @param bloggerId - ID блогера
 * @returns Promise с информацией о поле блогера
 *
 * @throws APIError 404 - Blogger not found
 *
 * @note Использует публичный API для получения информации о поле
 * @note Требует Authorization header с admin token для скрытых блогеров
 *
 * @example
 * ```typescript
 * const bloggerInfo = await adminGetBloggerGenderInfo(123);
 * console.log(bloggerInfo.genderType); // "MALE" | "FEMALE" | "COUPLE" | "PUBLIC_PAGE" | null
 * ```
 */
export async function adminGetBloggerGenderInfo(
  bloggerId: number,
): Promise<Pick<PublicGetBloggerByIdOutputDto, 'id' | 'genderType'>> {
  return apiRequest<Pick<PublicGetBloggerByIdOutputDto, 'id' | 'genderType'>>(
    `/blogger/public/${bloggerId}`,
    {
      method: "GET",
    },
  );
}

// Кэш для genderType по ID блогера для предотвращения повторных запросов
const genderTypeCache = new Map<number, ApiGender | null>();
const CACHE_TTL = 5 * 60 * 1000; // 5 минут
const cacheTimestamps = new Map<number, number>();

/**
 * Получить genderType из кэша или null если отсутствует/истек
 */
function getCachedGenderType(bloggerId: number): ApiGender | null | undefined {
  const timestamp = cacheTimestamps.get(bloggerId);
  if (timestamp && Date.now() - timestamp < CACHE_TTL) {
    return genderTypeCache.get(bloggerId);
  }
  // Кэш истек, очищаем
  genderTypeCache.delete(bloggerId);
  cacheTimestamps.delete(bloggerId);
  return undefined;
}

/**
 * Сохранить genderType в кэш
 */
function setCachedGenderType(bloggerId: number, genderType: ApiGender | null): void {
  genderTypeCache.set(bloggerId, genderType);
  cacheTimestamps.set(bloggerId, Date.now());
}

/**
 * Обогащение списка блогеров информацией о поле
 * 
 * ⚠️ ПРОБЛЕМА N+1 ЗАПРОСОВ:
 * Для каждого блогера делается отдельный запрос к /blogger/public/${bloggerId}
 * только для получения поля genderType.
 * 
 * РЕКОМЕНДАЦИЯ БЭКЕНДУ:
 * Добавить поле genderType в ответ /admin/blogger, чтобы исключить N+1 запросов.
 * 
 * ТЕКУЩАЯ ОПТИМИЗАЦИЯ:
 * - Используется кэширование genderType для предотвращения повторных запросов
 * - Батчинг запросов (по 5 одновременно)
 * - Параллельная обработка батчей
 * 
 * @param bloggers - Список блогеров из админского API
 * @returns Promise с обогащенным списком блогеров
 *
 * @example
 * ```typescript
 * const enrichedBloggers = await adminEnrichBloggersWithGender(bloggers);
 * ```
 */
export async function adminEnrichBloggersWithGender(
  bloggers: AdminGetBloggersResponse['items']
): Promise<AdminBloggerWithGender[]> {
  const enrichedBloggers: AdminBloggerWithGender[] = [];
  
  // Разделяем блогеров на те, у кого есть кэш и те, кому нужен запрос
  const cachedBloggers: AdminBloggerWithGender[] = [];
  const bloggersToFetch: typeof bloggers = [];
  
  for (const blogger of bloggers) {
    const cachedGenderType = getCachedGenderType(blogger.id);
    if (cachedGenderType !== undefined) {
      // Используем кэшированное значение
      cachedBloggers.push({
        ...blogger,
        genderType: cachedGenderType,
      } as AdminBloggerWithGender);
    } else {
      // Нужно загрузить
      bloggersToFetch.push(blogger);
    }
  }
  
  // Если все есть в кэше, возвращаем сразу
  if (bloggersToFetch.length === 0) {
    return [...cachedBloggers];
  }
  
  // Обрабатываем блогеров, которым нужны запросы, параллельно с ограничением
  const batchSize = 5; // Обрабатываем по 5 блогеров одновременно
  for (let i = 0; i < bloggersToFetch.length; i += batchSize) {
    const batch = bloggersToFetch.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (blogger) => {
      try {
        const genderInfo = await adminGetBloggerGenderInfo(blogger.id);
        const genderType = genderInfo.genderType;
        
        // Сохраняем в кэш
        setCachedGenderType(blogger.id, genderType);
        
        return {
          ...blogger,
          genderType,
        } as AdminBloggerWithGender;
      } catch (error) {
        // Если не удалось получить информацию о поле, используем null и тоже кэшируем
        setCachedGenderType(blogger.id, null);
        return {
          ...blogger,
          genderType: null,
        } as AdminBloggerWithGender;
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    enrichedBloggers.push(...batchResults);
  }
  
  // Объединяем кэшированные и загруженные результаты
  // Сохраняем порядок из исходного массива
  const resultMap = new Map<number, AdminBloggerWithGender>();
  [...cachedBloggers, ...enrichedBloggers].forEach(blogger => {
    resultMap.set(blogger.id, blogger);
  });
  
  // Возвращаем в исходном порядке
  return bloggers.map(blogger => resultMap.get(blogger.id)!);
}

/**
 * Связывание Telegram канала с блогером (админ)
 * POST /admin/blogger/link/TG/{bloggerId}
 *
 * @param bloggerId - ID блогера
 * @param data - Данные Telegram канала (username)
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data или channel already linked или parsing error
 * @throws APIError 401 - Unauthorized (требуется admin token)
 * @throws APIError 403 - The operation is not possible
 * @throws APIError 404 - Blogger not found
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * await adminLinkTgChannelToBlogger(123, {
 *   username: 'my_telegram_channel'
 * });
 * ```
 */
export async function adminLinkTgChannelToBlogger(
  bloggerId: number,
  data: BloggerLinkMediaTgRequestInputDto,
): Promise<void> {
  return apiRequest<void>(`/admin/blogger/link/TG/${bloggerId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Связывание YouTube канала с блогером (админ)
 * POST /admin/blogger/link/YT/{bloggerId}
 *
 * @param bloggerId - ID блогера
 * @param data - Данные YouTube канала (channel URL или handle)
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data или channel already linked или parsing error
 * @throws APIError 401 - Unauthorized (требуется admin token)
 * @throws APIError 403 - The operation is not possible
 * @throws APIError 404 - Blogger not found
 *
 * @note Требует Authorization header с admin token
 *
 * @example
 * ```typescript
 * await adminLinkYtChannelToBlogger(123, {
 *   channel: 'https://youtube.com/@my_channel'
 * });
 * ```
 */
export async function adminLinkYtChannelToBlogger(
  bloggerId: number,
  data: BloggerLinkMediaYtRequestInputDto,
): Promise<void> {
  return apiRequest<void>(`/admin/blogger/link/YT/${bloggerId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Загрузка блогеров без пола с пагинацией и кэшированием
 * 
 * @param page - Номер страницы для загрузки
 * @param size - Размер страницы
 * @param cachedPages - Кэш уже обработанных страниц
 * @returns Promise с блогерами без пола
 *
 * @example
 * ```typescript
 * const bloggersWithoutGender = await adminGetBloggersWithoutGender(1, 50, new Map());
 * ```
 */
export async function adminGetBloggersWithoutGender(
  page: number = 1,
  size: number = 50,
  cachedPages: Map<number, AdminBloggerWithGender[]> = new Map()
): Promise<{
  bloggers: AdminBloggerWithGender[];
  hasMore: boolean;
  totalCount: number;
  cachedPages: Map<number, AdminBloggerWithGender[]>;
}> {
  const bloggersWithoutGender: AdminBloggerWithGender[] = [];
  let currentPage = page;
  let hasMore = true;
  const maxPages = 20; // Ограничиваем количество страниц для безопасности
  
  // Собираем блогеров из кэша
  for (let i = 1; i < page; i++) {
    const cachedBloggers = cachedPages.get(i);
    if (cachedBloggers) {
      // Дополнительно фильтруем кэшированных блогеров
      const filteredCachedBloggers = cachedBloggers.filter(blogger => 
        !blogger.genderType || blogger.genderType === null
      );
      bloggersWithoutGender.push(...filteredCachedBloggers);
    }
  }
  
  // Загружаем новые страницы
  while (hasMore && currentPage <= maxPages) {
    // Проверяем, есть ли уже эта страница в кэше
    if (cachedPages.has(currentPage)) {
      const cachedBloggers = cachedPages.get(currentPage)!;
      // Дополнительно фильтруем кэшированных блогеров
      const filteredCachedBloggers = cachedBloggers.filter(blogger => 
        !blogger.genderType || blogger.genderType === null
      );
      bloggersWithoutGender.push(...filteredCachedBloggers);
      currentPage++;
      continue;
    }
    
    // Загружаем страницу блогеров через админский API
    const bloggersResponse = await adminGetBloggers({
      page: currentPage,
      size: size,
      sortDirection: "desc",
      sortField: "createdAt",
    });
    
    if (bloggersResponse.items.length === 0) {
      hasMore = false;
      break;
    }
    
    // Обогащаем блогеров информацией о поле
    const enrichedBloggers = await adminEnrichBloggersWithGender(bloggersResponse.items);
    
    // Фильтруем только блогеров без пола
    const bloggersWithoutGenderInBatch = enrichedBloggers.filter(
      blogger => !blogger.genderType || blogger.genderType === null
    );
    
    // Сохраняем в кэш
    cachedPages.set(currentPage, bloggersWithoutGenderInBatch);
    bloggersWithoutGender.push(...bloggersWithoutGenderInBatch);
    
    // Если получили меньше блогеров чем запрашивали, значит это последняя страница
    if (bloggersResponse.items.length < size) {
      hasMore = false;
    }
    
    // Если набрали достаточно блогеров без пола, останавливаемся
    if (bloggersWithoutGender.length >= size) {
      hasMore = false;
    }
    
    currentPage++;
  }
  
  return {
    bloggers: bloggersWithoutGender.slice(0, size), // Возвращаем только нужное количество
    hasMore: hasMore && currentPage <= maxPages,
    totalCount: bloggersWithoutGender.length,
    cachedPages,
  };
}

// ====== PARSER ACCOUNTS MANAGEMENT ======

/**
 * Получение списка Instagram сессий
 * GET /ig-client
 *
 * @param params - параметры пагинации и фильтрации
 * @returns Promise с пагинированным списком Instagram сессий
 *
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @example
 * ```typescript
 * const sessions = await getIgSessions({
 *   page: 1,
 *   size: 20,
 *   isAuthorized: true
 * });
 * ```
 */
export async function getIgSessions(
  params: GetIgSessionsParams = {},
): Promise<IgSessionsResponse> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  return apiRequest<IgSessionsResponse>(`/ig-client?${query}`);
}

/**
 * Добавление нового Instagram аккаунта для парсинга
 * POST /ig-client/login
 *
 * @param username - Instagram username
 * @param password - Instagram password
 * @returns Promise с результатом логина
 *
 * @throws APIError 400 - Incorrect input data или can not load ig session
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @example
 * ```typescript
 * const result = await loginIgAccount('username', 'password');
 * ```
 */
export async function loginIgAccount(
  username: string,
  password: string,
): Promise<IgClientLoginOutputDto> {
  const data: IgClientLoginInputDto = { username, password };

  return apiRequest<IgClientLoginOutputDto>("/ig-client/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Удаление Instagram сессии
 * DELETE /ig-client/{sessionId}
 *
 * @param sessionId - ID сессии для удаления
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized (требуется admin token)
 * @throws APIError 404 - Session not found
 *
 * @example
 * ```typescript
 * await deleteIgSession(123);
 * ```
 */
export async function deleteIgSession(sessionId: number): Promise<void> {
  return apiRequest<void>(`/ig-client/${sessionId}`, {
    method: "DELETE",
  });
}

/**
 * Выход из Instagram сессии
 * POST /ig-client/logout/{sessionId}
 *
 * @param sessionId - ID сессии для выхода
 * @returns Promise<void> (204 No Content)
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized (требуется admin token)
 * @throws APIError 404 - Session not found
 *
 * @example
 * ```typescript
 * await logoutIgSession(123);
 * ```
 */
export async function logoutIgSession(sessionId: number): Promise<void> {
  return apiRequest<void>(`/ig-client/logout/${sessionId}`, {
    method: "POST",
  });
}

/**
 * Начало процесса логина Telegram аккаунта
 * POST /tg-client/login
 *
 * @param phone - номер телефона
 * @param apiHash - API hash из Telegram
 * @param apiId - API ID из Telegram
 * @returns Promise с результатом логина (требует подтверждения кода)
 *
 * @throws APIError 400 - Incorrect input data
 * @throws APIError 401 - Unauthorized (требуется admin token)
 *
 * @example
 * ```typescript
 * const result = await loginTgAccount('+1234567890', 'hash', 12345);
 * ```
 */
export async function loginTgAccount(
  phone: string,
  apiHash: string,
  apiId: number,
): Promise<TgClientLoginOutputDto> {
  const data: TgClientLoginInputDto = { phone, apiHash, apiId };

  return apiRequest<TgClientLoginOutputDto>("/tg-client/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Подтверждение логина Telegram аккаунта кодом из SMS
 * POST /tg-client/confirm
 *
 * @param phone - номер телефона
 * @param code - код подтверждения из SMS
 * @returns Promise с результатом подтверждения
 *
 * @throws APIError 400 - Incorrect input data или can not confirm and login telegram account
 * @throws APIError 401 - Unauthorized (требуется admin token)
 * @throws APIError 404 - Session for telegram account not found
 *
 * @example
 * ```typescript
 * const result = await confirmTgLogin('+1234567890', '12345');
 * ```
 */
export async function confirmTgLogin(
  phone: string,
  code: string,
): Promise<TgClientConfirmOutputDto> {
  const data: TgClientConfirmInputDto = { phone, code };

  return apiRequest<TgClientConfirmOutputDto>("/tg-client/confirm", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
