/**
 * Утилиты для парсинга URL социальных платформ
 * Извлекают username/channel из различных форматов URL
 */

/**
 * Извлекает username из Telegram URL
 * 
 * Поддерживаемые форматы:
 * - https://t.me/channel
 * - t.me/channel
 * - @channel
 * - channel
 * 
 * @param url - URL или username Telegram канала
 * @returns username без @ и префиксов
 * 
 * @example
 * extractTelegramUsername('https://t.me/my_channel') // 'my_channel'
 * extractTelegramUsername('@my_channel') // 'my_channel'
 * extractTelegramUsername('my_channel') // 'my_channel'
 */
export function extractTelegramUsername(url: string): string {
  if (!url || typeof url !== 'string') {
    throw new Error('URL должен быть непустой строкой');
  }

  // Убираем пробелы
  const cleanUrl = url.trim();

  let username: string;

  // Если это просто username без @
  if (!cleanUrl.includes('/') && !cleanUrl.includes('@')) {
    username = cleanUrl;
  }
  // Если начинается с @
  else if (cleanUrl.startsWith('@')) {
    username = cleanUrl.slice(1);
  }
  // Парсим URL
  else {
    try {
      // Добавляем протокол если его нет
      const urlWithProtocol = cleanUrl.startsWith('http') 
        ? cleanUrl 
        : `https://${cleanUrl}`;

      const urlObj = new URL(urlWithProtocol);
      
      // Проверяем домен
      if (urlObj.hostname === 't.me') {
        // Извлекаем путь без первого слеша
        username = urlObj.pathname.slice(1);
      } else {
        throw new Error('Неверный домен для Telegram URL');
      }
    } catch (error) {
      throw new Error(`Неверный формат Telegram URL: ${cleanUrl}`);
    }
  }

  // Валидация username согласно Swagger: ^[a-zA-Z0-9_]{3,33}$
  const telegramUsernamePattern = /^[a-zA-Z0-9_]{3,33}$/;
  if (!telegramUsernamePattern.test(username)) {
    throw new Error(`Username "${username}" не соответствует требованиям Telegram (3-33 символа, только буквы, цифры и подчеркивания)`);
  }

  // Дополнительная проверка: username не должен начинаться с цифры
  if (/^\d/.test(username)) {
    throw new Error(`Username "${username}" не может начинаться с цифры`);
  }

  return username;
}

/**
 * Извлекает channel из YouTube URL
 * 
 * Поддерживаемые форматы:
 * - https://youtube.com/@channel
 * - https://youtube.com/c/channel
 * - https://youtube.com/channel/UCxxxxx
 * - https://youtu.be/@channel
 * - youtube.com/@channel
 * - @channel
 * 
 * @param url - URL или handle YouTube канала
 * @returns полный URL для отправки в API
 * 
 * @example
 * extractYoutubeChannel('https://youtube.com/@my_channel') // 'https://youtube.com/@my_channel'
 * extractYoutubeChannel('@my_channel') // '@my_channel'
 */
export function extractYoutubeChannel(url: string): string {
  if (!url || typeof url !== 'string') {
    throw new Error('URL должен быть непустой строкой');
  }

  // Убираем пробелы
  const cleanUrl = url.trim();

  let channel: string;

  // Если это просто handle с @
  if (cleanUrl.startsWith('@') && !cleanUrl.includes('/')) {
    channel = cleanUrl;
  }
  // Если это просто handle без @
  else if (!cleanUrl.includes('/') && !cleanUrl.includes('@')) {
    channel = `@${cleanUrl}`;
  }
  // Парсим URL
  else {
    try {
      // Добавляем протокол если его нет
      const urlWithProtocol = cleanUrl.startsWith('http') 
        ? cleanUrl 
        : `https://${cleanUrl}`;

      const urlObj = new URL(urlWithProtocol);
      
      // Проверяем домены YouTube
      const validHosts = ['youtube.com', 'www.youtube.com', 'youtu.be', 'www.youtu.be'];
      if (!validHosts.includes(urlObj.hostname)) {
        throw new Error('Неверный домен для YouTube URL');
      }

      // Возвращаем полный URL для API
      channel = urlWithProtocol;
    } catch (error) {
      throw new Error(`Неверный формат YouTube URL: ${cleanUrl}`);
    }
  }

  // Валидация channel согласно Swagger: 3-100 chars, pattern for YouTube channel URL or username
  if (channel.length < 3 || channel.length > 100) {
    throw new Error(`Channel "${channel}" должен быть от 3 до 100 символов`);
  }

  return channel;
}

/**
 * Извлекает username из Instagram URL
 * 
 * Поддерживаемые форматы:
 * - https://instagram.com/username
 * - https://www.instagram.com/username
 * - http://instagram.com/username
 * - instagram.com/username
 * - @username
 * - username
 * 
 * @param url - URL или username Instagram аккаунта
 * @returns username без @ и префиксов
 * 
 * @example
 * extractInstagramUsername('https://instagram.com/alina_2kota') // 'alina_2kota'
 * extractInstagramUsername('https://www.instagram.com/alina_2kota/') // 'alina_2kota'
 * extractInstagramUsername('@alina_2kota') // 'alina_2kota'
 * extractInstagramUsername('alina_2kota') // 'alina_2kota'
 */
export function extractInstagramUsername(url: string): string {
  if (!url || typeof url !== 'string') {
    throw new Error('URL должен быть непустой строкой');
  }

  // Убираем пробелы
  const cleanUrl = url.trim();

  let username: string;

  // Если это просто username без @ и без слешей
  if (!cleanUrl.includes('/') && !cleanUrl.includes('@')) {
    username = cleanUrl;
  }
  // Если начинается с @
  else if (cleanUrl.startsWith('@')) {
    username = cleanUrl.slice(1);
  }
  // Парсим URL
  else {
    try {
      // Добавляем протокол если его нет
      const urlWithProtocol = cleanUrl.startsWith('http') 
        ? cleanUrl 
        : `https://${cleanUrl}`;

      const urlObj = new URL(urlWithProtocol);
      
      // Проверяем домен
      const validHosts = ['instagram.com', 'www.instagram.com'];
      if (!validHosts.includes(urlObj.hostname)) {
        throw new Error('Неверный домен для Instagram URL');
      }

      // Извлекаем username из пути
      // Формат: /username или /username/...
      const pathMatch = urlObj.pathname.match(/^\/([^\/\?]+)/);
      if (pathMatch && pathMatch[1]) {
        username = pathMatch[1];
      } else {
        throw new Error('Не удалось извлечь username из Instagram URL');
      }
    } catch (error) {
      // Если это не валидный URL, возможно это просто username
      // Проверяем, не содержит ли строка только валидные символы для username
      const usernamePattern = /^[a-zA-Z0-9._]{1,30}$/;
      if (usernamePattern.test(cleanUrl)) {
        username = cleanUrl;
      } else {
        throw new Error(`Неверный формат Instagram URL: ${cleanUrl}`);
      }
    }
  }

  // Валидация username: Instagram username обычно 1-30 символов, буквы, цифры, точки, подчеркивания
  const instagramUsernamePattern = /^[a-zA-Z0-9._]{1,30}$/;
  if (!instagramUsernamePattern.test(username)) {
    throw new Error(`Username "${username}" не соответствует требованиям Instagram (1-30 символов, только буквы, цифры, точки и подчеркивания)`);
  }

  return username;
}

/**
 * Извлекает username из TikTok URL
 * 
 * Поддерживаемые форматы:
 * - https://www.tiktok.com/@username
 * - https://tiktok.com/@username
 * - tiktok.com/@username
 * - @username
 * - username
 * 
 * @param url - URL или username TikTok аккаунта
 * @returns username без @ и префиксов
 * 
 * @example
 * extractTikTokUsername('https://www.tiktok.com/@my_username') // 'my_username'
 * extractTikTokUsername('@my_username') // 'my_username'
 * extractTikTokUsername('my_username') // 'my_username'
 */
export function extractTikTokUsername(url: string): string {
  if (!url || typeof url !== 'string') {
    throw new Error('URL должен быть непустой строкой');
  }

  // Убираем пробелы
  const cleanUrl = url.trim();

  let username: string;

  // Если это просто username без @
  if (!cleanUrl.includes('/') && !cleanUrl.includes('@')) {
    username = cleanUrl;
  }
  // Если начинается с @
  else if (cleanUrl.startsWith('@')) {
    username = cleanUrl.slice(1);
  }
  // Парсим URL
  else {
    try {
      // Добавляем протокол если его нет
      const urlWithProtocol = cleanUrl.startsWith('http') 
        ? cleanUrl 
        : `https://${cleanUrl}`;

      const urlObj = new URL(urlWithProtocol);
      
      // Проверяем домен
      const validHosts = ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com'];
      if (!validHosts.includes(urlObj.hostname)) {
        throw new Error('Неверный домен для TikTok URL');
      }

      // Извлекаем username из пути
      // Формат: /@username или /@username/...
      const pathMatch = urlObj.pathname.match(/^\/@([^\/]+)/);
      if (pathMatch && pathMatch[1]) {
        username = pathMatch[1];
      } else {
        throw new Error('Не удалось извлечь username из TikTok URL');
      }
    } catch (error) {
      throw new Error(`Неверный формат TikTok URL: ${cleanUrl}`);
    }
  }

  // Валидация username: TikTok username обычно 1-24 символа, буквы, цифры, точки, подчеркивания
  const tiktokUsernamePattern = /^[a-zA-Z0-9._]{1,24}$/;
  if (!tiktokUsernamePattern.test(username)) {
    throw new Error(`Username "${username}" не соответствует требованиям TikTok (1-24 символа, только буквы, цифры, точки и подчеркивания)`);
  }

  return username;
}

/**
 * Валидирует URL для указанной платформы
 * 
 * @param url - URL для валидации
 * @param platform - тип платформы
 * @returns true если URL валидный
 */
export function validatePlatformUrl(url: string, platform: 'telegram' | 'youtube' | 'tiktok' | 'instagram'): boolean {
  try {
    if (platform === 'telegram') {
      extractTelegramUsername(url);
      return true;
    } else if (platform === 'youtube') {
      extractYoutubeChannel(url);
      return true;
    } else if (platform === 'tiktok') {
      extractTikTokUsername(url);
      return true;
    } else if (platform === 'instagram') {
      extractInstagramUsername(url);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Получает отображаемое имя платформы
 * 
 * @param platform - тип платформы
 * @returns локализованное название
 */
export function getPlatformDisplayName(platform: string): string {
  const names: Record<string, string> = {
    telegram: 'Telegram',
    youtube: 'YouTube',
    instagram: 'Instagram',
    tiktok: 'TikTok',
  };
  
  return names[platform] || platform;
}

/**
 * Получает примеры URL для платформы
 * 
 * @param platform - тип платформы
 * @returns массив примеров URL
 */
export function getPlatformUrlExamples(platform: string): string[] {
  const examples: Record<string, string[]> = {
    telegram: [
      'https://t.me/my_channel',
      '@my_channel',
      'my_channel'
    ],
    youtube: [
      'https://youtube.com/@my_channel',
      'https://youtube.com/c/my_channel',
      '@my_channel'
    ],
    instagram: [
      'https://instagram.com/username',
      'https://www.instagram.com/username',
      '@username',
      'username'
    ],
    tiktok: [
      'https://www.tiktok.com/@username',
      'https://tiktok.com/@username',
      '@username',
      'username'
    ],
  };
  
  return examples[platform] || [];
}

/**
 * Получает подсказки для платформы
 * 
 * @param platform - тип платформы
 * @returns массив подсказок
 */
export function getPlatformHints(platform: string): string[] {
  const hints: Record<string, string[]> = {
    telegram: [
      'Используйте только публичные каналы Telegram',
    ],
    youtube: [
      'Используйте только публичные каналы YouTube',
      'Канал должен быть доступен без подписки',
      'Можно использовать полный URL или только @username'
    ],
    tiktok: [
      'Доступны только публичные аккаунты',
    ],
  };
  
  return hints[platform] || [];
}

/**
 * Предлагает альтернативные варианты username для Telegram
 * 
 * @param username - исходный username
 * @returns массив альтернативных вариантов
 */
export function suggestTelegramAlternatives(username: string): string[] {
  const alternatives: string[] = [];
  
  // Если username начинается с цифры, предлагаем варианты
  if (/^\d/.test(username)) {
    alternatives.push(`channel_${username}`);
    alternatives.push(`tg_${username}`);
  }
  
  // Если username слишком короткий, предлагаем варианты
  if (username.length < 5) {
    alternatives.push(`${username}_channel`);
    alternatives.push(`${username}_official`);
  }
  
  // Если username содержит дефисы, предлагаем с подчеркиваниями
  if (username.includes('-')) {
    alternatives.push(username.replace(/-/g, '_'));
  }
  
  return alternatives.slice(0, 3); // Максимум 3 варианта
}
