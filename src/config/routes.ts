/**
 * Константы маршрутов приложения
 *
 * Центральное место для всех путей приложения.
 * Использовать вместо хардкода строк в компонентах.
 *
 * @example
 * import { ROUTES } from '@/config/routes';
 * navigate(ROUTES.AUTH.LOGIN);
 */

/**
 * Все маршруты приложения
 */
export const ROUTES = {
  /** Главная страница */
  HOME: '/',

  /** Маршруты аутентификации */
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    EMAIL_CONFIRMATION: '/email-confirmation',
    FORGOT_PASSWORD: '/forgot-password',
  },

  /** Маршруты профиля */
  PROFILE: {
    /** Первичная настройка профиля */
    SETUP: '/profile-setup',
    /** Редактирование профиля */
    EDIT: '/profile/edit',
    /** Просмотр профиля (с параметром :id) */
    VIEW: '/profile/:id',
    /** Публичный профиль блогера */
    BLOGGER: '/blogger/:id',
  },

  /** Дашборд пользователя */
  DASHBOARD: '/dashboard',

  /** Административные маршруты */
  ADMIN: {
    LOGIN: '/admin/login',
    TWO_FACTOR: '/admin/2fa',
    DASHBOARD: '/admin/dashboard',
    BLOGGERS: '/admin/bloggers',
    BLOGGER_EDITOR: '/admin/blogger/:id/edit',
    LINK_REQUESTS: '/admin/link-requests',
  },

  /** Статические страницы */
  STATIC: {
    PRIVACY_POLICY: '/privacy-policy',
    TERMS_OF_SERVICE: '/terms-of-service',
    NOT_FOUND: '/404',
  },
} as const;

/**
 * Страницы, на которых НЕ нужно проверять профиль
 * Используется в ProfileChecker для пропуска проверки
 */
export const AUTH_PAGES = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
  ROUTES.AUTH.EMAIL_CONFIRMATION,
  ROUTES.AUTH.FORGOT_PASSWORD,
  ROUTES.PROFILE.SETUP,
] as const;

/**
 * Публичные страницы (доступны без авторизации)
 */
export const PUBLIC_PAGES = [
  ROUTES.HOME,
  ...AUTH_PAGES,
  ROUTES.STATIC.PRIVACY_POLICY,
  ROUTES.STATIC.TERMS_OF_SERVICE,
  ROUTES.STATIC.NOT_FOUND,
] as const;

/**
 * Административные страницы (требуют админ-токен)
 */
export const ADMIN_PAGES = [
  ROUTES.ADMIN.LOGIN,
  ROUTES.ADMIN.TWO_FACTOR,
  ROUTES.ADMIN.DASHBOARD,
  ROUTES.ADMIN.BLOGGERS,
  ROUTES.ADMIN.BLOGGER_EDITOR,
  ROUTES.ADMIN.LINK_REQUESTS,
] as const;

/**
 * Защищенные страницы (требуют авторизацию)
 */
export const PROTECTED_PAGES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE.EDIT,
  ROUTES.PROFILE.SETUP,
] as const;

/**
 * Генерация пути для просмотра профиля блогера
 */
export function getBloggerProfilePath(bloggerId: string | number): string {
  return ROUTES.PROFILE.BLOGGER.replace(':id', bloggerId.toString());
}

/**
 * Генерация пути для редактирования блогера (админ)
 */
export function getAdminBloggerEditorPath(bloggerId: string | number): string {
  return ROUTES.ADMIN.BLOGGER_EDITOR.replace(':id', bloggerId.toString());
}

/**
 * Проверка, является ли путь страницей авторизации
 */
export function isAuthPage(pathname: string): boolean {
  return AUTH_PAGES.some((page) => pathname === page);
}

/**
 * Проверка, является ли путь публичной страницей
 */
export function isPublicPage(pathname: string): boolean {
  return PUBLIC_PAGES.some((page) => pathname === page);
}

/**
 * Проверка, является ли путь административной страницей
 */
export function isAdminPage(pathname: string): boolean {
  return pathname.startsWith('/admin');
}

/**
 * Проверка, требуется ли для страницы авторизация
 */
export function requiresAuth(pathname: string): boolean {
  return !isPublicPage(pathname);
}
