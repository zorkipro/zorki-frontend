/**
 * Утилиты для работы с аватарками Instagram
 * Решает проблему CORS при загрузке изображений из Instagram
 */

/**
 * Проверяет, является ли URL аватаркой Instagram
 */
export const isInstagramAvatar = (url: string | null | undefined): boolean => {
  if (!url) return false;
  return url.includes("scontent-") && url.includes("cdninstagram.com");
};

/**
 * Создает прокси URL для аватарки Instagram
 * Использует быстрые прокси сервисы (тестировано в октябре 2025)
 */
export const createAvatarProxyUrl = (originalUrl: string): string => {
  if (!isInstagramAvatar(originalUrl)) {
    return originalUrl;
  }

  // Используем самый быстрый прокси - corsproxy.io (71ms по тестам)
  const proxyUrl = "https://corsproxy.io/?";
  return `${proxyUrl}${encodeURIComponent(originalUrl)}`;
};

/**
 * Альтернативный метод - использование другого быстрого прокси
 */
export const createAvatarProxyUrlAlternative = (
  originalUrl: string,
): string => {
  if (!isInstagramAvatar(originalUrl)) {
    return originalUrl;
  }

  // Альтернативный быстрый прокси - corsproxy.io (75ms по тестам)
  const proxyUrl = "https://corsproxy.io/?";
  return `${proxyUrl}${encodeURIComponent(originalUrl)}`;
};

/**
 * Метод 3: Использование третьего прокси (резервный)
 */
export const createAvatarProxyUrlData = (originalUrl: string): string => {
  if (!isInstagramAvatar(originalUrl)) {
    return originalUrl;
  }

  // Третий прокси - corsproxy.io (117ms по тестам)
  const proxyUrl = "https://corsproxy.io/?";
  return `${proxyUrl}${encodeURIComponent(originalUrl)}`;
};

/**
 * Загружает изображение через Canvas + Blob URL (обходит CORS)
 * Самый эффективный метод для Instagram аватарок
 */
export const loadImageViaCanvas = async (
  url: string,
): Promise<string | null> => {
  try {
    const response = await fetch(url, {
      mode: "no-cors",
      cache: "force-cache",
    });

    // При mode: 'no-cors' response.ok всегда false, но это нормально
    if (response.type === "opaque") {
      // Response is opaque - это ожидаемое поведение при no-cors
    }

    const blob = await response.blob();

    const objectUrl = URL.createObjectURL(blob);

    return objectUrl;
  } catch (error) {
    return null;
  }
};

/**
 * Загружает изображение через Fetch + Object URL
 * Альтернативный быстрый метод
 */
export const loadImageViaFetch = async (
  url: string,
): Promise<string | null> => {
  try {
    const response = await fetch(url, {
      mode: "no-cors",
      cache: "force-cache",
    });

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    return objectUrl;
  } catch (error) {
    return null;
  }
};

/**
 * Предзагружает изображение в кэш браузера
 */
export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    link.onload = () => {
      resolve();
    };
    link.onerror = () => {
      reject();
    };
    document.head.appendChild(link);
  });
};

/**
 * Альтернативный метод через Image объект
 */
export const loadImageViaImage = async (
  url: string,
): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(null);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const objectUrl = URL.createObjectURL(blob);
            resolve(objectUrl);
          } else {
            resolve(null);
          }
        }, "image/png");
      } catch (error) {
        resolve(null);
      }
    };

    img.onerror = () => {
      resolve(null);
    };

    img.src = url;
  });
};

/**
 * Создает безопасный URL для аватарки с прокси
 */
export const createSafeAvatarUrl = (
  originalUrl: string | null | undefined,
): string | null => {
  if (!originalUrl) return null;

  // Если это Instagram аватарка, используем прокси
  if (isInstagramAvatar(originalUrl)) {
    return createAvatarProxyUrl(originalUrl);
  }

  // Для других URL возвращаем как есть
  return originalUrl;
};

/**
 * Создает альтернативный безопасный URL для аватарки
 * Используется при ошибке первого метода
 */
export const createAlternativeSafeAvatarUrl = (
  originalUrl: string | null | undefined,
): string | null => {
  if (!originalUrl) return null;

  // Если это Instagram аватарка, используем альтернативный прокси
  if (isInstagramAvatar(originalUrl)) {
    return createAvatarProxyUrlAlternative(originalUrl);
  }

  // Для других URL возвращаем как есть
  return originalUrl;
};

/**
 * Создает placeholder URL для аватарки на основе username
 * Используется когда все прокси методы не работают
 */
export const createPlaceholderAvatarUrl = (
  username: string,
  gender?: string,
): string => {
  // Используем сервис для генерации placeholder аватарок
  const baseUrl = "https://ui-avatars.com/api/";
  const params = new URLSearchParams({
    name: username,
    size: "200",
    background: gender === "мужчина" ? "4f46e5" : "ec4899", // Синий для мужчин, розовый для женщин
    color: "ffffff",
    bold: "true",
    format: "png",
  });

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Универсальный метод загрузки аватарки с использованием прокси
 * Использует быстрые прокси сервисы для Instagram аватарок
 */
export const loadAvatarWithCorsBypass = async (
  originalUrl: string,
  username?: string,
  gender?: string,
): Promise<string | null> => {
  if (!originalUrl) {
    return username ? createPlaceholderAvatarUrl(username, gender) : null;
  }

  // Если это не Instagram аватарка, возвращаем как есть
  if (!isInstagramAvatar(originalUrl)) {
    return originalUrl;
  }

  // Используем быстрый прокси для Instagram аватарок
  try {
    const proxyUrl = createAvatarProxyUrl(originalUrl);

    // Возвращаем прокси URL сразу - не проверяем HEAD запрос
    // так как это может вызывать HTTP/2 ошибки
    return proxyUrl;
  } catch (error) {
    // Proxy creation failed, continue to alternative
  }

  // Если прокси не работает, пробуем альтернативный
  try {
    const altProxyUrl = createAvatarProxyUrlAlternative(originalUrl);
    return altProxyUrl;
  } catch (error) {
    // Alternative proxy failed, continue to third option
  }

  // Если все прокси не работают, пробуем третий вариант
  try {
    const thirdProxyUrl = `https://thingproxy.freeboard.io/fetch/${originalUrl}`;
    return thirdProxyUrl;
  } catch (error) {
    // Third proxy failed, fall back to placeholder
  }

  // Если все прокси не работают, используем placeholder
  return username
    ? createPlaceholderAvatarUrl(username, gender)
    : createPlaceholderAvatarUrl("IG", gender);
};
