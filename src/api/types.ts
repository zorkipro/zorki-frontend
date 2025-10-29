// ============================================
// Backend API Types
// ============================================
// Этот файл содержит все типы из Swagger спецификации
// Backend: NestJS + Prisma
// Swagger: /Users/babariko/Desktop/swagger-json.json
//=============================================

// ====== ENUM TYPES (точное соответствие Prisma schema) ======

export type ApiSocialType = "YOUTUBE" | "INSTAGRAM" | "TELEGRAM" | "TIKTOK";
export type ApiGender = "MALE" | "FEMALE" | "COUPLE" | "PUBLIC_PAGE";
export type ApiWorkFormat =
  | "SOLE_PROPRIETOR"
  | "SELF_EMPLOYED"
  | "SERVICE_CONTRACT"
  | "LLC";
export type ApiVerificationStatus =
  | "NEW"
  | "APPROVED"
  | "REJECTED"
  | "MODERATION";

// ====== NEW TYPES FROM BACKEND UPDATE ======

export type BloggerVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

// ====== ENUM MAPPERS (Backend UPPERCASE <-> Frontend русский) ======

export const GENDER_MAP: Record<ApiGender, string> = {
  MALE: "мужчина",
  FEMALE: "женщина",
  COUPLE: "пара",
  PUBLIC_PAGE: "паблик",
};

export const GENDER_REVERSE: Record<string, ApiGender> = {
  мужчина: "MALE",
  женщина: "FEMALE",
  пара: "COUPLE",
  паблик: "PUBLIC_PAGE",
};

export const WORK_FORMAT_MAP: Record<ApiWorkFormat, string> = {
  SOLE_PROPRIETOR: "ИП",
  SELF_EMPLOYED: "профдоход",
  SERVICE_CONTRACT: "договор подряда",
  LLC: "ООО",
};

export const WORK_FORMAT_REVERSE: Record<string, ApiWorkFormat> = {
  ИП: "SOLE_PROPRIETOR",
  профдоход: "SELF_EMPLOYED",
  "договор подряда": "SERVICE_CONTRACT",
  ООО: "LLC",
};

export const VERIFICATION_MAP: Record<ApiVerificationStatus, string> = {
  NEW: "новый",
  APPROVED: "одобрен",
  REJECTED: "отклонён",
  MODERATION: "на проверке",
};

export const VERIFICATION_REVERSE: Record<string, ApiVerificationStatus> = {
  новый: "NEW",
  одобрен: "APPROVED",
  отклонён: "REJECTED",
  "на проверке": "MODERATION",
};

// ====== COMMON TYPES ======

export interface BadRequestErrorFieldExceptionDto {
  message: string;
  field: string;
  errorKey:
    | "error.incorrect_input_data"
    | "error.session_not_found"
    | "error.session_unauthorized"
    | "error.username_is_not_tg_channel"
    | "error.can_not_get_tg_channel_info"
    | "error.can_not_get_yt_channel_info"
    | "error.can_not_get_ig_user_info"
    | "error.blogger_not_found"
    | "error.channel_not_found"
    | "error.user_not_found"
    | "error.unauthorized"
    | "error.can_not_load_ig_client"
    | "error.email_is_exist"
    | "error.username_is_exist"
    | "error.account_is_already_linked"
    | "error.request_has_been_sent"
    | "error.request_not_found"
    | "error.request_not_under_moderation"
    | "error.request_not_belong_user"
    | "error.ig_user_not_found_or_no_active_parser_acc"
    | "error.blogger_linked_to_another_user"
    | "error.blogger_not_belong_user"
    | "error.invalid_page"
    | "error.social_media_not_found"
    | "error.topic_not_found"
    | "error.operation_is_impossible"
    | "error.code_is_invalid"
    | "error.blogger_already_exist"
    | "error.topic_already_exist"
    | "error.invalid_file_type"
    | "error.exceeded_size"
    | "error.file_required"
    | "error.incorrect_quantity"
    | "error.unknown"
    | "error.too_many_files"
    | "error.file_not_found"
    | "error.file_not_belong_to_blogger"
    | "error.file_not_belong_to_user"
    | "error_input.username"
    | "error_input.password"
    | "error_input.channel"
    | "error_input.phone"
    | "error_input.apiHash"
    | "error_input.apiId"
    | "error_input.email"
    | "error_input.requestId"
    | "error_input.bloggerId"
    | "error_input.name"
    | "error_input.lastName"
    | "error_input.contactLink"
    | "error_input.workFormat"
    | "error_input.genderType"
    | "error_input.isBarterAvailable"
    | "error_input.isMartRegistry"
    | "error_input.topics"
    | "error_input.restrictedTopics"
    | "error_input.type"
    | "error_input.postPrice"
    | "error_input.storiesPrice"
    | "error_input.integrationPrice"
    | "error_input.page"
    | "error_input.size"
    | "error_input.status"
    | "error_input.sortField"
    | "error_input.sortDirection"
    | "error_input.socialType"
    | "error_input.gender"
    | "error_input.subCountTo"
    | "error_input.subCountFrom"
    | "error_input.postPriceFrom"
    | "error_input.postPriceTo"
    | "error_input.storyPriceFrom"
    | "error_input.storyPriceTo"
    | "error_input.integrationPriceFrom"
    | "error_input.integrationPriceTo"
    | "error_input.coverageSocialType"
    | "error_input.coverage"
    | "error_input.code"
    | "error_input.files"
    | "error_input.fileId"
    | "error_input.isRestricted"
    | "error_input.topicId"
    | "error_input.description";
}

export interface BadRequestExceptionDto {
  message: string;
  statusCode: number;
  errorField: BadRequestErrorFieldExceptionDto[] | null;
}

export interface PaginationUtil<T> {
  totalCount: number;
  pagesCount: number;
  page: number;
  size: number;
  items: T;
}

// ====== BLOGGER PUBLIC - GET /blogger/public (LIST) ======

export interface PublicGetAllBloggersSocialAccStatsOutputDto {
  id: number;
  processedVideos: number;
  views: string | null; // BigInt as string
  likes: string | null; // BigInt as string
  comments: string | null; // BigInt as string
  createdAt: string; // ISO date string
  updatedAt: string | null; // ISO date string
}

export interface PublicGetAllBloggersSocialAccOutputDto {
  id: number;
  type: ApiSocialType;
  title: string | null;
  description: string | null;
  username: string;
  er: number; // engagement rate
  coverage: string | null; // BigInt as string
  postCoverage: string | null; // BigInt as string - охват поста
  externalId: string | null;
  avatar: string | null;
  media: string | null; // BigInt as string
  subscribers: string | null; // BigInt as string
  totalViews: string | null; // BigInt as string
  createdAt: string; // ISO date string
  updatedAt: string | null; // ISO date string
  stats: PublicGetAllBloggersSocialAccStatsOutputDto | null;
}

export interface PublicGetAllBloggersSocialPriceOutputDto {
  id: number;
  type: ApiSocialType;
  postPrice: string | null; // Decimal as string
  storiesPrice: string | null; // Decimal as string
  integrationPrice: string | null; // Decimal as string
}

export interface PublicGetAllBloggersOutputDto {
  id: number;
  userId: string | null;
  name: string | null;
  lastName: string | null;
  genderType: ApiGender | null;
  verificationStatus: ApiVerificationStatus | null;
  social: PublicGetAllBloggersSocialAccOutputDto | null; // ОДНА основная платформа!
  price: PublicGetAllBloggersSocialPriceOutputDto; // ОДИН объект цен!
  createdAt: string; // ISO date string
  updatedAt: string | null; // ISO date string
}

// ====== BLOGGER PUBLIC - GET /blogger/public/:id (DETAILS) ======

export interface PublicGetBloggerByIdTopicOutputDto {
  id: number;
  name: string;
}

export interface PublicGetBloggerByIdProfileDraftOutputDto {
  id: number;
  userId: string;
  name: string | null;
  lastName: string | null;
  description: string | null; // НОВОЕ ПОЛЕ
  contactLink: string | null;
  workFormat: ApiWorkFormat | null;
  genderType: ApiGender | null;
  isMartRegistry: boolean | null;
  isBarterAvailable: boolean | null;
  topics: PublicGetBloggerByIdTopicOutputDto[] | null;
  restrictedTopics: PublicGetBloggerByIdTopicOutputDto[] | null;
  createdAt: string; // ISO date string
  updatedAt: string | null; // ISO date string
}

export interface PublicGetBloggerByIdPriceDraftOutputDto {
  id: number;
  type: ApiSocialType;
  postPrice: string | null; // Decimal as string
  storiesPrice: string | null; // Decimal as string
  integrationPrice: string | null; // Decimal as string
  userId: string;
  updatedAt: string; // ISO date string
}

export interface PublicGetBloggerByIdCoverageDraftOutputDto {
  id: number;
  type: ApiSocialType;
  coverage: string; // BigInt as string
}

export interface PublicGetBloggerByIdOutputDto {
  id: number;
  userId: string | null;
  name: string | null;
  lastName: string | null;
  description: string | null; // НОВОЕ ПОЛЕ
  contactLink: string | null;
  genderType: ApiGender | null;
  workFormat: ApiWorkFormat | null;
  verificationStatus: ApiVerificationStatus | null;
  isMartRegistry: boolean;
  isBarterAvailable: boolean;
  social: PublicGetBloggerByIdSocialAccOutputDto[] | null; // МАССИВ платформ!
  price: PublicGetAllBloggersSocialPriceOutputDto[]; // МАССИВ цен!
  topics: PublicGetBloggerByIdTopicOutputDto[] | null;
  restrictedTopics: PublicGetBloggerByIdTopicOutputDto[] | null;
  profileDraft: PublicGetBloggerByIdProfileDraftOutputDto | null;
  priceDraft: PublicGetBloggerByIdPriceDraftOutputDto[] | null;
  coverageDraft: PublicGetBloggerByIdCoverageDraftOutputDto[] | null;
  socialMediaDrafts: PublicGetBloggerByIdSocialAccOutputDto[] | null; // Платформы на модерации
  createdAt: string; // ISO date string
  updatedAt: string | null; // ISO date string
}

// ====== BLOGGER UPDATE - PUT /blogger/:id ======

export interface BloggerUpdateProfileInputDto {
  name?: string; // 1-30 chars
  lastName?: string; // 1-30 chars
  description?: string; // 1-500 символов, опционально
  contactLink?: string; // URI
  workFormat?: ApiWorkFormat;
  genderType?: ApiGender;
  topics?: number[]; // массив ID! required (можно пустой [])
  restrictedTopics?: number[]; // массив ID! required (можно пустой [])
  isBarterAvailable?: boolean;
  isMartRegistry?: boolean;
  coverageSocialType?: ApiSocialType; // для обновления coverage
  coverage?: number;
}

// ====== BLOGGER SOCIAL PRICE UPDATE - PUT /blogger/social-price/:id ======

export interface BloggerUpdateSocialPriceInputDto {
  type: ApiSocialType; // required!
  postPrice?: number;
  storiesPrice?: number;
  integrationPrice?: number;
}

// ====== BLOGGER STATS UPLOAD - PUT /blogger/stats-upload/:id ======

export interface BloggerUploadStatsInputDto {
  type: ApiSocialType; // required!
  files: File[]; // До 25 файлов
}

// ====== BLOGGER PUBLIC - Дополнительные поля из нового API ======

export interface PublicGetBloggerByIdSocialStatsFileOutputDto {
  id: number;
  type: ApiSocialType;
  name: string;
  publicUrl: string;
  size: number; // KB
  width: number;
  height: number;
  createdAt: string; // ISO date string
}

export interface PublicGetBloggerByIdSocialAccOutputDto {
  id: number;
  type: ApiSocialType;
  title: string | null;
  description: string | null;
  username: string;
  er: number; // engagement rate
  coverage: string | null; // BigInt as string
  postCoverage: string | null; // BigInt as string - охват поста
  externalId: string | null;
  avatar: string | null;
  media: string | null; // BigInt as string
  subscribers: string | null; // BigInt as string
  totalViews: string | null; // BigInt as string
  createdAt: string; // ISO date string
  updatedAt: string | null; // ISO date string
  stats: PublicGetAllBloggersSocialAccStatsOutputDto | null;
  statsFiles: PublicGetBloggerByIdSocialStatsFileOutputDto[] | null;
}

// ====== ADMIN AUTH ======

export interface AdminLoginInputDto {
  username: string; // 1-30 chars, pattern: ^(?!.*\\.\\.)(?!\\.)(?!.*\\.$)[a-zA-Z0-9._]{1,30}$
  password: string; // 6-20 chars, pattern: ^(?=.*[A-ZА-Я])(?=.*\\d)[\\d!$%&*?@A-Za-zА-я]+$
}

export interface AdminLoginOutputDto {
  accessToken: string;
}

export interface AdminSignUpInputDto {
  email: string;
  username: string; // 1-30 chars, pattern: ^(?!.*\\.\\.)(?!\\.)(?!.*\\.$)[a-zA-Z0-9._]{1,30}$
  password: string; // 6-20 chars, pattern: ^(?=.*[A-ZА-Я])(?=.*\\d)[\\d!$%&*?@A-Za-zА-я]+$
}

export interface AdminAuthMeOutputDto {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

// ====== ADMIN 2FA ======

export interface AdminLogin2faFakeInputDto {
  code: number; // 6-значный код (100000-999999)
}

// ====== ADMIN BLOGGER MANAGEMENT ======

// GET /admin/blogger - Query Parameters
export interface AdminGetBloggersQuery {
  page?: number; // default: 1
  size?: number; // default: 50
  sortDirection?: "asc" | "desc"; // default: 'desc'
  sortField?: "createdAt"; // default: 'createdAt'
  username?: string; // поиск по username соцсетей
  socialType?: ApiSocialType;
  gender?: ApiGender;
  topics?: number[]; // ID тем
  restrictedTopics?: number[]; // ID запрещённых тем
  subCountFrom?: number;
  subCountTo?: number;
  postPriceFrom?: number;
  postPriceTo?: number;
  storyPriceFrom?: number;
  storyPriceTo?: number;
  integrationPriceFrom?: number;
  integrationPriceTo?: number;
  isBarterAvailable?: boolean;
  isMartRegistry?: boolean;
  isHidden?: boolean;
  verificationStatus?: ApiVerificationStatus;
}

// GET /admin/blogger - Response
export interface AdminGetBloggersResponse {
  totalCount: number;
  pagesCount: number;
  page: number;
  size: number;
  items: AdminGetBloggerOutputDto[];
}

export interface AdminGetBloggerSocialOutputDto {
  id: number;
  title: string | null;
  type: ApiSocialType;
  avatarUrl: string | null;
  username: string;
  externalId: string | null;
  subscribers: string | null; // BigInt as string
  createdAt: string; // ISO string
  updatedAt: string | null; // ISO string
}

export interface AdminGetBloggerOutputDto {
  id: number;
  name: string | null;
  lastName: string | null;
  userId: string | null;
  status: ApiVerificationStatus; // NEW, APPROVED, REJECTED, MODERATION
  isHidden: boolean; // НОВОЕ ПОЛЕ для видимости
  social: AdminGetBloggerSocialOutputDto[];
  createdAt: string; // ISO string
  updatedAt: string | null; // ISO string
}

// Расширенный тип для админки с информацией о поле
export interface AdminBloggerWithGender extends AdminGetBloggerOutputDto {
  genderType: ApiGender | null; // Получено через публичный API
}

// GET /admin/blogger/stats - Response
export interface AdminGetBloggersStatsOutputDto {
  totalBloggersCount: number;
  totalApprovedBloggersCount: number;
  totalVisibleBloggersCount: number;
  totalModerationLinkRequestsCount: number;
}

// POST /admin/blogger - Request
export interface AdminCreateBloggerInputDto {
  username: string; // Instagram username (1-30 chars, pattern validation)
}

// PUT /admin/blogger/{id} - Request (тот же что и BloggerUpdateProfileInputDto)
// PATCH /admin/blogger/visibility/{id} - Request (пустое тело, 204 No Content)

// PUT /admin/blogger/social-price/{id} - Request (тот же что и BloggerUpdateSocialPriceInputDto)

// POST /admin/blogger/link/TG/{id} - Request (тот же что и BloggerLinkMediaTgRequestInputDto)
// POST /admin/blogger/link/YT/{id} - Request (тот же что и BloggerLinkMediaYtRequestInputDto)

// ====== CLIENT AUTH ======

export interface JwtAppMetadata {
  provider: string;
  providers: string[];
}

export interface JwtUserMetadata {
  email: string;
  email_verified?: boolean; // Сделаем опциональным
  phone_verified?: boolean; // Сделаем опциональным
  sub: string;
}

export interface JwtAmr {
  method: string;
  timestamp: number;
}

export interface ClientBloggerInfo {
  id: number;
  username: string; // Social IG account username
  name: string | null;
  lastName: string | null;
  createdAt: string;
  updatedAt: string;
  verificationStatus: ApiVerificationStatus; // Обновлено: используем ApiVerificationStatus
}

// НОВОЕ ПОЛЕ: Информация о последнем запросе на связывание
export interface ClientLinkRequestInfo {
  id: number;
  bloggerId: number;
  username: string; // Social IG account username
  status: LinkRequestStatus;
  createdAt: string;
  finishAt: string | null;
}

export interface ClientAuthMeOutputDto {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  email: string;
  phone: string;
  app_metadata: JwtAppMetadata;
  user_metadata: JwtUserMetadata;
  role: string;
  aal: string;
  amr: JwtAmr[];
  session_id: string;
  is_anonymous: boolean;
  blogger: ClientBloggerInfo | null;
  lastLinkRequest: ClientLinkRequestInfo | null; // НОВОЕ ПОЛЕ
}

// ====== CLIENT BLOGGER LINK ======

export interface ClientLinkToBloggerInputDto {
  username: string; // Instagram username
}

// ====== BLOGGER LINK SOCIAL MEDIA ======

export interface BloggerLinkMediaIgRequestInputDto {
  username: string; // 1-30 chars, pattern: ^(?!.*\\.\\.)(?!\\.)(?!.*\\.$)[a-zA-Z0-9._]{1,30}$
}

export interface BloggerLinkMediaYtRequestInputDto {
  channel: string; // 3-100 chars, YouTube URL or handle
}

export interface BloggerLinkMediaTgRequestInputDto {
  username: string; // 3-33 chars, pattern: ^[a-zA-Z0-9_]{3,33}$
}

// ====== TOPICS ======

export interface TopicsOutputDto {
  id: number;
  name: string;
  isRestricted: boolean;
  createdAt: string; // ISO date string
}

// Для обратной совместимости
export interface TopicOutputDto {
  id: number;
  name: string;
  isTopicRestricted: boolean;
}

// ====== ADMIN TOPICS MANAGEMENT ======

export interface AdminCreateTopicInputDto {
  name: string; // 2-40 символов
  isRestricted: boolean;
}

export interface AdminUpdateTopicInputDto {
  name: string; // 2-40 символов
  isRestricted: boolean;
}

// ====== ADMIN LINK REQUESTS (Backend реализован) ======

export type LinkRequestStatus = "APPROVED" | "REJECTED" | "MODERATION";

export interface AdminGetLinkBloggerClientRequestBloggerSocialAccountOutputDto {
  id: number;
  type: ApiSocialType;
  title: string | null;
  avatarUrl: string | null;
  username: string;
  externalId: string | null;
  subscribers: string | null; // НОВОЕ ПОЛЕ
  createdAt: string; // ISO string
  updatedAt: string | null; // ISO string
}

export interface AdminGetLinkBloggerClientRequestBloggerOutputDto {
  id: number;
  name: string | null;
  userId: string | null;
  socialAccounts: AdminGetLinkBloggerClientRequestBloggerSocialAccountOutputDto[];
  createdAt: string; // ISO string
  updatedAt: string | null; // ISO string
}

export interface AdminGetLinkBloggerClientRequestUserOutputDto {
  id: string;
  email: string | null;
}

export interface AdminGetLinkBloggerClientRequestOutputDto {
  id: number;
  status: LinkRequestStatus;
  blogger: AdminGetLinkBloggerClientRequestBloggerOutputDto;
  user: AdminGetLinkBloggerClientRequestUserOutputDto;
  createdAt: string; // ISO string
  finishAt: string | null; // ISO string
}

export interface GetLinkRequestsParams {
  page?: number;
  size?: number;
  sortDirection?: "asc" | "desc";
  sortField?: "createdAt";
  status?: LinkRequestStatus;
}

// ====== TELEGRAM CLIENT TYPES ======

export interface TgClientLoginInputDto {
  phone: string;
  apiHash: string; // 32 chars
  apiId: number; // 100000-999999999
}

export interface TgClientLoginOutputDto {
  isAuthorized: boolean;
  isVerify: boolean;
}

export interface TgClientConfirmInputDto {
  phone: string;
  code: string; // 1-15 chars
}

export interface TgClientConfirmOutputDto {
  isAuthorized: boolean;
  isVerify: boolean;
}

// ====== INSTAGRAM CLIENT TYPES ======

export interface IgClientLoginInputDto {
  username: string; // 1-30 chars, pattern: ^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9._]{1,30}$
  password: string; // 6-128 chars, pattern: ^[\S]{6,128}$
}

export interface IgClientLoginOutputDto {
  isAuthorized: boolean;
  isVerify: boolean;
}

// ====== SOCIAL MEDIA LINKING TYPES ======

export interface BloggerLinkMediaTgRequestInputDto {
  username: string; // 3-33 chars, pattern: ^[a-zA-Z0-9_]{3,33}$
}

export interface BloggerLinkMediaYtRequestInputDto {
  channel: string; // 3-100 chars, pattern for YouTube channel URL or username
}

export interface BloggerLinkMediaIgRequestInputDto {
  username: string; // 1-30 chars, pattern: ^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9._]{1,30}$
}

// ====== UTILITY FUNCTIONS ======

/**
 * Конвертация строки в число (для больших чисел из API)
 */
export const parseStringNumber = (value: string | null): number | null => {
  if (!value) return null;
  const num = parseInt(value, 10);
  return isNaN(num) ? null : num;
};

/**
 * Форматирование больших чисел для отображения
 * Поддерживает как строки, так и числа
 */
export const formatLargeNumber = (value: string | number | null): string => {
  if (!value) return "-";

  const num = typeof value === "string" ? parseInt(value, 10) : value;
  if (isNaN(num)) return "-";

  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  } else if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }

  return num.toLocaleString();
};

/**
 * Валидация файлов статистики
 */
const SUPPORTED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];

const MAX_FILES = 25;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB в байтах

export const validateStatsFiles = (files: File[]): string | null => {
  if (files.length === 0) {
    return "Выберите хотя бы один файл";
  }

  if (files.length > MAX_FILES) {
    return `Максимум ${MAX_FILES} файлов за раз`;
  }

  for (const file of files) {
    if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
      return `Неподдерживаемый формат файла: ${file.name}`;
    }

    if (file.size > MAX_FILE_SIZE) {
      return `Файл ${file.name} слишком большой. Максимальный размер: 10MB`;
    }
  }

  return null; // Валидация пройдена
};

/**
 * Форматирование статуса верификации с цветами
 */
export const formatVerificationStatus = (
  status: ApiVerificationStatus,
): { label: string; color: string } => {
  const config = {
    NEW: { label: "Новый", color: "blue" },
    APPROVED: { label: "Одобрен", color: "green" },
    REJECTED: { label: "Отклонён", color: "red" },
    MODERATION: { label: "На модерации", color: "yellow" },
  };

  return config[status] || { label: status, color: "gray" };
};

/**
 * Форматирование статуса запроса на связывание
 */
export const formatLinkRequestStatus = (
  status: LinkRequestStatus,
): { label: string; color: string } => {
  const config = {
    APPROVED: { label: "Одобрен", color: "green" },
    REJECTED: { label: "Отклонён", color: "red" },
    MODERATION: { label: "На рассмотрении", color: "yellow" },
  };

  return config[status] || { label: status, color: "gray" };
};

/**
 * Форматирование формата работы
 */
export const formatWorkFormat = (format: ApiWorkFormat): string => {
  const labels = {
    SOLE_PROPRIETOR: "ИП",
    SELF_EMPLOYED: "Самозанятый",
    SERVICE_CONTRACT: "Договор услуг",
    LLC: "ООО",
  };

  return labels[format] || format;
};

/**
 * Форматирование типа пола
 */
export const formatGenderType = (gender: ApiGender): string => {
  const labels = {
    MALE: "Мужской",
    FEMALE: "Женский",
    COUPLE: "Пара",
    PUBLIC_PAGE: "Публичная страница",
  };

  return labels[gender] || gender;
};

// ====== PARSER ACCOUNTS MANAGEMENT ======

export type ParserPlatform = 'INSTAGRAM' | 'TELEGRAM' | 'YOUTUBE' | 'TIKTOK';

// Instagram Session (из swagger)
export interface IgClientSessionsOutputDto {
  id: number;
  username: string;
  isAuthorized: boolean;
  requests: number | null; // Может быть null если запросы не отслеживаются
  lastReset: string | null; // ISO date string, может быть null
  createdAt: string; // ISO date string
}

// Instagram Login Input (из swagger)
export interface IgClientLoginInputDto {
  username: string;
  password: string;
}

// Instagram Login Output (из swagger)
export interface IgClientLoginOutputDto {
  isAuthorized: boolean;
  isVerify: boolean;
}

// Telegram Login Input (из swagger)
export interface TgClientLoginInputDto {
  phone: string;
  apiHash: string;
  apiId: number;
}

// Telegram Login Output (из swagger)
export interface TgClientLoginOutputDto {
  isAuthorized: boolean;
  isVerify: boolean;
}

// Telegram Confirm Input (из swagger)
export interface TgClientConfirmInputDto {
  phone: string;
  code: string;
}

// Telegram Confirm Output (из swagger)
export interface TgClientConfirmOutputDto {
  isAuthorized: boolean;
  isVerify: boolean;
}

// Telegram Session (для будущего API - пока не реализован)
export interface TgClientSessionsOutputDto {
  id: number;
  phone: string;
  isAuthorized: boolean;
  createdAt: string; // ISO date string
}

// Общий тип для UI компонентов
export interface ParserAccount {
  id: number;
  platform: ParserPlatform;
  identifier: string; // username для IG, phone для TG
  isAuthorized: boolean;
  createdAt: string;
  // Дополнительные поля для Instagram
  requests?: number | null;
  lastReset?: string | null;
}

// Типы для запросов к API
export interface GetIgSessionsParams {
  page?: number;
  size?: number;
  isAuthorized?: boolean;
}

export interface IgSessionsResponse {
  totalCount: number;
  pagesCount: number;
  page: number;
  size: number;
  items: IgClientSessionsOutputDto[];
}
