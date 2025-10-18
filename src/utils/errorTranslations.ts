// Переводы ошибок с бекенда на русский язык

export enum EXCEPTION_KEYS_ENUM {
  /*
   * API errors
   */
  INCORRECT_INPUT_DATA = "error.incorrect_input_data",
  SESSION_NOT_FOUND = "error.session_not_found",
  SESSION_UNAUTHORIZED = "error.session_unauthorized",
  USERNAME_IS_NOT_TG_CHANNEL = "error.username_is_not_tg_channel",
  CAN_NOT_GET_TG_CHANNEL_INFO = "error.can_not_get_tg_channel_info",
  CAN_NOT_GET_YT_CHANNEL_INFO = "error.can_not_get_yt_channel_info",
  CAN_NOT_GET_IG_USER_INFO = "error.can_not_get_ig_user_info",
  BLOGGER_NOT_FOUND = "error.blogger_not_found",
  CHANNEL_NOT_FOUND = "error.channel_not_found",
  USER_NOT_FOUND = "error.user_not_found",
  UNAUTHORIZED = "error.unauthorized",
  CAN_NOT_LOAD_IG_CLIENT = "error.can_not_load_ig_client",
  EMAIL_IS_EXIST = "error.email_is_exist",
  USERNAME_IS_EXIST = "error.username_is_exist",
  ACCOUNT_IS_ALREADY_LINKED = "error.account_is_already_linked",
  REQUEST_HAS_BEEN_SENT = "error.request_has_been_sent",
  REQUEST_NOT_FOUND = "error.request_not_found",
  REQUEST_NOT_UNDER_MODERATION = "error.request_not_under_moderation",
  REQUEST_NOT_BELONG_USER = "error.request_not_belong_user",
  IG_USER_NOT_FOUND_OR_NO_ACTIVE_PARSER_ACC = "error.ig_user_not_found_or_no_active_parser_acc",
  BLOGGER_LINKED_TO_ANOTHER_USER = "error.blogger_linked_to_another_user",
  BLOGGER_NOT_BELONG_USER = "error.blogger_not_belong_user",
  INVALID_PAGE = "error.invalid_page",
  SOCIAL_MEDIA_NOT_FOUND = "error.social_media_not_found",
  /*
   * Input validation errors
   */
  username = "error_input.username",
  password = "error_input.password",
  channel = "error_input.channel",
  phone = "error_input.phone",
  apiHash = "error_input.apiHash",
  apiId = "error_input.apiId",
  email = "error_input.email",
  requestId = "error_input.requestId",
  bloggerId = "error_input.bloggerId",
  name = "error_input.name",
  lastName = "error_input.lastName",
  contactLink = "error_input.contactLink",
  workFormat = "error_input.workFormat",
  genderType = "error_input.genderType",
  isBarterAvailable = "error_input.isBarterAvailable",
  isMartRegistry = "error_input.isMartRegistry",
  topics = "error_input.topics",
  restrictedTopics = "error_input.restrictedTopics",
  type = "error_input.type",
  postPrice = "error_input.postPrice",
  storiesPrice = "error_input.storiesPrice",
  integrationPrice = "error_input.integrationPrice",
  page = "error_input.page",
  size = "error_input.size",
  status = "error_input.status",
  sortField = "error_input.sortField",
  sortDirection = "error_input.sortDirection",
  socialType = "error_input.socialType",
  gender = "error_input.gender",
  subCountTo = "error_input.subCountTo",
  subCountFrom = "error_input.subCountFrom",
  postPriceFrom = "error_input.postPriceFrom",
  postPriceTo = "error_input.postPriceTo",
  storyPriceFrom = "error_input.storyPriceFrom",
  storyPriceTo = "error_input.storyPriceTo",
  integrationPriceFrom = "error_input.integrationPriceFrom",
  integrationPriceTo = "error_input.integrationPriceTo",
  coverageSocialType = "error_input.coverageSocialType",
  coverage = "error_input.coverage",
}

// ============================================
// Error Translations Map
// ============================================

export const ERROR_TRANSLATIONS: Record<string, string> = {
  // API Errors
  [EXCEPTION_KEYS_ENUM.INCORRECT_INPUT_DATA]: "Некорректные входные данные",
  [EXCEPTION_KEYS_ENUM.SESSION_NOT_FOUND]: "Сессия не найдена",
  [EXCEPTION_KEYS_ENUM.SESSION_UNAUTHORIZED]: "Сессия не авторизована",
  [EXCEPTION_KEYS_ENUM.USERNAME_IS_NOT_TG_CHANNEL]:
    "Имя пользователя не является Telegram каналом",
  [EXCEPTION_KEYS_ENUM.CAN_NOT_GET_TG_CHANNEL_INFO]:
    "Не удалось получить информацию о Telegram канале",
  [EXCEPTION_KEYS_ENUM.CAN_NOT_GET_YT_CHANNEL_INFO]:
    "Не удалось получить информацию о YouTube канале",
  [EXCEPTION_KEYS_ENUM.CAN_NOT_GET_IG_USER_INFO]:
    "Не удалось получить информацию о пользователе Instagram",
  [EXCEPTION_KEYS_ENUM.BLOGGER_NOT_FOUND]: "Блогер не найден",
  [EXCEPTION_KEYS_ENUM.CHANNEL_NOT_FOUND]: "Канал не найден",
  [EXCEPTION_KEYS_ENUM.USER_NOT_FOUND]: "Пользователь не найден",
  [EXCEPTION_KEYS_ENUM.UNAUTHORIZED]: "Не авторизован",
  [EXCEPTION_KEYS_ENUM.CAN_NOT_LOAD_IG_CLIENT]:
    "Не удалось загрузить клиент Instagram",
  [EXCEPTION_KEYS_ENUM.EMAIL_IS_EXIST]: "Email уже существует",
  [EXCEPTION_KEYS_ENUM.USERNAME_IS_EXIST]: "Имя пользователя уже существует",
  [EXCEPTION_KEYS_ENUM.ACCOUNT_IS_ALREADY_LINKED]: "Аккаунт уже привязан",
  [EXCEPTION_KEYS_ENUM.REQUEST_HAS_BEEN_SENT]: "Запрос уже отправлен",
  [EXCEPTION_KEYS_ENUM.REQUEST_NOT_FOUND]: "Запрос не найден",
  [EXCEPTION_KEYS_ENUM.REQUEST_NOT_UNDER_MODERATION]: "Запрос не на модерации",
  [EXCEPTION_KEYS_ENUM.REQUEST_NOT_BELONG_USER]:
    "Запрос не принадлежит пользователю",
  [EXCEPTION_KEYS_ENUM.IG_USER_NOT_FOUND_OR_NO_ACTIVE_PARSER_ACC]:
    "Пользователь Instagram не найден или нет активного парсера",
  [EXCEPTION_KEYS_ENUM.BLOGGER_LINKED_TO_ANOTHER_USER]:
    "Блогер привязан к другому пользователю",
  [EXCEPTION_KEYS_ENUM.BLOGGER_NOT_BELONG_USER]:
    "Блогер не принадлежит пользователю",
  [EXCEPTION_KEYS_ENUM.INVALID_PAGE]: "Неверная страница",
  [EXCEPTION_KEYS_ENUM.SOCIAL_MEDIA_NOT_FOUND]: "Социальная сеть не найдена",

  // Input Validation Errors
  [EXCEPTION_KEYS_ENUM.username]: "Некорректное имя пользователя",
  [EXCEPTION_KEYS_ENUM.password]: "Некорректный пароль",
  [EXCEPTION_KEYS_ENUM.channel]: "Некорректный канал",
  [EXCEPTION_KEYS_ENUM.phone]: "Некорректный номер телефона",
  [EXCEPTION_KEYS_ENUM.apiHash]: "Некорректный API хеш",
  [EXCEPTION_KEYS_ENUM.apiId]: "Некорректный API ID",
  [EXCEPTION_KEYS_ENUM.email]: "Некорректный email",
  [EXCEPTION_KEYS_ENUM.requestId]: "Некорректный ID запроса",
  [EXCEPTION_KEYS_ENUM.bloggerId]: "Некорректный ID блогера",
  [EXCEPTION_KEYS_ENUM.name]: "Некорректное имя",
  [EXCEPTION_KEYS_ENUM.lastName]: "Некорректная фамилия",
  [EXCEPTION_KEYS_ENUM.contactLink]: "Некорректная ссылка для связи",
  [EXCEPTION_KEYS_ENUM.workFormat]: "Некорректный формат работы",
  [EXCEPTION_KEYS_ENUM.genderType]: "Некорректный тип пола",
  [EXCEPTION_KEYS_ENUM.isBarterAvailable]:
    "Некорректное значение доступности бартера",
  [EXCEPTION_KEYS_ENUM.isMartRegistry]:
    "Некорректное значение реестра маркетплейса",
  [EXCEPTION_KEYS_ENUM.topics]: "Некорректные темы",
  [EXCEPTION_KEYS_ENUM.restrictedTopics]: "Некорректные ограниченные темы",
  [EXCEPTION_KEYS_ENUM.type]: "Некорректный тип",
  [EXCEPTION_KEYS_ENUM.postPrice]: "Некорректная цена поста",
  [EXCEPTION_KEYS_ENUM.storiesPrice]: "Некорректная цена сторис",
  [EXCEPTION_KEYS_ENUM.integrationPrice]: "Некорректная цена интеграции",
  [EXCEPTION_KEYS_ENUM.page]: "Некорректная страница",
  [EXCEPTION_KEYS_ENUM.size]: "Некорректный размер",
  [EXCEPTION_KEYS_ENUM.status]: "Некорректный статус",
  [EXCEPTION_KEYS_ENUM.sortField]: "Некорректное поле сортировки",
  [EXCEPTION_KEYS_ENUM.sortDirection]: "Некорректное направление сортировки",
  [EXCEPTION_KEYS_ENUM.socialType]: "Некорректный тип социальной сети",
  [EXCEPTION_KEYS_ENUM.gender]: "Некорректный пол",
  [EXCEPTION_KEYS_ENUM.subCountTo]: "Некорректное количество подписчиков (до)",
  [EXCEPTION_KEYS_ENUM.subCountFrom]:
    "Некорректное количество подписчиков (от)",
  [EXCEPTION_KEYS_ENUM.postPriceFrom]: "Некорректная цена поста (от)",
  [EXCEPTION_KEYS_ENUM.postPriceTo]: "Некорректная цена поста (до)",
  [EXCEPTION_KEYS_ENUM.storyPriceFrom]: "Некорректная цена сторис (от)",
  [EXCEPTION_KEYS_ENUM.storyPriceTo]: "Некорректная цена сторис (до)",
  [EXCEPTION_KEYS_ENUM.integrationPriceFrom]:
    "Некорректная цена интеграции (от)",
  [EXCEPTION_KEYS_ENUM.integrationPriceTo]: "Некорректная цена интеграции (до)",
  [EXCEPTION_KEYS_ENUM.coverageSocialType]:
    "Некорректный тип социальной сети для охвата",
  [EXCEPTION_KEYS_ENUM.coverage]: "Некорректный охват",

  // HTTP Status Codes
  "400": "Некорректный запрос",
  "401": "Не авторизован",
  "403": "Доступ запрещен",
  "404": "Не найдено",
  "409": "Конфликт данных",
  "422": "Ошибка валидации",
  "500": "Внутренняя ошибка сервера",
  "502": "Ошибка шлюза",
  "503": "Сервис недоступен",
  "504": "Таймаут шлюза",

  // Common Error Messages
  "Network error": "Ошибка сети",
  "Unknown error": "Неизвестная ошибка",
  "Request failed": "Запрос не выполнен",
  "Server error": "Ошибка сервера",
  "Connection timeout": "Таймаут соединения",
  "Invalid response": "Некорректный ответ",
};

// ============================================
// Error Translation Functions
// ============================================

/**
 * Переводит ошибку на русский язык
 * @param error - строка ошибки или объект ошибки
 * @returns переведенная ошибка на русском языке
 */
export function translateError(error: string | Error | any): string {
  if (!error) {
    return "Неизвестная ошибка";
  }

  let errorMessage = "";

  // Если это строка
  if (typeof error === "string") {
    errorMessage = error;
  }
  // Если это объект Error
  else if (error instanceof Error) {
    errorMessage = error.message;
  }
  // Если это объект с полем message
  else if (error && typeof error === "object" && error.message) {
    errorMessage = error.message;
  }
  // Если это объект с полем errorKey
  else if (error && typeof error === "object" && error.errorKey) {
    errorMessage = error.errorKey;
  }
  // Если это массив ошибок полей
  else if (Array.isArray(error) && error.length > 0) {
    const firstError = error[0];
    if (firstError && typeof firstError === "object") {
      if (firstError.errorKey) {
        errorMessage = firstError.errorKey;
      } else if (firstError.message) {
        errorMessage = firstError.message;
      }
    }
  }
  // Если это число (HTTP статус код)
  else if (typeof error === "number") {
    errorMessage = error.toString();
  } else {
    errorMessage = String(error);
  }

  // Ищем перевод в нашей карте переводов
  const translation = ERROR_TRANSLATIONS[errorMessage];
  if (translation) {
    return translation;
  }

  // Если перевод не найден, возвращаем оригинальное сообщение
  return errorMessage;
}

/**
 * Переводит ошибки полей валидации
 * @param errorFields - массив ошибок полей
 * @returns объект с переведенными ошибками полей
 */
export function translateFieldErrors(
  errorFields: unknown[],
): Record<string, string> {
  const translatedErrors: Record<string, string> = {};

  if (!Array.isArray(errorFields)) {
    return translatedErrors;
  }

  errorFields.forEach((fieldError) => {
    if (fieldError && typeof fieldError === "object") {
      const errorObj = fieldError as Record<string, unknown>;
      const field = errorObj.field || errorObj.property;
      const errorKey = errorObj.errorKey || errorObj.message;

      if (field && errorKey) {
        translatedErrors[String(field)] = translateError(String(errorKey));
      }
    }
  });

  return translatedErrors;
}

/**
 * Получает основное сообщение об ошибке из API ответа
 * @param error - ошибка от API
 * @returns переведенное сообщение об ошибке
 */
export function getMainErrorMessage(error: unknown): string {
  // Если это объект с ошибками
  if (error && typeof error === "object") {
    const errorObj = error as Record<string, unknown>;

    // Если это APIError с полями ошибок
    if (
      errorObj.errorField &&
      Array.isArray(errorObj.errorField) &&
      errorObj.errorField.length > 0
    ) {
      const firstFieldError = errorObj.errorField[0] as Record<string, unknown>;
      if (firstFieldError?.errorKey) {
        return translateError(String(firstFieldError.errorKey));
      }
      if (firstFieldError?.message) {
        return translateError(String(firstFieldError.message));
      }
    }

    // Если есть основное сообщение
    if (errorObj.message) {
      return translateError(String(errorObj.message));
    }
  }

  // Если это строка
  if (typeof error === "string") {
    return translateError(error);
  }

  // Если это число (HTTP статус)
  if (typeof error === "number") {
    return translateError(error.toString());
  }

  return "Неизвестная ошибка";
}

/**
 * Проверяет, является ли ошибка ошибкой валидации
 * @param error - ошибка
 * @returns true если это ошибка валидации
 */
export function isValidationError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const errorObj = error as Record<string, unknown>;
  return (
    errorObj.errorField !== undefined &&
    Array.isArray(errorObj.errorField) &&
    errorObj.errorField.length > 0
  );
}

/**
 * Получает все ошибки валидации полей
 * @param error - ошибка от API
 * @returns объект с ошибками полей
 */
export function getValidationErrors(error: unknown): Record<string, string> {
  if (!isValidationError(error)) {
    return {};
  }

  const errorObj = error as Record<string, unknown>;
  return translateFieldErrors(errorObj.errorField as unknown[]);
}
