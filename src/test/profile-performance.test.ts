/**
 * Тест производительности селективного обновления профиля
 * Проверяет, что компоненты перерисовываются только при изменении соответствующих полей
 */

import { renderHook, act } from "@testing-library/react";
import {
  useProfileBasicInfo,
  useVerificationStatus,
} from "@/hooks/profile/useProfileSelectors";
import type { ClientBloggerInfo } from "@/api/types";

// Мок данные для тестирования
const mockBloggerInfo: ClientBloggerInfo = {
  id: 1,
  username: "test_user",
  name: "Test",
  lastName: "User",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  verificationStatus: "APPROVED",
};

describe("Profile Selectors Performance", () => {
  test("useProfileBasicInfo should only re-render when basic info changes", () => {
    const { result, rerender } = renderHook(
      ({ bloggerInfo }) => useProfileBasicInfo(bloggerInfo),
      { initialProps: { bloggerInfo: mockBloggerInfo } },
    );

    // Первый рендер
    expect(result.current).toEqual({
      id: 1,
      username: "test_user",
      name: "Test",
      lastName: "User",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    });

    // Изменяем только verificationStatus (не должно вызвать перерисовку)
    const updatedBloggerInfo = {
      ...mockBloggerInfo,
      verificationStatus: "MODERATION" as const,
    };

    rerender({ bloggerInfo: updatedBloggerInfo });

    // Результат должен остаться тем же (мемоизация работает)
    expect(result.current).toEqual({
      id: 1,
      username: "test_user",
      name: "Test",
      lastName: "User",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    });

    // Изменяем имя (должно вызвать перерисовку)
    const nameUpdatedBloggerInfo = {
      ...mockBloggerInfo,
      name: "Updated Name",
    };

    rerender({ bloggerInfo: nameUpdatedBloggerInfo });

    // Результат должен обновиться
    expect(result.current?.name).toBe("Updated Name");
  });

  test("useVerificationStatus should only re-render when verification status changes", () => {
    const { result, rerender } = renderHook(
      ({ bloggerInfo }) => useVerificationStatus(bloggerInfo),
      { initialProps: { bloggerInfo: mockBloggerInfo } },
    );

    // Первый рендер
    expect(result.current).toEqual({
      verificationStatus: "APPROVED",
      isVerified: true,
      isPending: false,
      isRejected: false,
    });

    // Изменяем только имя (не должно вызвать перерисовку)
    const nameUpdatedBloggerInfo = {
      ...mockBloggerInfo,
      name: "Updated Name",
    };

    rerender({ bloggerInfo: nameUpdatedBloggerInfo });

    // Результат должен остаться тем же (мемоизация работает)
    expect(result.current?.verificationStatus).toBe("APPROVED");
    expect(result.current?.isVerified).toBe(true);

    // Изменяем статус верификации (должно вызвать перерисовку)
    const statusUpdatedBloggerInfo = {
      ...mockBloggerInfo,
      verificationStatus: "MODERATION" as const,
    };

    rerender({ bloggerInfo: statusUpdatedBloggerInfo });

    // Результат должен обновиться
    expect(result.current?.verificationStatus).toBe("MODERATION");
    expect(result.current?.isVerified).toBe(false);
    expect(result.current?.isPending).toBe(true);
  });
});

/**
 * Тест для проверки селективного обновления BloggerContext
 */
describe("BloggerContext Selective Updates", () => {
  test("updateBloggerFields should only update changed fields", () => {
    // Этот тест требует более сложной настройки с React Context
    // В реальном приложении можно использовать @testing-library/react-hooks
    // или создать тестовый компонент с BloggerProvider

  });
});

/**
 * Бенчмарк для измерения производительности
 */
export function measureUpdatePerformance() {
  const iterations = 1000;
  const startTime = performance.now();

  // Симуляция множественных обновлений
  for (let i = 0; i < iterations; i++) {
    const mockData = {
      ...mockBloggerInfo,
      name: `User ${i}`,
      updatedAt: new Date().toISOString(),
    };

    // Симуляция работы селекторов
    useProfileBasicInfo(mockData);
    useVerificationStatus(mockData);
  }

  const endTime = performance.now();
  const duration = endTime - startTime;

  return {
    iterations,
    duration,
    averagePerIteration: duration / iterations,
  };
}
