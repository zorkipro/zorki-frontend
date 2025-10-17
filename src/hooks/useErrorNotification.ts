// ============================================
// Error Notification Hook
// ============================================
// Хук для управления уведомлениями об ошибках

import { useState } from 'react';

/**
 * Хук для управления уведомлениями об ошибках
 */
export const useErrorNotification = () => {
  const [error, setError] = useState<unknown | null>(null);

  const showError = (message: unknown) => {
    setError(message);
  };

  const dismissError = () => {
    setError(null);
  };

  return {
    error,
    showError,
    dismissError,
  };
};
