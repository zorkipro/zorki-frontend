import type { AdminGetBloggerOutputDto } from "@/api/types";

/**
 * Получить отображаемое имя блогера из различных источников
 */
export const getBloggerDisplayName = (
  blogger: AdminGetBloggerOutputDto,
): string => {
  const mainSocial =
    blogger.social.find((s) => s.type === "INSTAGRAM") || blogger.social[0];

  // Берем имя из поля title социального аккаунта, если оно есть
  if (mainSocial?.title && mainSocial.title.trim()) {
    return mainSocial.title.trim();
  }

  if (blogger.name && blogger.name.trim()) {
    return blogger.name.trim();
  }

  if (blogger.lastName && blogger.lastName.trim()) {
    return blogger.lastName.trim();
  }

  if (mainSocial?.username && mainSocial.username.trim()) {
    return mainSocial.username.trim();
  }

  return "Не указано";
};

/**
 * Подготовить данные блогера для отображения
 */
export const prepareBloggerData = (blogger: AdminGetBloggerOutputDto) => {
  const mainSocial =
    blogger.social.find((s) => s.type === "INSTAGRAM") || blogger.social[0];
  const displayName = getBloggerDisplayName(blogger);
  const username = mainSocial?.username || "";
  const subscribers = mainSocial?.subscribers || "0";

  return {
    mainSocial,
    displayName,
    username,
    subscribers,
  };
};
