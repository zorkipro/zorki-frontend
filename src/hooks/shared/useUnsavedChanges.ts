/**
 * Hook для отслеживания несохраненных изменений в форме
 * Предупреждает пользователя при попытке покинуть страницу с несохраненными изменениями
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useBeforeUnload } from 'react-router-dom';
import { logger } from '@/utils/logger';

export interface UseUnsavedChangesOptions<T = unknown> {
  /** Текущие данные формы */
  currentData: T;
  /** Начальные данные формы (для сравнения) */
  initialData: T | null;
  /** Включить отслеживание (по умолчанию true) */
  enabled?: boolean;
  /** Сообщение для подтверждения */
  message?: string;
}

/**
 * Hook для отслеживания несохраненных изменений
 *
 * @param options - опции хука
 * @returns объект с флагом hasUnsavedChanges и функциями управления
 *
 * @example
 * const { hasUnsavedChanges, markAsSaved } = useUnsavedChanges({
 *   currentData: formData,
 *   initialData: initialFormData,
 * });
 *
 * // Показать предупреждение если есть изменения
 * if (hasUnsavedChanges) {
 *   // ...
 * }
 *
 * // После сохранения
 * markAsSaved(formData);
 */
export const useUnsavedChanges = <T = unknown>({
  currentData,
  initialData,
  enabled = true,
  message = 'У вас есть несохраненные изменения. Вы уверены, что хотите покинуть страницу?',
}: UseUnsavedChangesOptions<T>) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const savedDataRef = useRef<T | null>(initialData);

  /**
   * Проверяет наличие несохраненных изменений
   */
  const checkForChanges = useCallback(() => {
    if (!enabled || !savedDataRef.current) {
      setHasUnsavedChanges(false);
      return false;
    }

    // Сравниваем JSON для глубокого сравнения
    const currentJSON = JSON.stringify(currentData);
    const savedJSON = JSON.stringify(savedDataRef.current);
    const hasChanges = currentJSON !== savedJSON;

    setHasUnsavedChanges(hasChanges);
    return hasChanges;
  }, [currentData, enabled]);

  /**
   * Помечает текущие данные как сохраненные
   */
  const markAsSaved = useCallback(
    (data?: T) => {
      const dataToSave = data || currentData;
      savedDataRef.current = dataToSave;
      setHasUnsavedChanges(false);
    },
    [currentData]
  );

  /**
   * Сбрасывает отслеживание (например, при переходе на другую страницу)
   */
  const reset = useCallback(() => {
    savedDataRef.current = null;
    setHasUnsavedChanges(false);
  }, []);

  // Проверяем изменения при обновлении данных
  useEffect(() => {
    checkForChanges();
  }, [checkForChanges]);

  // Обновляем начальные данные если они изменились
  useEffect(() => {
    if (initialData && !savedDataRef.current) {
      savedDataRef.current = initialData;
    }
  }, [initialData]);

  // Предупреждение при закрытии вкладки/окна браузера
  useBeforeUnload(
    useCallback(
      (event) => {
        if (hasUnsavedChanges && enabled) {
          event.preventDefault();
          // Современные браузеры не показывают custom message
          return message;
        }
      },
      [hasUnsavedChanges, enabled, message]
    ),
    { capture: true }
  );

  // ПРИМЕЧАНИЕ: useBlocker требует data router (createBrowserRouter)
  // Для BrowserRouter используется только useBeforeUnload (работает при закрытии вкладки)

  return {
    /** Флаг наличия несохраненных изменений */
    hasUnsavedChanges,
    /** Помечает данные как сохраненные */
    markAsSaved,
    /** Сбрасывает отслеживание */
    reset,
    /** Проверяет наличие изменений вручную */
    checkForChanges,
  };
};
