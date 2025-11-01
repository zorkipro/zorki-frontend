# 💻 Технологический стек Zorki7

## 🎯 Обзор

Zorki7 использует современный технологический стек для создания быстрого, масштабируемого и удобного в разработке приложения.

## 🖥️ Frontend (основные технологии)

- **React 18.3.1** - UI библиотека
- **TypeScript 5.8.3** - типизация (0 any типов)
- **Vite 5.4.19** - сборка и dev-сервер
- **Tailwind CSS 3.4.17** - стилизация
- **Supabase 2.57.4** - Backend as a Service

**UI компоненты:**

- **shadcn/ui** - готовые компоненты
- **Radix UI** - примитивы с accessibility
- **Lucide React** - современные иконки
- **Zorki7 UI Kit** - собственная библиотека

## 🔧 Backend & Database

- **NestJS API** - REST API backend (production: https://zorki.pro/api)
- **Supabase 2.57.4** - аутентификация и данные (BaaS)
- **PostgreSQL** - база данных (12 таблиц)
- **JWT токены** - аутентификация (admin/access токены)

## 🔄 State Management & Routing

**Управление состоянием:**

- **React Context** - глобальное состояние
- **React Hook Form** - управление формами
- **Custom Hooks** - переиспользуемая логика
- **Local Storage** - локальное хранение

**Маршрутизация:**

- **React Router DOM** - клиентская маршрутизация
- **Lazy Loading** - ленивая загрузка компонентов
- **Protected Routes** - защищенные маршруты

## ⚡ Performance & UX

**Оптимизация производительности:**

- **Infinite Scroll** - бесконечная прокрутка
- **React.memo** - мемоизация компонентов
- **useMemo/useCallback** - оптимизация вычислений
- **Code Splitting** - разделение кода

**UX особенности:**

- **Responsive Design** - адаптивный дизайн
- **Toast notifications** - уведомления
- **Loading states** - состояния загрузки
- **Error boundaries** - обработка ошибок

## 🛠️ Development Tools

**Сборка и разработка:**

- **Vite** - быстрая сборка
- **TypeScript** - типизация
- **ESLint** - линтинг кода
- **Prettier** - форматирование

**Тестирование:**

- **Playwright 1.55.1** - E2E тесты (9 тестов)
- **Vitest 3.2.4** - Unit тесты и тестовый раннер
- **@testing-library/react 16.3.0** - тестирование React компонентов
- **@testing-library/jest-dom 6.8.0** - дополнительные матчеры для DOM

**Git и качество кода:**

- **Husky** - git hooks
- **lint-staged** - проверка перед коммитом
- **Conventional Commits** - стандартные коммиты

## 🚀 Deployment

**Сборка для продакшена:**

- **Vite Build** - оптимизированная сборка
- **Code Splitting** - разделение кода
- **Tree Shaking** - удаление неиспользуемого кода
- **Minification** - минификация

**Хостинг:**

- **Supabase Hosting** - хостинг приложения
- **PostgreSQL** - база данных
- **CDN** - доставка статических файлов

## 📦 Основные зависимости

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5.8.3",
  "vite": "^5.4.19",
  "tailwindcss": "^3.4.17",
  "@supabase/supabase-js": "^2.57.4",
  "react-router-dom": "^6.30.1",
  "react-hook-form": "^7.61.1",
  "zod": "^3.25.76",
  "lucide-react": "^0.462.0",
  "sonner": "^1.7.4",
  "axios": "^1.12.2",
  "@hookform/resolvers": "^3.10.0",
  "react-helmet-async": "^2.0.5",
  "next-themes": "^0.3.0",
  "yet-another-react-lightbox": "^3.25.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7"
}
```

**Radix UI компоненты:**
- @radix-ui/react-alert-dialog ^1.1.14
- @radix-ui/react-avatar ^1.1.10
- @radix-ui/react-checkbox ^1.3.2
- @radix-ui/react-dialog ^1.1.14
- @radix-ui/react-dropdown-menu ^2.1.15
- @radix-ui/react-label ^2.1.7
- @radix-ui/react-popover ^1.1.14
- @radix-ui/react-scroll-area ^1.2.9
- @radix-ui/react-select ^2.2.5
- @radix-ui/react-separator ^1.1.7
- @radix-ui/react-slot ^1.2.3
- @radix-ui/react-switch ^1.2.5
- @radix-ui/react-tabs ^1.1.12
- @radix-ui/react-toast ^1.2.14
- @radix-ui/react-toggle ^1.1.9
- @radix-ui/react-tooltip ^1.2.7

## 🎯 Готовность к разработке

✅ **Современный стек** - актуальные версии всех технологий  
✅ **Типизация** - полная типизация TypeScript  
✅ **Производительность** - оптимизация и мониторинг  
✅ **Тестирование** - настроенные E2E тесты  
✅ **Качество кода** - ESLint, Prettier, Husky  
✅ **Документация** - Swagger API документация

---

## 📦 Основные devDependencies

- **@playwright/test ^1.55.1** - E2E тестирование
- **vitest ^3.2.4** - Unit тестирование
- **@testing-library/react ^16.3.0** - Тестирование React компонентов
- **@testing-library/jest-dom ^6.8.0** - Дополнительные матчеры для DOM
- **@testing-library/user-event ^14.6.1** - Симуляция пользовательских событий
- **@testing-library/dom ^10.4.1** - Утилиты для тестирования DOM
- **eslint ^9.32.0** - Линтинг кода
- **prettier ^3.6.2** - Форматирование кода
- **typescript-eslint ^8.38.0** - ESLint плагин для TypeScript
- **@eslint/js ^9.32.0** - Конфигурация ESLint
- **eslint-config-prettier ^10.1.8** - Интеграция ESLint и Prettier
- **eslint-plugin-prettier ^5.5.4** - Prettier как ESLint плагин
- **eslint-plugin-react-hooks ^5.2.0** - Правила для React хуков
- **eslint-plugin-react-refresh ^0.4.20** - Поддержка React Fast Refresh
- **husky ^9.1.7** - Git hooks
- **lint-staged ^16.2.3** - Проверка перед коммитом
- **@vitejs/plugin-react-swc ^3.11.0** - Vite плагин для React с SWC
- **@vitest/ui ^3.2.4** - UI для Vitest
- **jsdom ^27.0.0** - DOM окружение для тестов
- **autoprefixer ^10.4.21** - Автоматические префиксы CSS
- **postcss ^8.5.6** - Обработка CSS
- **@types/node ^22.16.5** - TypeScript типы для Node.js
- **@types/react ^18.3.23** - TypeScript типы для React
- **@types/react-dom ^18.3.7** - TypeScript типы для React DOM

---

_Последнее обновление: Январь 2025_
