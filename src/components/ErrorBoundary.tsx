import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui-kit';
import { Button } from '@/ui-kit';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { getErrorMessage } from '@/utils/errorHandler';
import { logger } from '@/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /** Автоматически восстанавливаться через N секунд */
  autoRecoverAfter?: number;
  /** Callback при возникновении ошибки */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Показывать ли кнопку возврата на главную */
  showHomeButton?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorCount: number;
  lastErrorTime?: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private recoveryTimer?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const now = Date.now();
    const { lastErrorTime, errorCount } = this.state;

    // Определяем, является ли это новой ошибкой или повторением
    const isNewError = !lastErrorTime || now - lastErrorTime > 5000;
    const newCount = isNewError ? 1 : errorCount + 1;

    // Логируем ошибку с контекстом
    logger.critical('React Error Boundary caught an error', error, {
      component: 'ErrorBoundary',
      errorCount: newCount,
      componentStack: errorInfo.componentStack,
      isRecurring: !isNewError,
    });

    this.setState({
      hasError: true,
      error,
      errorInfo,
      errorCount: newCount,
      lastErrorTime: now,
    });

    // Вызываем callback если есть
    this.props.onError?.(error, errorInfo);

    // Автоматическое восстановление только если не слишком много ошибок
    if (this.props.autoRecoverAfter && newCount < 3) {
      this.scheduleAutoRecovery();
    }
  }

  componentWillUnmount() {
    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer);
    }
  }

  scheduleAutoRecovery = () => {
    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer);
    }

    logger.debug('Scheduling auto-recovery', {
      component: 'ErrorBoundary',
      delayMs: this.props.autoRecoverAfter,
    });

    this.recoveryTimer = setTimeout(() => {
      logger.info('Auto-recovering from error', {
        component: 'ErrorBoundary',
      });
      this.handleRetry();
    }, this.props.autoRecoverAfter);
  };

  handleRetry = () => {
    logger.info('Manual retry triggered', {
      component: 'ErrorBoundary',
      errorCount: this.state.errorCount,
    });

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });

    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer);
    }
  };

  handleGoHome = () => {
    logger.info('Navigating to home from error state', {
      component: 'ErrorBoundary',
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorCount, errorInfo } = this.state;
      const { autoRecoverAfter, showHomeButton = true } = this.props;

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-subtle">
          <Card className="w-full max-w-lg shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Упс! Что-то пошло не так</CardTitle>
              <CardDescription className="text-base mt-2">
                {errorCount > 2
                  ? 'Похоже, проблема повторяется. Попробуйте обновить страницу или вернуться на главную.'
                  : 'Не волнуйтесь, мы уже знаем об этой проблеме. Попробуйте один из вариантов ниже.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Автовосстановление индикатор */}
              {autoRecoverAfter && errorCount < 3 && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                    ⏱️ Автоматическое восстановление через {autoRecoverAfter / 1000} сек...
                  </p>
                </div>
              )}

              {/* Счетчик повторных ошибок */}
              {errorCount > 1 && (
                <div className="p-2 bg-yellow-50 dark:bg-yellow-950 rounded text-center">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    Ошибка повторилась {errorCount} раз(а)
                  </p>
                </div>
              )}

              {/* Детали ошибки */}
              {error && (
                <details className="text-xs text-muted-foreground">
                  <summary className="cursor-pointer hover:text-foreground transition-colors font-medium">
                    📋 Технические подробности
                  </summary>
                  <div className="mt-2 p-3 bg-muted rounded-lg space-y-2">
                    <div>
                      <p className="font-semibold text-xs mb-1">Ошибка:</p>
                      <pre className="text-xs overflow-auto whitespace-pre-wrap">
                        {error.message}
                      </pre>
                    </div>
                    {error.stack && (
                      <div>
                        <p className="font-semibold text-xs mb-1">Stack trace:</p>
                        <pre className="text-xs overflow-auto max-h-32">{error.stack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Кнопки действий */}
              <div className="flex flex-col gap-2 pt-2">
                <Button onClick={this.handleRetry} className="w-full" variant="default" size="lg">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Попробовать снова
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={() => window.location.reload()} variant="outline" size="default">
                    🔄 Обновить страницу
                  </Button>

                  {showHomeButton && (
                    <Button onClick={this.handleGoHome} variant="outline" size="default">
                      <Home className="w-4 h-4 mr-2" />
                      На главную
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// React Hook version for functional components
export const useErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};
