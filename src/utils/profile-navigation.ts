/**
 * Утилиты для навигации и валидации профиля блогера
 *
 * Используется в ProfileChecker для определения необходимости редиректа
 * и валидации состояния профиля пользователя.
 */

import type { User } from '@supabase/supabase-js';
import type { ClientBloggerInfo } from '@/api/types';
import { AUTH_PAGES } from '@/config/routes';
import { isApprovedStatus, isRejectedStatus } from '@/config/statuses';
import { logger } from '@/utils/logger';

/**
 * Результат валидации информации блогера
 */
export interface BloggerValidationResult {
  /** Валиден ли профиль */
  isValid: boolean;
  /** Причина невалидности (если isValid = false) */
  reason?: 'no_blogger' | 'no_username' | 'rejected';
  /** Сообщение об ошибке */
  message?: string;
}

/**
 * Проверяет, нужно ли пропустить проверку профиля
 *
 * @param pathname - Текущий путь
 * @param user - Пользователь Supabase
 * @param loading - Флаг загрузки
 * @param bloggerInfoLoading - Флаг загрузки информации о блогере
 * @returns true если проверку нужно пропустить
 *
 * @example
 * if (shouldSkipProfileCheck(pathname, user, loading, bloggerInfoLoading)) {
 *   return; // Не проверяем профиль
 * }
 */
export function shouldSkipProfileCheck(
  pathname: string,
  user: User | null,
  loading: boolean,
  bloggerInfoLoading: boolean
): boolean {
  console.log('🔍 shouldSkipProfileCheck:', {
    pathname,
    hasUser: !!user,
    loading,
    bloggerInfoLoading,
    isAuthPage: AUTH_PAGES.some((page) => pathname === page),
  });

  // Пропускаем если нет пользователя
  if (!user) {
    console.log('⏭️ Skipping: no user');
    return true;
  }

  // Пропускаем если данные загружаются
  if (loading || bloggerInfoLoading) {
    console.log('⏭️ Skipping: still loading');
    return true;
  }

  // Пропускаем на страницах авторизации и настройки профиля
  if (AUTH_PAGES.some((page) => pathname === page)) {
    console.log('⏭️ Skipping: auth page');
    return true;
  }

  console.log('✅ Not skipping: will perform check');
  return false;
}

/**
 * Валидирует информацию о блогере
 * Проверяет наличие обязательных полей и корректность данных
 *
 * @param bloggerInfo - Информация о блогере из API
 * @returns Результат валидации
 *
 * @example
 * const validation = validateBloggerInfo(bloggerInfo);
 * if (!validation.isValid) {
 * }
 */
export function validateBloggerInfo(
  bloggerInfo: ClientBloggerInfo | null
): BloggerValidationResult {
  // Добавляем отладочную информацию
  console.log('🔍 validateBloggerInfo called with:', {
    bloggerInfo,
    hasBloggerInfo: !!bloggerInfo,
    username: bloggerInfo?.username,
    usernameLength: bloggerInfo?.username?.length,
    verificationStatus: bloggerInfo?.verificationStatus,
  });

  // Нет связанного блогера
  if (!bloggerInfo) {
    console.log('❌ No blogger info found');
    return {
      isValid: false,
      reason: 'no_blogger',
      message: 'Блогер не связан с аккаунтом',
    };
  }

  // Нет username (обязательное поле)
  // Проверяем не только на falsy, но и на пустую строку после trim
  const hasValidUsername = bloggerInfo.username && bloggerInfo.username.trim().length > 0;
  console.log('🔍 Username validation:', {
    username: bloggerInfo.username,
    hasValidUsername,
    trimmedLength: bloggerInfo.username?.trim().length,
  });
  
  if (!hasValidUsername) {
    console.log('❌ Invalid username');
    return {
      isValid: false,
      reason: 'no_username',
      message: 'Отсутствует username блогера',
    };
  }

  // Профиль отклонен
  if (isRejectedStatus(bloggerInfo.verificationStatus)) {
    console.log('❌ Profile rejected');
    return {
      isValid: false,
      reason: 'rejected',
      message: 'Профиль блогера отклонен',
    };
  }

  // Если есть username и профиль не отклонен - валидация пройдена
  console.log('✅ Profile validation passed');
  return {
    isValid: true,
  };
}

/**
 * Определяет путь для редиректа на основе состояния блогера
 *
 * @param bloggerInfo - Информация о блогере
 * @param validationResult - Результат валидации
 * @returns Путь для редиректа или null если редирект не нужен
 *
 * @example
 * const redirectPath = determineRedirectPath(bloggerInfo, validation);
 * if (redirectPath) {
 *   navigate(redirectPath);
 * }
 */
export function determineRedirectPath(
  bloggerInfo: ClientBloggerInfo | null,
  validationResult: BloggerValidationResult
): string | null {
  // Если валидация прошла - редирект не нужен
  if (validationResult.isValid) {
    return null;
  }

  // На основе причины невалидности определяем путь
  switch (validationResult.reason) {
    case 'no_blogger':
    case 'no_username':
    case 'rejected':
      return '/profile-setup';

    default:
      return null;
  }
}

/**
 * Проверяет, требуется ли редирект для текущего пользователя
 * Комбинированная функция для удобства использования
 *
 * @param pathname - Текущий путь
 * @param user - Пользователь Supabase
 * @param loading - Флаг загрузки
 * @param bloggerInfo - Информация о блогере
 * @param bloggerInfoLoading - Флаг загрузки информации о блогере
 * @returns Путь для редиректа или null
 *
 * @example
 * const redirectPath = checkProfileRedirect(pathname, user, loading, bloggerInfo, bloggerInfoLoading);
 * if (redirectPath) {
 *   navigate(redirectPath);
 * }
 */
export function checkProfileRedirect(
  pathname: string,
  user: User | null,
  loading: boolean,
  bloggerInfo: ClientBloggerInfo | null,
  bloggerInfoLoading: boolean
): string | null {
  console.log('🔍 checkProfileRedirect called:', {
    pathname,
    hasUser: !!user,
    loading,
    bloggerInfoLoading,
    hasBloggerInfo: !!bloggerInfo,
  });

  // Проверяем, нужно ли пропустить проверку
  if (shouldSkipProfileCheck(pathname, user, loading, bloggerInfoLoading)) {
    console.log('⏭️ Skipping profile check');
    return null;
  }

  // Валидируем информацию о блогере
  const validation = validateBloggerInfo(bloggerInfo);

  // Определяем путь редиректа
  const redirectPath = determineRedirectPath(bloggerInfo, validation);
  
  console.log('🔍 checkProfileRedirect result:', {
    validation,
    redirectPath,
  });

  return redirectPath;
}

/**
 * Проверяет, находится ли блогер на модерации
 * Используется для отображения соответствующих сообщений
 *
 * @param bloggerInfo - Информация о блогере
 * @returns true если блогер на модерации
 */
export function isOnModeration(bloggerInfo: ClientBloggerInfo | null): boolean {
  if (!bloggerInfo) return false;
  return bloggerInfo.verificationStatus === 'MODERATION';
}

/**
 * Получить сообщение для пользователя на основе статуса профиля
 *
 * @param validationResult - Результат валидации
 * @returns Пользовательское сообщение
 */
export function getProfileStatusMessage(validationResult: BloggerValidationResult): string {
  if (validationResult.isValid) {
    return 'Профиль активен';
  }

  switch (validationResult.reason) {
    case 'no_blogger':
      return 'Для продолжения необходимо связать аккаунт с профилем блогера';

    case 'no_username':
      return 'Необходимо указать username блогера';

    case 'rejected':
      return 'Ваш профиль был отклонен. Пожалуйста, свяжитесь с поддержкой';

    default:
      return 'Проверьте статус вашего профиля';
  }
}
