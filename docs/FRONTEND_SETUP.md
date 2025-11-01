# 🚀 Руководство по запуску фронтенда Zorki7

## 📋 Системные требования

### Обязательные требования:

- **Node.js** 18.0+ (рекомендуется LTS версия)
- **npm** 9.0+ или **yarn** 1.22+
- **Git** 2.30+
- **Современный браузер** (Chrome 90+, Firefox 88+, Safari 14+)

### Рекомендуемые инструменты:

- **VS Code** с расширениями:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - Prettier - Code formatter
  - ESLint

## 🛠️ Минимальная установка (быстрый старт)

### Шаг 1: Установка зависимостей

```bash
npm install
```

**Требования:**
- Node.js 18.0+
- npm 9.0+

### Шаг 2: Настройка окружения (опционально)

```bash
cp dev-config.env.example dev-config.env
# Отредактируйте dev-config.env (опционально)
```

> **Важно:** Если у вас нет настроек Supabase, можно пропустить этот шаг - приложение использует значения по умолчанию.

### Шаг 3: Запуск

```bash
npm run dev
```

Готово! Приложение доступно на http://localhost:8080

---

## 📋 Подробная настройка (для разработчиков)

**Основные переменные в `dev-config.env`:**

```env
# Supabase конфигурация
VITE_SUPABASE_URL=https://lyeukzcohzufapmtajcl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Режим разработки
NODE_ENV=development
VITE_NODE_ENV=development
VITE_USE_REMOTE_DB=true
VITE_DEBUG_MODE=true

# Админские учетные данные
VITE_ADMIN_EMAIL=11@gmail.com
VITE_ADMIN_PASSWORD=12345678
```

## 🚀 Запуск приложения

### Способ 1: Стандартный запуск

```bash
# Запуск фронтенда
npm run dev

# Приложение будет доступно по адресу:
# http://localhost:8080
```

### Способ 2: Запуск с переменными окружения

```bash
# Запуск с загрузкой переменных из dev-config.env
npm run dev:env

# Это эквивалентно:
# source dev-config.env && npm run dev
```

### Способ 3: Запуск с Supabase

```bash
# Запуск локального Supabase (если нужно)
npm run supabase:start

# В отдельном терминале запуск фронтенда
npm run dev
```

## 🌐 Доступные адреса

После успешного запуска приложение будет доступно по следующим адресам:

| Сервис              | URL                           | Описание                   |
| ------------------- | ----------------------------- | -------------------------- |
| **Frontend**        | http://localhost:8080         | Основное приложение        |
| **API**             | http://localhost:4000         | Backend API (если запущен) |
| **Supabase Studio** | http://localhost:54323        | Локальная база данных      |
| **Swagger**         | http://localhost:4000/swagger | API документация           |

## 🔧 Конфигурация Vite

### Основные настройки в `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    host: '::', // Доступ со всех интерфейсов
    port: 8080, // Порт разработки
    hmr: {
      overlay: false, // Отключение overlay ошибок
      clientPort: 8080, // Порт для HMR
    },
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

### Изменение порта:

```bash
# Запуск на другом порту
npm run dev -- --port 3000

# Или через переменную окружения
PORT=3000 npm run dev
```

## 🎨 Стилизация и UI

### Tailwind CSS конфигурация

Проект использует настроенную версию Tailwind CSS с кастомными цветами:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
        },
        // ... другие цвета
      },
    },
  },
};
```

### Использование стилей:

```typescript
// Пример компонента с Tailwind
const Button = ({ variant }: { variant: 'primary' | 'secondary' }) => (
  <button className={cn(
    'px-4 py-2 rounded-md font-medium transition-colors',
    variant === 'primary'
      ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
      : 'bg-secondary text-secondary-foreground hover:bg-secondary-hover'
  )}>
    Click me
  </button>
);
```

## 🧪 Тестирование

### Запуск тестов:

```bash
# Unit тесты
npm run test

# E2E тесты с Playwright
npm run test:e2e

# UI тесты
npm run test:ui

# Покрытие кода
npm run test:coverage
```

### Структура тестов:

```
tests/
├── test-login.spec.ts           # Тесты авторизации
├── test-admin-with-auth.spec.ts # Тесты админки
├── test-add-blogger-workflow.spec.ts # Тесты добавления блогеров
└── admin-credentials.ts         # Тестовые учетные данные
```

## 🔍 Отладка

### React DevTools

1. Установите расширение React DevTools в браузере
2. Откройте Developer Tools (F12)
3. Перейдите на вкладку "Components" или "Profiler"

### Логирование в консоли:

```typescript
// Включение детального логирования
localStorage.setItem('debug', 'true');

// Проверка переменных окружения
console.log('Environment:', import.meta.env);
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
```

### Отладка API запросов:

```typescript
// Включение логирования API
const apiClient = new ApiClient(import.meta.env.VITE_API_URL);
apiClient.enableLogging = true;
```

## 🚨 Частые проблемы и решения

### Порт 8080 занят

```bash
npm run dev -- --port 3000
```

### Ошибки зависимостей

```bash
rm -rf node_modules package-lock.json
npm install
```

### Ошибки TypeScript/ESLint

```bash
npm run lint -- --fix
```

### Медленная загрузка

```bash
rm -rf node_modules/.vite
npm run dev
```

## 📦 Сборка для продакшена

### Сборка приложения:

```bash
# Стандартная сборка
npm run build

# Сборка для разработки
npm run build:dev

# Предварительный просмотр сборки
npm run preview
```

### Оптимизация сборки:

```bash
# Анализ размера бандла
npm run build -- --analyze

# Проверка производительности
npm run build -- --report
```

## 🔄 Обновление зависимостей

### Проверка устаревших пакетов:

```bash
# Проверка устаревших зависимостей
npm outdated

# Обновление до последних версий
npm update

# Обновление конкретного пакета
npm install package-name@latest
```

### Обновление Supabase:

```bash
# Обновление Supabase CLI
npm install -g @supabase/cli@latest

# Проверка версии
supabase --version
```

## 📚 Полезные команды

### Разработка:

```bash
# Форматирование кода
npm run format

# Проверка форматирования
npm run format:check

# Линтинг
npm run lint

# Автоисправление линтинга
npm run lint -- --fix
```

### Supabase:

```bash
# Статус Supabase
npm run supabase:status

# Остановка Supabase
npm run supabase:stop

# Сброс базы данных
npm run supabase:reset

# Просмотр логов
npm run supabase:logs
```

## 🎯 Готовность к разработке

После выполнения всех шагов у вас должно быть:

✅ **Установлен Node.js 18+**  
✅ **Установлены все зависимости**  
✅ **Настроены переменные окружения**  
✅ **Запущен фронтенд на http://localhost:8080**  
✅ **Настроены инструменты разработки**  
✅ **Проверена работа тестов**

## 📞 Поддержка

При возникновении проблем:

1. Проверьте системные требования
2. Убедитесь в правильности переменных окружения
3. Проверьте логи в консоли браузера
4. Обратитесь к документации Supabase
5. Создайте issue в репозитории проекта

---

## 📊 Актуальная информация

- **Версия проекта:** 2.0.3
- **Node.js:** 18.0+ (требуется)
- **npm:** 9.0+ (требуется)
- **Порт разработки:** 8080
- **API:** https://zorki.pro/api (через proxy в vite.config.ts)
- **Supabase Dashboard:** http://localhost:54323 (только при локальном запуске Supabase)

---

_Последнее обновление: Январь 2025_
