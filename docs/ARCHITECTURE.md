# 🏗️ Архитектура Zorki7

## 🎯 Обзор

Zorki7 построен на модульной архитектуре с акцентом на производительность, масштабируемость и удобство разработки.

## 🎯 Ключевые концепции

1. **Модульность** - четкое разделение ответственности (SOLID принципы)
2. **Типизация** - полная типизация TypeScript (0 any типов)
3. **Композиция** - компоненты и хуки переиспользуются
4. **Производительность** - оптимизация через React.memo, useMemo, useCallback
5. **API модульность** - API клиент разбит на независимые модули

## 📁 Структура проекта

```
src/
├── components/     # UI компоненты (99 файлов)
│   ├── admin/      # Компоненты админ-панели
│   ├── auth/       # Компоненты аутентификации
│   ├── blogger-profile/ # Компоненты публичного профиля блогера
│   ├── bloggers/   # Компоненты списка блогеров
│   ├── dashboard/  # Компоненты личного кабинета
│   ├── filters/    # Компоненты фильтрации
│   ├── layout/     # Компоненты макета
│   ├── profile/    # Компоненты редактирования профиля
│   ├── ui/         # Базовые UI компоненты (shadcn/ui)
│   └── ...         # Другие компоненты
├── pages/         # Страницы приложения (19 файлов)
├── hooks/         # React хуки (41 файл)
│   ├── admin/     # Хуки для админ-панели
│   ├── profile/   # Хуки для работы с профилями
│   ├── shared/    # Общие хуки
│   └── dashboard/ # Хуки для личного кабинета
├── api/           # API клиент и типы
│   ├── core/      # Модули API (TokenManager, ResponseHandler, etc.)
│   └── endpoints/ # API endpoints (8 модулей, 56 функций)
├── types/         # TypeScript типы
├── utils/         # Утилиты и хелперы
├── ui-kit/        # Собственная UI библиотека
├── contexts/      # React контексты
├── config/        # Конфигурация
└── integrations/ # Интеграции с внешними сервисами
```

## 📄 Основные страницы (19 страниц)

**Публичные страницы:**

- `Index` (`/`) - главная страница с каталогом блогеров и поиском
- `BloggerProfile` (`/:username`) - публичный профиль блогера
- `TermsOfService` (`/terms`) - условия использования
- `PrivacyPolicy` (`/privacy`) - политика конфиденциальности
- `NotFound` (`*`) - страница 404

**Пользовательские страницы:**

- `Login` (`/login`) - вход в систему
- `Register` (`/register`) - регистрация
- `ForgotPassword` (`/forgot-password`) - восстановление пароля
- `EmailConfirmation` (`/email-confirmation`) - подтверждение email
- `ProfileSetup` (`/profile-setup`) - первичная настройка профиля
- `Dashboard` (`/dashboard`) - личный кабинет пользователя
- `ProfileEditor` (`/profile/edit`) - редактирование профиля блогера

**Админские страницы:**

- `AdminLogin` (`/admin/login`) - вход администратора
- `AdminTwoFactor` (`/admin/2fa`) - двухфакторная аутентификация
- `AdminDashboard` (`/admin/dashboard`) - главная панель админа
- `AdminBloggerEditor` (`/admin/blogger/:id/edit`) - редактор профилей блогеров
- `AdminTopicsManagement` (`/admin/topics`) - управление тематиками
- `ParserAccountsManagement` (`/admin/parser`) - управление парсер-аккаунтами

**Служебные страницы:**

- `DevTools` (`/dev-tools`) - инструменты разработчика

## 🔧 Архитектурные паттерны

### Component Composition Pattern

```typescript
// Композиция компонентов
const BloggerCard = ({ blogger }: { blogger: Blogger }) => (
  <Card>
    <CardHeader>
      <BloggerAvatar blogger={blogger} />
      <BloggerInfo blogger={blogger} />
    </CardHeader>
    <CardContent>
      <BloggerStats blogger={blogger} />
      <BloggerActions blogger={blogger} />
    </CardContent>
  </Card>
);
```

### Custom Hooks Pattern

```typescript
// Переиспользуемая логика
const useBloggers = (filters: FilterState) => {
  const [bloggers, setBloggers] = useState<Blogger[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBloggers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.getBloggers(filters);
      setBloggers(data);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  return { bloggers, loading, refetch: fetchBloggers };
};
```

## 🎣 Система хуков (41 хук)

**Хуки профилей (12 хуков):**

- `useProfileEditor` - главный хук редактора профиля
- `useProfileLoader` - загрузка данных профиля
- `useProfileForm` - управление формой профиля
- `useProfileSaver` - сохранение изменений профиля
- `useProfileData` - данные профиля блогера
- `useProfileDrafts` - работа с черновиками
- `useProfileSelectors` - селекторы для профиля
- `useScreenshotManager` - управление скриншотами
- `useScreenshotLoader` - загрузка скриншотов
- `useScreenshotUploader` - загрузка новых скриншотов
- `useScreenshotCache` - кеширование скриншотов
- `useStatsFileManagement` - управление файлами статистики
- `useAutoSave` - автоматическое сохранение

**Админ хуки (10 хуков):**

- `useAdminDashboard` - главная панель админа
- `useAdminBloggers` - список блогеров
- `useAdminBloggerActions` - CRUD операции с блогерами
- `useAdminBloggerEditor` - редактор блогера
- `useAdminTopics` - управление тематиками
- `useAdminDraftPublisher` - публикация черновиков
- `useAdminStatsFileManagement` - управление файлами статистики
- `useParserAccounts` - парсер-аккаунты
- `useInstagramClient` - клиент Instagram
- `useInstagramClientManager` - менеджер Instagram клиента
- `useInstagramClientStatus` - статус Instagram клиента
- `useTelegramClient` - клиент Telegram

**Общие хуки:**

- `useAuthForm` - формы аутентификации
- `useBloggers` - список блогеров
- `useBloggerProfile` - профиль блогера (публичный)
- `useTopics` - тематики
- `useCategories` - категории
- `useRestrictedTopics` - запрещенные темы
- `useSocialLinking` - связывание социальных сетей
- `useDebounce` - дебаунс для поиска
- `useInfiniteScroll` - бесконечная прокрутка
- `useErrorNotification` - уведомления об ошибках
- `use-toast` - система уведомлений (toast)

**Хуки для работы с ошибками:**

- `useErrorHandler` - обработка ошибок

**Хуки для работы с данными:**

- `useUnsavedChanges` - отслеживание несохраненных изменений
- `useScreenshotUpload` - загрузка скриншотов
- `useDashboardNavigation` - навигация в личном кабинете

## ⚡ Оптимизация производительности

Проект использует несколько техник для оптимизации:

### React.memo
Мемоизация компонентов предотвращает лишние рендеры:
```typescript
export const BloggerCard = React.memo(({ blogger }: { blogger: Blogger }) => {
  return <div>{blogger.name}</div>;
});
```

### useMemo и useCallback
Оптимизация вычислений и функций:
```typescript
const filteredBloggers = useMemo(() => {
  return bloggers.filter(b => b.name.includes(searchQuery));
}, [bloggers, searchQuery]);

const handleSave = useCallback((data) => {
  saveProfile(data);
}, [saveProfile]);
```

### Бесконечный скролл
Оптимизированная загрузка контента с пагинацией (см. `useInfiniteScroll`).

## 🎨 UI/UX архитектура

### Адаптивный дизайн

```typescript
// Breakpoints
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
};

// Условный рендеринг
const ResponsiveLayout = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {bloggers.map(blogger => (
      <BloggerCard key={blogger.id} blogger={blogger} />
    ))}
  </div>
);
```

## 🔌 API архитектура

### Модульная структура

API клиент построен на модульной архитектуре:

```
src/api/
├── client.ts              # Основной API клиент (координация модулей)
├── types.ts               # TypeScript типы
└── core/                  # Core модули (Singleton pattern)
    ├── TokenManager.ts     # Управление токенами (приоритеты)
    ├── ResponseHandler.ts  # Обработка HTTP ответов
    ├── ApiErrorHandler.ts # Обработка ошибок
    └── types.ts            # Типы для модулей
└── endpoints/              # API endpoints (8 модулей, 56 функций)
    ├── admin.ts           # 26 функций - админские операции
    ├── blogger.ts         # 6 функций - публичный API блогеров
    ├── client.ts          # 2 функции - клиентские запросы
    ├── instagram.ts       # 1 функция - Instagram клиент
    ├── social-linking.ts  # 6 функций - связывание соцсетей
    ├── telegram.ts        # 5 функций - Telegram клиент
    ├── topics.ts          # 7 функций - тематики
    └── youtube.ts         # 3 функции - YouTube клиент
```

### Быстрое использование

```typescript
import { apiRequest } from '@/api/client';

// GET запрос
const bloggers = await apiRequest<Blogger[]>('/blogger/public');

// POST запрос с данными
const result = await apiRequest('/blogger/:id', {
  method: 'PUT',
  body: JSON.stringify(data)
});
```

Подробнее: [API_ARCHITECTURE.md](API_ARCHITECTURE.md)

## 🔐 Безопасность и аутентификация

### Система токенов

API клиент использует приоритетную систему токенов:
1. `adminToken` - для админских операций
2. `adminTempToken` - для подтверждения 2FA
3. `accessToken` - основной токен пользователей
4. `supabaseToken` - fallback из Supabase сессии

Токены управляются через `TokenManager` (см. [API_ARCHITECTURE.md](API_ARCHITECTURE.md)).

### Контексты аутентификации

```typescript
// SessionContext - управление сессией
import { useSession } from '@/contexts/SessionContext';

// BloggerContext - данные блогера
import { useBlogger } from '@/contexts/BloggerContext';

// AuthContext - композиция (обратная совместимость)
import { useAuth } from '@/contexts/AuthContext';
```

## 🎯 Готовность архитектуры

✅ **Модульность** - четкое разделение ответственности  
✅ **Производительность** - оптимизация и мемоизация (React.memo, useMemo, useCallback)  
✅ **Масштабируемость** - готовность к росту (19 страниц, 97 компонентов, 41 хук)  
✅ **Типизация** - полная типизация TypeScript (0 any типов)  
✅ **Переиспользование** - компоненты и хуки (SOLID принципы)  
✅ **Тестируемость** - изолированные модули (unit и E2E тесты)  
✅ **Документация** - полное покрытие JSDoc (85%)

## 📦 Компоненты по категориям

### Компоненты админ-панели (`components/admin/`)

- `AdminHeader` - заголовок админ-панели
- `BloggersTable` - таблица блогеров
- `AdminLinkRequestsTable` - таблица запросов на связывание
- `GenderSelectionTable` - таблица выбора пола
- `StatsCards` - карточки статистики
- `InstagramClientManager` - менеджер Instagram клиента
- `TelegramClientManager` - менеджер Telegram клиента
- `TopicsManagementDialog` - диалог управления тематиками
- `AddBloggerDialog` - диалог добавления блогера
- `InstagramClientSetupDialog` - настройка Instagram клиента
- **Parser компоненты** (`parser/`):
  - `ParserAccountsTable` - таблица парсер-аккаунтов
  - `AddInstagramAccountDialog` - добавление Instagram аккаунта
  - `AddTelegramAccountDialog` - добавление Telegram аккаунта
  - `AddYouTubeAccountDialog` - добавление YouTube аккаунта
  - `ReauthInstagramAccountDialog` - переавторизация Instagram
  - `ReauthTelegramAccountDialog` - переавторизация Telegram
  - `PlatformNotAvailableMessage` - сообщение о недоступности платформы

**Всего компонентов админ-панели:** 15+

### Компоненты профиля блогера (`components/blogger-profile/`)

- `BloggerProfileHeader` - заголовок профиля
- `BloggerProfileStats` - статистика профиля
- `BloggerProfilePricing` - цены профиля
- `BloggerProfileTabs` - вкладки профиля

### Компоненты редактирования профиля (`components/profile/`)

- `ProfileHeader` - заголовок профиля
- `BloggerInfo` - информация о блогере
- `PlatformManagement` - управление платформами
- `PlatformStats` - статистика платформ
- `CooperationTermsSection` - условия сотрудничества
- `CategorySelector` - выбор категорий
- `RestrictedTopicsSelector` - выбор запрещенных тем
- `ScreenshotDisplay` - отображение скриншотов
- `ScreenshotManagement` - управление скриншотами
- `SocialLinking` - связывание соцсетей
- `VerificationNotice` - уведомление о верификации
- **Organisms** (`organisms/`):
  - `PlatformProfileForm` - форма профиля платформы
  - `PriceListEditor` - редактор цен
  - `PricingSection` - секция цен

### UI компоненты (`components/ui/`)

Базовые компоненты на основе shadcn/ui (30+ компонентов):
- **Базовые:** `button`, `card`, `input`, `select`, `textarea`, `label`
- **Диалоги:** `dialog`, `alert-dialog`, `sheet`, `popover`, `tooltip`
- **Навигация:** `tabs`, `breadcrumb`, `pagination`, `sidebar`
- **Отображение:** `table`, `badge`, `avatar`, `skeleton`, `separator`
- **Формы:** `form`, `checkbox`, `switch`, `radio`, `form-field`
- **Уведомления:** `toast`, `toaster`, `sonner`, `alert`
- **Кастомные:** `MultiSelect`, `EditableCard`, `InfiniteScrollList`
- **Специализированные:** `SafeAvatar`, `BloggerStatusBadge`, `FollowersDisplay`, `PageSkeleton`, `ScrollToTopButton`

**Всего UI компонентов:** 30+

### Служебные компоненты

- `ProtectedRoute` - защищенные маршруты
- `AdminRoutes` - маршруты админки
- `BloggerProfileRoute` - маршрут профиля блогера
- `ProfileChecker` - проверка профиля
- `AuthRedirectHandler` - обработчик редиректов
- `ErrorBoundary` - обработка ошибок
- `LoadingScreen` - экран загрузки
- `SEOHead` - SEO мета-теги

---

## 📊 Актуальная статистика компонентов

- **Админ-панель:** 15+ компонентов
- **Профили блогеров:** 15+ компонентов
- **UI компоненты (shadcn/ui):** 30+ компонентов
- **UI-kit:** 9 компонентов (layout, feedback, auth)
- **Служебные:** 10+ компонентов
- **Иконки и утилиты:** 2 компонента
- **Прочие компоненты:** 15+ компонентов

**Общее количество:** 99 компонентов

---

_Последнее обновление: Январь 2025_
