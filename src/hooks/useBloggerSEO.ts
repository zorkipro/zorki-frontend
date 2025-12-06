import { useMemo } from "react";
import type { Blogger } from "@/types/blogger";

/**
 * Разбивает полное имя на части для SEO
 */
function parseName(fullName: string): { firstName: string; lastName: string; allNames: string[] } {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";
  
  // Создаем все варианты имени для SEO
  const allNames: string[] = [fullName];
  if (firstName) allNames.push(firstName);
  if (lastName) allNames.push(lastName);
  if (firstName && lastName) {
    allNames.push(`${lastName} ${firstName}`); // Обратный порядок
  }
  
  return { firstName, lastName, allNames };
}

/**
 * Хук для генерации SEO данных для профиля блогера
 * Оптимизирован для поиска по имени, фамилии и никнейму в Google
 */
export const useBloggerSEO = (blogger: Blogger | null) => {
  return useMemo(() => {
    if (!blogger) {
      return {
        title: "Блогер | Zorki.pro",
        description: "Профиль блогера на платформе Zorki.pro",
        url: "https://zorki.pro",
        noindex: true,
      };
    }

    const displayName = blogger.name || blogger.handle || "Блогер";
    const nameParts = parseName(displayName);
    
    // Получаем все username из всех платформ
    const handleUsername = blogger.handle?.replace("@", "").trim() || "";
    const instagramUsername = blogger.platforms?.instagram?.username?.replace("@", "").trim() || "";
    const tiktokUsername = blogger.platforms?.tiktok?.username?.replace("@", "").trim() || "";
    const youtubeUsername = blogger.platforms?.youtube?.username?.replace("@", "").trim() || "";
    const telegramUsername = blogger.platforms?.telegram?.username?.replace("@", "").trim() || "";
    
    // Основной username для URL (приоритет handle, потом Instagram)
    const username = handleUsername || instagramUsername || tiktokUsername || youtubeUsername || telegramUsername || "";
    const profileUrl = username ? `https://zorki.pro/${username}` : `https://zorki.pro/blogger/${blogger.id}`;
    
    // Собираем все варианты username для SEO
    const allUsernames = [
      handleUsername,
      instagramUsername,
      tiktokUsername,
      youtubeUsername,
      telegramUsername,
    ].filter(Boolean);

    // Определяем основную платформу
    const platforms = Object.keys(blogger.platforms || {});
    const mainPlatform = platforms[0] || "социальных сетях";
    const platformNames: Record<string, string> = {
      instagram: "Instagram",
      tiktok: "TikTok",
      youtube: "YouTube",
      telegram: "Telegram",
    };
    const platformName = platformNames[mainPlatform] || mainPlatform;

    // Форматируем количество подписчиков
    const formatFollowers = (count: number) => {
      if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
      }
      if (count >= 1000) {
        return `${(count / 1000).toFixed(0)}K`;
      }
      return count.toString();
    };

    const followersText = blogger.followers
      ? `${formatFollowers(blogger.followers)} подписчиков`
      : "";

    // Формируем title с разными вариантами имени для максимального покрытия поисковых запросов
    // Включаем: полное имя, имя, фамилию, никнейм
    let seoTitle = displayName;
    
    // Если есть имя и фамилия отдельно - создаем title с обоими вариантами
    if (nameParts.firstName && nameParts.lastName) {
      // Вариант 1: Имя Фамилия - Блогер Беларуси
      seoTitle = `${nameParts.firstName} ${nameParts.lastName} - Блогер Беларуси | Zorki.pro`;
    } else {
      // Если только одно имя - используем его
      seoTitle = `${displayName} - Блогер Беларуси | Zorki.pro`;
    }
    
    // Если есть никнейм и он отличается от имени - добавляем в title
    if (username && !displayName.toLowerCase().includes(username.toLowerCase())) {
      // Добавляем никнейм в скобках для поиска по никнейму
      seoTitle = `${displayName} (@${username}) - Блогер Беларуси | Zorki.pro`;
    }

    // Формируем описание с ВСЕМИ вариантами имени и никнейма
    const descriptionParts: string[] = [];
    
    // Добавляем все варианты имени
    descriptionParts.push(displayName);
    if (nameParts.firstName && nameParts.firstName !== displayName) {
      descriptionParts.push(nameParts.firstName);
    }
    if (nameParts.lastName && nameParts.lastName !== displayName) {
      descriptionParts.push(nameParts.lastName);
    }
    
    // Добавляем никнеймы
    if (username && !displayName.toLowerCase().includes(username.toLowerCase())) {
      descriptionParts.push(`@${username}`);
    }
    
    // Добавляем информацию о платформе и подписчиках
    if (platformName && followersText) {
      descriptionParts.push(`${platformName} блогер с ${followersText}`);
    } else if (platformName) {
      descriptionParts.push(`${platformName} блогер`);
    }
    
    // Добавляем тематику
    if (blogger.category) {
      descriptionParts.push(`Тематика: ${blogger.category}`);
    }
    
    // Добавляем описание
    if (blogger.promoText) {
      const shortPromo = blogger.promoText.length > 80 
        ? blogger.promoText.substring(0, 77) + "..."
        : blogger.promoText;
      descriptionParts.push(shortPromo);
    } else {
      descriptionParts.push("Сотрудничество с брендами на платформе Zorki.pro");
    }

    const description = descriptionParts.join(". ");
    const finalDescription = description.length > 160 ? description.substring(0, 157) + "..." : description;

    // Формируем расширенные ключевые слова со ВСЕМИ вариантами
    const keywords: string[] = [];
    
    // Все варианты имени
    keywords.push(...nameParts.allNames);
    
    // Все никнеймы
    keywords.push(...allUsernames.map(u => `@${u}`));
    keywords.push(...allUsernames);
    
    // Комбинации имени и никнейма
    nameParts.allNames.forEach(name => {
      allUsernames.forEach(u => {
        keywords.push(`${name} ${u}`, `${name} @${u}`);
      });
    });
    
    // Базовые ключевые слова
    keywords.push(
      `${displayName} блогер`,
      `${displayName} инфлюенсер`,
      "блогер беларуси",
      "инфлюенсер беларуси",
    );

    // Платформа
    if (platformName) {
      keywords.push(
        `${platformName} блогер`,
        `${displayName} ${platformName}`,
        `реклама в ${platformName.toLowerCase()}`,
      );
    }

    // Тематика
    if (blogger.category) {
      keywords.push(blogger.category, `${displayName} ${blogger.category}`);
    }

    // Общие
    keywords.push(
      "сотрудничество с блогерами",
      "маркетинг",
      "продвижение",
      "реклама у блогеров",
    );

    // Убираем дубликаты
    const uniqueKeywords = Array.from(new Set(keywords.filter(Boolean)));

    // Определяем изображение для OG
    const ogImage = blogger.avatar 
      ? blogger.avatar.startsWith("http") 
        ? blogger.avatar 
        : `https://zorki.pro${blogger.avatar}`
      : "https://zorki.pro/og-image.jpg";

    // Формируем sameAs для всех платформ
    const sameAs: string[] = [];
    if (instagramUsername) {
      sameAs.push(`https://instagram.com/${instagramUsername}`);
    }
    if (tiktokUsername) {
      sameAs.push(`https://tiktok.com/@${tiktokUsername}`);
    }
    if (youtubeUsername) {
      sameAs.push(`https://youtube.com/@${youtubeUsername}`);
    }
    if (telegramUsername) {
      sameAs.push(`https://t.me/${telegramUsername}`);
    }

    return {
      title: seoTitle,
      description: finalDescription,
      keywords: uniqueKeywords,
      url: profileUrl,
      canonical: profileUrl,
      image: ogImage,
      type: "profile" as const,
      author: displayName,
      tags: uniqueKeywords,
      // Дополнительные данные для Person schema
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      allNames: nameParts.allNames,
      allUsernames,
      sameAs,
      platformName,
      followers: blogger.followers,
      category: blogger.category,
    };
  }, [blogger]);
};
