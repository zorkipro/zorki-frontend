# Настройка SEO: robots.txt и sitemap.xml

## 📋 Обзор

Проект включает оптимизированные файлы `robots.txt` и `sitemap.xml` для улучшения индексации сайта поисковыми системами.

## 🤖 robots.txt

**Расположение:** `/public/robots.txt`

### Основные функции:

1. **Разрешенные страницы:**
   - Главная страница (`/`)
   - Публичные страницы (login, register, privacy, terms)
   - Профили блогеров (`/:username`)

2. **Запрещенные страницы:**
   - Приватные пользовательские страницы (`/dashboard`, `/profile-setup`, `/profile/edit`)
   - Административные страницы (`/admin/*`)
   - Служебные и тестовые страницы (`/dev-tools`, `/proads`)

3. **Оптимизация для поисковых систем:**
   - Специфичные настройки для Google, Yandex, Bing
   - Настройки для ботов социальных сетей (Facebook, Twitter, LinkedIn)
   - Ограничения для агрессивных ботов (Ahrefs, Semrush)

### Рекомендации по улучшению:

- ✅ Регулярно проверяйте актуальность правил
- ✅ Добавляйте новые приватные страницы в `Disallow`
- ✅ Обновляйте `Crawl-delay` при необходимости

## 🗺️ sitemap.xml

**Расположение:** `/public/sitemap.xml`

### Текущая версия:

Базовый sitemap включает:
- Главную страницу
- Публичные страницы (login, register, privacy, terms)

### Динамическая генерация

Для автоматического добавления профилей блогеров используйте скрипт генерации:

```bash
npm run generate:sitemap
```

**Скрипт:**
- Получает всех блогеров из API (`/blogger/public`)
- Генерирует URL для каждого профиля (`/:username`)
- Обновляет `lastmod` на основе даты обновления блогера
- Сохраняет результат в `/public/sitemap.xml`

### Установка зависимостей для скрипта:

```bash
npm install --save-dev tsx
```

### Автоматизация обновления sitemap:

#### Вариант 1: CI/CD (рекомендуется)

Добавьте в ваш CI/CD pipeline (например, GitHub Actions):

```yaml
# .github/workflows/update-sitemap.yml
name: Update Sitemap
on:
  schedule:
    - cron: '0 2 * * *'  # Каждый день в 2:00 UTC
  workflow_dispatch:  # Ручной запуск

jobs:
  update-sitemap:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run generate:sitemap
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: 'chore: update sitemap'
          file_pattern: 'public/sitemap.xml'
```

#### Вариант 2: Cron на сервере

```bash
# Добавьте в crontab
0 2 * * * cd /path/to/project && npm run generate:sitemap
```

#### Вариант 3: Webhook при обновлении блогеров

Создайте API endpoint, который будет вызывать скрипт при изменении данных блогеров.

## 📊 Мониторинг и проверка

### Проверка robots.txt:

1. **Google Search Console:**
   - Перейдите в раздел "Сканирование" → "Файл robots.txt"
   - Проверьте, что файл доступен и правильно парсится

2. **Yandex Webmaster:**
   - Раздел "Индексирование" → "Файл robots.txt"

3. **Онлайн-валидаторы:**
   - https://www.google.com/webmasters/tools/robots-testing-tool
   - https://yandex.ru/webmaster/tools/robots-txt

### Проверка sitemap.xml:

1. **Google Search Console:**
   - Перейдите в "Sitemaps"
   - Добавьте URL: `https://zorki.pro/sitemap.xml`
   - Проверьте статус индексации

2. **Yandex Webmaster:**
   - Раздел "Индексирование" → "Файлы Sitemap"
   - Добавьте URL sitemap

3. **Валидация XML:**
   - https://www.xml-sitemaps.com/validate-xml-sitemap.html
   - https://validator.w3.org/

### Проверка индексации:

```bash
# Проверка количества проиндексированных страниц в Google
site:zorki.pro

# Проверка конкретной страницы
site:zorki.pro/username
```

## 🚀 Дополнительные улучшения

### 1. Sitemap Index (для больших сайтов)

Если количество URL превышает 50,000, создайте sitemap index:

```xml
<!-- sitemap-index.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://zorki.pro/sitemap-static.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://zorki.pro/sitemap-bloggers.xml</loc>
  </sitemap>
</sitemapindex>
```

### 2. Расширенный sitemap с изображениями

Добавьте изображения профилей блогеров:

```xml
<url>
  <loc>https://zorki.pro/username</loc>
  <image:image>
    <image:loc>https://zorki.pro/avatar.jpg</image:loc>
    <image:title>Имя блогера</image:title>
  </image:image>
</url>
```

### 3. hreflang (для мультиязычности)

Если планируется поддержка нескольких языков:

```xml
<url>
  <loc>https://zorki.pro/</loc>
  <xhtml:link rel="alternate" hreflang="ru" href="https://zorki.pro/"/>
  <xhtml:link rel="alternate" hreflang="en" href="https://zorki.pro/en/"/>
</url>
```

### 4. Structured Data (Schema.org)

Добавьте структурированные данные для лучшего понимания контента поисковыми системами:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Имя блогера",
  "url": "https://zorki.pro/username"
}
```

## 📝 Чеклист для SEO

- [x] robots.txt создан и настроен
- [x] sitemap.xml создан
- [x] Скрипт генерации sitemap готов
- [ ] Sitemap добавлен в Google Search Console
- [ ] Sitemap добавлен в Yandex Webmaster
- [ ] Настроена автоматическая генерация sitemap
- [ ] Проверена валидность XML
- [ ] Проверена доступность файлов
- [ ] Мониторинг индексации настроен

## 🔗 Полезные ссылки

- [Google Search Central - robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Google Search Central - Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Yandex Webmaster - robots.txt](https://yandex.ru/support/webmaster/controlling-robot/robots-txt.html)
- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
