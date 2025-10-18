/**
 * LAYOUTS - Layout компоненты (Templates)
 *
 * Шаблоны страниц и layout структуры
 * Используются как основа для создания новых страниц
 *
 * Примечание: Layouts реализованы как утилиты в отдельных файлах
 * Используйте их напрямую для создания структуры страниц
 */

import React from "react";

// ============================================================================
// ТИПЫ LAYOUTS
// ============================================================================

/**
 * Базовый тип для layout с children
 */
export type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Layout с боковой панелью
 */
export type SidebarLayoutProps = LayoutProps & {
  sidebar: React.ReactNode;
  sidebarPosition?: "left" | "right";
};

/**
 * Grid layout для карточек
 */
export type GridLayoutProps = LayoutProps & {
  cols?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number;
};

/**
 * Dashboard layout
 */
export type DashboardLayoutProps = LayoutProps & {
  header?: React.ReactNode;
  stats?: React.ReactNode;
};

// ============================================================================
// УТИЛИТЫ ДЛЯ СОЗДАНИЯ LAYOUTS
// ============================================================================

/**
 * Утилита для создания Layout компонентов
 * Используйте эти паттерны для создания своих layout'ов
 */
export const layoutPatterns = {
  /**
   * MainLayout - Основной layout с шапкой
   *
   * @example
   * ```tsx
   * const MyPage = () => (
   *   <div className="min-h-screen bg-background">
   *     <Header />
   *     <main>{children}</main>
   *   </div>
   * );
   * ```
   */
  main: "min-h-screen bg-background",

  /**
   * ContainerLayout - Container с ограниченной шириной
   *
   * @example
   * ```tsx
   * <div className="container mx-auto px-4 py-8">
   *   {children}
   * </div>
   * ```
   */
  container: "container mx-auto px-4 py-8",

  /**
   * CenteredLayout - Центрированный layout
   *
   * @example
   * ```tsx
   * <div className="min-h-screen flex items-center justify-center">
   *   <div className="w-full max-w-md p-6">
   *     {children}
   *   </div>
   * </div>
   * ```
   */
  centered: "min-h-screen flex items-center justify-center",
  centeredInner: "w-full max-w-md p-6",

  /**
   * SidebarLayout - Layout с боковой панелью
   *
   * @example
   * ```tsx
   * <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
   *   <aside className="lg:col-span-1">{sidebar}</aside>
   *   <main className="lg:col-span-3">{children}</main>
   * </div>
   * ```
   */
  sidebarContainer: "grid grid-cols-1 lg:grid-cols-4 gap-8",
  sidebarAside: "lg:col-span-1",
  sidebarMain: "lg:col-span-3",

  /**
   * GridLayout - Grid для карточек
   *
   * @example
   * ```tsx
   * <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
   *   {items.map(item => <Card key={item.id} />)}
   * </div>
   * ```
   */
  grid: {
    cols1: "grid grid-cols-1 gap-6",
    cols2: "grid grid-cols-1 md:grid-cols-2 gap-6",
    cols3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    cols4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
  },

  /**
   * DashboardLayout - Layout для dashboard
   *
   * @example
   * ```tsx
   * <div className="space-y-8">
   *   <div className="mb-8">{header}</div>
   *   <div className="mb-8">{stats}</div>
   *   <div>{children}</div>
   * </div>
   * ```
   */
  dashboard: "space-y-8",
  dashboardSection: "mb-8",
} as const;

// Экспорт для удобства
export const layouts = layoutPatterns;
