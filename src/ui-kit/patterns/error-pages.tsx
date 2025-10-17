/**
 * ERROR PAGES - Готовые страницы ошибок
 *
 * Компоненты для отображения стандартных страниц ошибок
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

/**
 * NotFoundPage - Страница 404
 *
 * @example
 * ```tsx
 * <NotFoundPage
 *   title="Страница не найдена"
 *   message="Запрашиваемая страница не существует"
 *   onHomeClick={() => navigate('/')}
 *   onBackClick={() => navigate(-1)}
 * />
 * ```
 */
export interface NotFoundPageProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  onHomeClick?: () => void;
  onBackClick?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  title = '404 - Страница не найдена',
  message = 'К сожалению, запрашиваемая страница не существует',
  showHomeButton = true,
  showBackButton = true,
  onHomeClick,
  onBackClick,
}) => {
  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      window.location.href = '/';
    }
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold">404</CardTitle>
          <CardDescription className="text-lg">{title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">{message}</p>
          <div className="flex flex-col gap-2">
            {showHomeButton && (
              <Button onClick={handleHomeClick} className="w-full">
                <Home className="w-4 h-4 mr-2" />
                На главную
              </Button>
            )}
            {showBackButton && (
              <Button variant="outline" onClick={handleBackClick} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * ErrorPage - Общая страница ошибки
 *
 * @example
 * ```tsx
 * <ErrorPage
 *   title="Что-то пошло не так"
 *   message="Произошла непредвиденная ошибка"
 *   error={error}
 *   onRetry={() => handleRetry()}
 * />
 * ```
 */
export interface ErrorPageProps {
  title?: string;
  message?: string;
  error?: Error | string;
  showError?: boolean;
  showRetryButton?: boolean;
  showHomeButton?: boolean;
  onRetry?: () => void;
  onHomeClick?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  title = 'Ошибка',
  message = 'Произошла непредвиденная ошибка',
  error,
  showError = false,
  showRetryButton = true,
  showHomeButton = true,
  onRetry,
  onHomeClick,
}) => {
  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      window.location.href = '/';
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showError && errorMessage && (
            <div className="p-3 bg-destructive/10 rounded-lg">
              <p className="text-sm text-destructive font-mono break-all">{errorMessage}</p>
            </div>
          )}
          <div className="flex flex-col gap-2">
            {showRetryButton && (
              <Button onClick={handleRetry} className="w-full">
                Попробовать снова
              </Button>
            )}
            {showHomeButton && (
              <Button variant="outline" onClick={handleHomeClick} className="w-full">
                <Home className="w-4 h-4 mr-2" />
                На главную
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * UnauthorizedPage - Страница "Нет доступа"
 *
 * @example
 * ```tsx
 * <UnauthorizedPage
 *   message="Для доступа к этой странице требуется авторизация"
 *   onLoginClick={() => navigate('/login')}
 * />
 * ```
 */
export interface UnauthorizedPageProps {
  title?: string;
  message?: string;
  showLoginButton?: boolean;
  showHomeButton?: boolean;
  onLoginClick?: () => void;
  onHomeClick?: () => void;
}

export const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({
  title = 'Доступ запрещён',
  message = 'У вас нет прав для просмотра этой страницы',
  showLoginButton = true,
  showHomeButton = true,
  onLoginClick,
  onHomeClick,
}) => {
  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      window.location.href = '/login';
    }
  };

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-warning" />
          </div>
          <CardTitle className="text-2xl">403</CardTitle>
          <CardDescription className="text-lg">{title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">{message}</p>
          <div className="flex flex-col gap-2">
            {showLoginButton && (
              <Button onClick={handleLoginClick} className="w-full">
                Войти
              </Button>
            )}
            {showHomeButton && (
              <Button variant="outline" onClick={handleHomeClick} className="w-full">
                <Home className="w-4 h-4 mr-2" />
                На главную
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
