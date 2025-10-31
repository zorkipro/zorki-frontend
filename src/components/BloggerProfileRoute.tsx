import { useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/ui-kit/components";
import { BloggerProfile } from "@/pages/BloggerProfile";

const NotFound = lazy(() => import("@/pages/NotFound"));

/**
 * Компонент-обертка для маршрута профиля блогера
 * Проверяет валидность username перед обработкой как профиль
 */
export const BloggerProfileRoute = () => {
  const { username } = useParams<{ username: string }>();

  // Список зарезервированных путей, которые не должны обрабатываться как username
  const reservedPaths = [
    "a",
    "api",
    "admin",
    "login",
    "register",
    "dashboard",
    "profile",
    "terms",
    "privacy",
    "dev-tools",
    "forgot-password",
    "email-confirmation",
    "profile-setup",
  ];

  // Проверяем, является ли путь зарезервированным
  if (!username || reservedPaths.includes(username.toLowerCase())) {
    return (
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <NotFound />
      </Suspense>
    );
  }

  // Проверяем минимальную длину username
  // Если это очень короткий путь (1-2 символа и не является валидным username), это ошибка
  // Instagram usernames должны быть минимум 1 символ, но в реальности обычно длиннее
  // Для безопасности блокируем очень короткие пути (1 символ) и зарезервированные
  if (username.length < 2) {
    return (
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <NotFound />
      </Suspense>
    );
  }

  return <BloggerProfile />;
};

