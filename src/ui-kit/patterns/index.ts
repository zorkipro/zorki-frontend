/**
 * PATTERNS - Готовые паттерны (Organisms)
 *
 * Сложные, готовые к использованию паттерны
 * Комбинации компонентов для решения конкретных задач
 */

// ============================================================================
// PROFILE COMPONENTS - Компоненты профиля
// ============================================================================
export { ProfileHeader } from "@/components/profile/ProfileHeader";
export { PlatformStatsRenderer } from "@/components/profile/PlatformStatsRenderer";
export { CategorySelector } from "@/components/profile/CategorySelector";
export { RestrictedTopicsSelector } from "@/components/profile/RestrictedTopicsSelector";
export { ScreenshotDisplay } from "@/components/profile/ScreenshotDisplay";
export { ScreenshotManagement } from "@/components/profile/ScreenshotManagement";
export { PlatformManagement } from "@/components/profile/PlatformManagement";
export { BloggerInfo } from "@/components/profile/BloggerInfo";
export { VerificationNotice } from "@/components/profile/VerificationNotice";

// Profile organisms
export { PlatformProfileForm } from "@/components/profile/organisms/PlatformProfileForm";
export { PriceListEditor } from "@/components/profile/organisms/PriceListEditor";
export { PricingSection } from "@/components/profile/organisms/PricingSection";

// ============================================================================
// LAYOUT COMPONENTS - Layout компоненты
// ============================================================================
export { Header } from "@/components/layout/Header";

// ============================================================================
// BLOGGER COMPONENTS - Компоненты для блогеров
// ============================================================================
export { BloggerTable } from "@/components/bloggers/BloggerTable";
export { BloggerProfileSkeleton } from "@/components/bloggers/BloggerProfileSkeleton";

// ============================================================================
// FILTER COMPONENTS - Компоненты фильтров
// ============================================================================
export { FilterSidebar } from "@/components/filters/FilterSidebar";

// ============================================================================
// ADMIN COMPONENTS - Админ компоненты
// ============================================================================

// ============================================================================
// UTILITY COMPONENTS - Утилитарные компоненты
// ============================================================================
export { ErrorBoundary } from "@/components/ErrorBoundary";
export { ProtectedRoute } from "@/components/ProtectedRoute";
export { ProfileChecker } from "@/components/ProfileChecker";
export { default as SEOHead } from "@/components/SEO/SEOHead";

// ============================================================================
// ICONS - Иконки
// ============================================================================
export {
  getPlatformIcon,
  getPlatformName,
} from "@/components/icons/PlatformIcons";

// ============================================================================
// ERROR PAGES - Страницы ошибок
// ============================================================================
export { NotFoundPage, ErrorPage, UnauthorizedPage } from "./error-pages";
export type {
  NotFoundPageProps,
  ErrorPageProps,
  UnauthorizedPageProps,
} from "./error-pages";
