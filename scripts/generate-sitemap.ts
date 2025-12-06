/**
 * Скрипт для генерации динамического sitemap.xml
 * 
 * Этот скрипт получает список всех блогеров из API и генерирует sitemap.xml
 * с их профилями.
 * 
 * Использование:
 *   npm run generate:sitemap
 *   или
 *   tsx scripts/generate-sitemap.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://zorki.pro/api';
const SITE_URL = 'https://zorki.pro';
const SITEMAP_PATH = join(process.cwd(), 'public', 'sitemap.xml');
const MAX_BLOGGERS = 10000; // Максимальное количество блогеров в sitemap (лимит Google - 50,000 URL)

interface Blogger {
  id: number;
  username?: string;
  handle?: string;
  updatedAt?: string;
}

interface PaginatedResponse {
  items: Blogger[];
  totalCount: number;
  pagesCount: number;
  page: number;
}

/**
 * Нормализует username для URL
 */
function normalizeUsername(username: string | undefined): string {
  if (!username) return '';
  return username.toLowerCase().trim();
}

/**
 * Получает всех блогеров из API
 */
async function fetchAllBloggers(): Promise<Blogger[]> {
  const allBloggers: Blogger[] = [];
  let page = 1;
  const pageSize = 100; // Максимальный размер страницы
  
  console.log('📡 Получение списка блогеров из API...');
  
  try {
    while (true) {
      const url = `${API_BASE_URL}/blogger/public?page=${page}&size=${pageSize}`;
      console.log(`   Загрузка страницы ${page}...`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: PaginatedResponse = await response.json();
      
      if (!data.items || data.items.length === 0) {
        break;
      }
      
      allBloggers.push(...data.items);
      console.log(`   Получено ${data.items.length} блогеров (всего: ${allBloggers.length})`);
      
      // Проверяем, есть ли еще страницы
      if (page >= data.pagesCount || allBloggers.length >= MAX_BLOGGERS) {
        break;
      }
      
      page++;
      
      // Небольшая задержка, чтобы не перегружать API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`✅ Всего получено ${allBloggers.length} блогеров`);
    return allBloggers;
  } catch (error) {
    console.error('❌ Ошибка при получении блогеров:', error);
    throw error;
  }
}

/**
 * Генерирует XML для одного URL
 */
function generateUrlEntry(loc: string, lastmod?: string, changefreq: string = 'weekly', priority: string = '0.8'): string {
  const lastmodTag = lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : '';
  return `  <url>\n    <loc>${loc}</loc>\n${lastmodTag}    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
}

/**
 * Генерирует sitemap.xml
 */
function generateSitemap(bloggers: Blogger[]): string {
  const now = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  <!-- Главная страница -->
${generateUrlEntry(`${SITE_URL}/`, now, 'daily', '1.0')}
  
  <!-- Публичные страницы -->
${generateUrlEntry(`${SITE_URL}/login`, now, 'monthly', '0.5')}
${generateUrlEntry(`${SITE_URL}/register`, now, 'monthly', '0.5')}
${generateUrlEntry(`${SITE_URL}/privacy`, now, 'yearly', '0.3')}
${generateUrlEntry(`${SITE_URL}/terms`, now, 'yearly', '0.3')}
  
  <!-- Профили блогеров -->
`;

  // Добавляем профили блогеров
  const uniqueBloggers = new Map<string, Blogger>();
  
  for (const blogger of bloggers) {
    const username = normalizeUsername(blogger.username || blogger.handle);
    if (username && !uniqueBloggers.has(username)) {
      uniqueBloggers.set(username, blogger);
    }
  }
  
  console.log(`📝 Генерация sitemap для ${uniqueBloggers.size} уникальных профилей...`);
  
  for (const [username, blogger] of uniqueBloggers) {
    const lastmod = blogger.updatedAt 
      ? new Date(blogger.updatedAt).toISOString().split('T')[0]
      : now;
    xml += generateUrlEntry(`${SITE_URL}/${username}`, lastmod, 'weekly', '0.8');
  }
  
  xml += `</urlset>`;
  
  return xml;
}

/**
 * Главная функция
 */
async function main() {
  console.log('🚀 Генерация sitemap.xml...\n');
  
  try {
    // Получаем всех блогеров
    const bloggers = await fetchAllBloggers();
    
    if (bloggers.length === 0) {
      console.warn('⚠️  Не найдено блогеров. Будет создан базовый sitemap без профилей.');
    }
    
    // Генерируем sitemap
    const sitemap = generateSitemap(bloggers);
    
    // Сохраняем файл
    writeFileSync(SITEMAP_PATH, sitemap, 'utf-8');
    
    const urlCount = sitemap.match(/<url>/g)?.length || 0;
    console.log(`\n✅ Sitemap успешно сгенерирован!`);
    console.log(`   Файл: ${SITEMAP_PATH}`);
    console.log(`   URL-ов в sitemap: ${urlCount}`);
    console.log(`   Профилей блогеров: ${new Set(bloggers.map(b => normalizeUsername(b.username || b.handle))).size}`);
  } catch (error) {
    console.error('\n❌ Ошибка при генерации sitemap:', error);
    process.exit(1);
  }
}

// Запускаем скрипт
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

export { main };
