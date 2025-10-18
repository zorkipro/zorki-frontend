/**
 * Хук для автоматического сохранения черновиков профиля
 *
 * Использует debounce для предотвращения избыточных запросов к API.
 * Сохраняет черновик только после того, как пользователь прекратил редактирование.
 *
 * Следует принципу оптимизации производительности.
 */

import React, { useEffect, useCallback, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import type { EditData } from "@/types/profile";

export interface UseAutoSaveOptions {
  /** Данные формы для сохранения */
  formData: EditData;
  /** Функция сохранения черновика */
  onSave: (data: EditData) => Promise<void>;
  /** Задержка перед сохранением (в мс) */
  delay?: number;
  /** Включено ли автосохранение */
  enabled?: boolean;
}

export interface UseAutoSaveReturn {
  /** Происходит ли сохранение */
  isSaving: boolean;
  /** Последнее время сохранения */
  lastSavedAt: Date | null;
  /** Ручное сохранение */
  saveNow: () => Promise<void>;
}

/**
 * Хук для автоматического сохранения черновиков профиля
 *
 * @param options - Опции автосохранения
 * @returns Состояние и функции управления автосохранением
 *
 * @example
 * const { isSaving, lastSavedAt } = useAutoSave({
 *   formData,
 *   onSave: saveDraft,
 *   delay: 2000,
 *   enabled: true
 * });
 */
export const useAutoSave = ({
  formData,
  onSave,
  delay = 2000,
  enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn => {
  const isSavingRef = useRef(false);
  const lastSavedAtRef = useRef<Date | null>(null);
  const lastSavedDataRef = useRef<EditData | null>(null);

  // Debounce данных формы
  const debouncedFormData = useDebounce(formData, delay);

  /**
   * Проверяет, изменились ли данные с момента последнего сохранения
   */
  const hasChanges = useCallback(
    (current: EditData, previous: EditData | null): boolean => {
      if (!previous) return true;

      // Быстрая проверка через JSON (не идеально, но работает для большинства случаев)
      return JSON.stringify(current) !== JSON.stringify(previous);
    },
    [],
  );

  /**
   * Сохраняет черновик
   */
  const saveDraft = useCallback(
    async (data: EditData) => {
      if (isSavingRef.current) {
        return;
      }

      // Проверяем, есть ли изменения
      if (!hasChanges(data, lastSavedDataRef.current)) {
        return;
      }

      isSavingRef.current = true;
      const startTime = performance.now();

      try {
        await onSave(data);

        lastSavedAtRef.current = new Date();
        lastSavedDataRef.current = data;

        const duration = performance.now() - startTime;
      } catch (error) {
        // Не прокидываем ошибку дальше - автосохранение не должно прерывать работу
      } finally {
        isSavingRef.current = false;
      }
    },
    [onSave, hasChanges],
  );

  /**
   * Ручное сохранение (без debounce)
   */
  const saveNow = useCallback(async () => {
    await saveDraft(formData);
  }, [formData, saveDraft]);

  // Автосохранение при изменении debouncedFormData
  useEffect(() => {
    if (!enabled) {
      return;
    }

    saveDraft(debouncedFormData);
  }, [debouncedFormData, enabled, saveDraft]);

  // Сохранение при размонтировании компонента (если есть несохраненные изменения)
  useEffect(() => {
    return () => {
      if (enabled && hasChanges(formData, lastSavedDataRef.current)) {
        // Используем синхронный метод или beacon API для надежности
        saveDraft(formData);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isSaving: isSavingRef.current,
    lastSavedAt: lastSavedAtRef.current,
    saveNow,
  };
};

/**
 * Форматирует время "назад" (например, "2 минуты назад")
 */
export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "только что";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)
    return `${minutes} ${pluralize(minutes, "минуту", "минуты", "минут")} назад`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24)
    return `${hours} ${pluralize(hours, "час", "часа", "часов")} назад`;

  return date.toLocaleString("ru-RU");
}

/**
 * Склонение русских слов
 */
function pluralize(
  num: number,
  one: string,
  few: string,
  many: string,
): string {
  const mod10 = num % 10;
  const mod100 = num % 100;

  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
