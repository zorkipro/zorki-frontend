/**
 * CenteredAuthLayout - Layout для страниц авторизации
 *
 * Универсальный layout для Login, Register, ForgotPassword и т.д.
 * Заменяет повторяющийся код центрирования
 */

import React from 'react';
import { Header } from '@/components/layout/Header';

export interface CenteredAuthLayoutProps {
  /** Контент страницы */
  children: React.ReactNode;
  /** Показывать шапку сайта */
  showHeader?: boolean;
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Центрированный layout для авторизации
 *
 * @example
 * ```tsx
 * <CenteredAuthLayout>
 *   <Card>
 *     <CardHeader>...</CardHeader>
 *     <CardContent>...</CardContent>
 *   </Card>
 * </CenteredAuthLayout>
 * ```
 */
export const CenteredAuthLayout: React.FC<CenteredAuthLayoutProps> = ({
  children,
  showHeader = true,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-gradient-subtle flex flex-col ${className}`}>
      {showHeader && <Header />}

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};
