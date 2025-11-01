# 🔌 API документация Zorki7

## 🎯 Обзор

Zorki7 использует NestJS backend с RESTful API архитектурой для управления блогерами, аутентификации и админ-панели.

---

## ⚡ Быстрый старт (5 минут до первого API запроса)

### Шаг 1: Импорт API клиента

```typescript
import { apiRequest } from '@/api/client';
```

### Шаг 2: Первый GET запрос

```typescript
// Получить список блогеров
const bloggers = await apiRequest<Blogger[]>('/blogger/public');
console.log(bloggers); // { items: [...], total: 100, page: 1, ... }
```

### Шаг 3: POST запрос с данными

```typescript
// Обновить профиль блогера
const result = await apiRequest('/blogger/:id', {
  method: 'PUT',
  body: JSON.stringify({ name: 'Новое имя' })
});
```

### Шаг 4: Обработка ошибок

```typescript
import { APIError } from '@/api/core/ApiErrorHandler';

try {
  const data = await apiRequest('/endpoint');
} catch (error) {
  if (error instanceof APIError) {
    if (error.isValidationError()) {
      const fieldErrors = error.getValidationErrors();
      // { email: 'Invalid email', password: 'Too short' }
    }
  }
}
```

---

## 🌐 Базовые настройки

### URL и окружение

**Production API** работает через proxy:
- Все запросы к `/api/*` автоматически перенаправляются на `https://zorki.pro/api`
- Настроено в `vite.config.ts`

### Переменные окружения

```typescript
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Аутентификация

```typescript
// Приоритет токенов
const getAuthToken = () => {
  return (
    sessionStorage.getItem('adminToken') ||
    sessionStorage.getItem('accessToken') ||
    sessionStorage.getItem('supabaseToken')
  );
};

// Использование в запросах
const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
};
```

## 📊 Основные эндпоинты

### ⭐ Самые важные (используются чаще всего)

#### 1. GET /blogger/public - Список блогеров

**Использование:**
```typescript
import { getAllBloggers } from '@/api/endpoints/blogger';

const response = await getAllBloggers({
  page: 1,
  size: 50,
  search: 'имя',
  gender: 'FEMALE',
  platform: 'INSTAGRAM'
});

// response.items - массив блогеров
// response.total - общее количество
// response.hasMore - есть ли еще страницы
```

#### 2. GET /blogger/public/:id - Профиль блогера

**Использование:**
```typescript
import { getBloggerById } from '@/api/endpoints/blogger';

const blogger = await getBloggerById(bloggerId);
// blogger.social - аккаунты в соцсетях
// blogger.price - цены по платформам
// blogger.topics - тематики блогера
```

#### 3. PUT /blogger/:id - Обновить профиль

**Авторизация:** Bearer Token (Client JWT)

**Использование:**
```typescript
import { updateBloggerProfile } from '@/api/endpoints/blogger';

await updateBloggerProfile(bloggerId, {
  name: 'Новое имя',
  topics: [1, 2, 3], // ID тематик
  isBarterAvailable: true
});
```

## 🔐 Аутентификация

### Регистрация и вход

**Регистрация:**
```typescript
// Используется через Supabase Auth (не API endpoint)
// См. компоненты в src/components/auth/
```

**Вход:**
```typescript
// Используется через Supabase Auth
// См. src/components/auth/AuthForm.tsx
```

### Получение информации о пользователе

**GET /auth/client/me**

```typescript
import { getClientMe } from '@/api/endpoints/client';

const userInfo = await getClientMe();
// userInfo.email - email пользователя
// userInfo.blogger - информация о блогере (если связан)
// userInfo.blogger.verificationStatus - статус верификации
```

**Авторизация:** Bearer Token (Client JWT) - добавляется автоматически

## 🛠️ Админ API

### ⭐ Самые важные админские эндпоинты

#### 1. GET /admin/bloggers - Список блогеров для админа

```typescript
import { adminGetBloggers } from '@/api/endpoints/admin';

const response = await adminGetBloggers({
  page: 1,
  size: 50,
  search: 'имя',
  status: 'APPROVED',
  sortField: 'createdAt',
  sortDirection: 'desc'
});
```

#### 2. POST /admin/bloggers - Создать блогера

```typescript
import { adminCreateBlogger } from '@/api/endpoints/admin';

await adminCreateBlogger('instagram_username');
```

#### 3. GET /admin/link/blogger-client - Запросы на связывание

```typescript
import { getAdminLinkRequests } from '@/api/endpoints/admin';

const requests = await getAdminLinkRequests({
  page: 1,
  status: 'MODERATION'
});
```

**Авторизация:** Bearer Token (Admin JWT) - добавляется автоматически через TokenManager

### GET /admin/link/blogger-client

Получить список запросов на связывание.

**Авторизация:** Bearer Token (Admin JWT)

**Параметры:**

```typescript
interface LinkRequestQueryParams {
  page?: number;
  size?: number;
  sortDirection?: 'asc' | 'desc';
  sortField?: 'createdAt';
  status?: 'APPROVED' | 'REJECTED' | 'MODERATION';
}
```

## 👤 Клиентские запросы

### POST /client/blogger/link

Связать профиль клиента с блогером.

**Авторизация:** Bearer Token (Client JWT)

**Тело запроса:**

```typescript
interface ClientLinkToBloggerInputDto {
  username: string; // Instagram username
}
```

## 🌐 Социальные сети

### Instagram

#### POST /blogger/link-media/instagram

Связать Instagram аккаунт.

**Тело запроса:**

```typescript
interface BloggerLinkMediaIgRequestInputDto {
  username: string; // Instagram username
}
```

### YouTube

#### POST /blogger/link-media/youtube

Связать YouTube канал.

**Тело запроса:**

```typescript
interface BloggerLinkMediaYtRequestInputDto {
  channel: string; // YouTube URL or handle
}
```

### Telegram

#### POST /blogger/link-media/telegram

Связать Telegram канал.

**Тело запроса:**

```typescript
interface BloggerLinkMediaTgRequestInputDto {
  username: string; // Telegram username
}
```

### TikTok

#### POST /blogger/link-media/tiktok

Связать TikTok аккаунт.

**Тело запроса:**

```typescript
interface BloggerLinkMediaTikTokRequestInputDto {
  username: string; // TikTok username
}
```

## 📊 Типы данных

### Основные enum'ы

```typescript
// Социальные сети
export type ApiSocialType = 'YOUTUBE' | 'INSTAGRAM' | 'TELEGRAM' | 'TIKTOK';

// Пол блогера
export type ApiGender = 'MALE' | 'FEMALE' | 'COUPLE' | 'PUBLIC_PAGE';

// Правовая форма
export type ApiWorkFormat = 'SOLE_PROPRIETOR' | 'SELF_EMPLOYED' | 'SERVICE_CONTRACT' | 'LLC';

// Статус верификации
export type ApiVerificationStatus = 'NEW' | 'APPROVED' | 'REJECTED' | 'MODERATION';
```

### Маппинги API ↔ Frontend

```typescript
// Пол (API → Frontend)
export const GENDER_MAP: Record<ApiGender, string> = {
  MALE: 'мужчина',
  FEMALE: 'женщина',
  COUPLE: 'пара',
  PUBLIC_PAGE: 'паблик',
};

// Правовая форма (API → Frontend)
export const WORK_FORMAT_MAP: Record<ApiWorkFormat, string> = {
  SOLE_PROPRIETOR: 'ИП',
  SELF_EMPLOYED: 'профдоход',
  SERVICE_CONTRACT: 'договор подряда',
  LLC: 'ООО',
};
```

## 🚨 Коды ошибок

### HTTP статус коды

- **200** - Успешный запрос
- **201** - Ресурс создан
- **400** - Неверный запрос
- **401** - Не авторизован
- **403** - Доступ запрещен
- **404** - Ресурс не найден
- **422** - Ошибка валидации
- **500** - Внутренняя ошибка сервера

### Коды ошибок API

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
}

const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  BLOGGER_NOT_FOUND: 'BLOGGER_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
};
```

## 📚 Дополнительная информация

### Модульная архитектура API

API клиент разбит на модули:
- **TokenManager** - управление токенами
- **ResponseHandler** - обработка ответов
- **ApiErrorHandler** - обработка ошибок

Подробнее: [API_ARCHITECTURE.md](API_ARCHITECTURE.md)

### Все эндпоинты по модулям

- **admin.ts** - 26 функций (админские операции)
- **blogger.ts** - 6 функций (публичный API)
- **client.ts** - 2 функции (клиентские запросы)
- **topics.ts** - 7 функций (тематики)
- **social-linking.ts** - 6 функций (связывание соцсетей)
- **telegram.ts** - 5 функций (Telegram клиент)
- **youtube.ts** - 3 функции (YouTube клиент)
- **instagram.ts** - 1 функция (Instagram клиент)

**Всего: 56 функций в 8 модулях**

## 📚 Topics API (Тематики)

### GET /topic/public

Получить список топиков с пагинацией и фильтрацией.

**Параметры:**

```typescript
interface GetTopicsParams {
  page?: number; // default: 1
  size?: number; // default: 50
  isRestricted?: boolean; // default: false - фильтр по типу топика
}
```

**Ответ:**

```typescript
interface PaginationUtil<TopicsOutputDto[]> {
  items: TopicsOutputDto[];
  total: number;
  page: number;
  size: number;
  hasMore: boolean;
}

interface TopicsOutputDto {
  id: number;
  name: string;
  isRestricted: boolean;
  createdAt: string;
}
```

**Пример использования:**

```typescript
// Обычные топики (категории)
const categories = await getTopics({ isRestricted: false });

// Запрещенные топики
const restricted = await getTopics({ isRestricted: true });

// С пагинацией
const page2 = await getTopics({ page: 2, size: 20, isRestricted: false });
```

### POST /admin/topic

Создать новый топик (только для администраторов).

**Авторизация:** Bearer Token (Admin JWT)

**Тело запроса:**

```typescript
interface AdminCreateTopicInputDto {
  name: string; // Название топика
  isRestricted: boolean; // true - запрещенная тема, false - обычная категория
}
```

### PUT /admin/topic/:topicId

Обновить существующий топик (только для администраторов).

**Авторизация:** Bearer Token (Admin JWT)

**Тело запроса:**

```typescript
interface AdminUpdateTopicInputDto {
  name?: string;
  isRestricted?: boolean;
}
```

### DELETE /admin/topic/:topicId

Удалить топик (только для администраторов).

**Авторизация:** Bearer Token (Admin JWT)

## 🔗 Social Linking API

### POST /blogger/link/social/tg/:bloggerId

Отправить запрос на связывание Telegram канала с блогером.

**Авторизация:** Bearer Token (Client JWT)

**Тело запроса:**

```typescript
interface BloggerLinkMediaTgRequestInputDto {
  username: string; // Telegram username канала
}
```

### POST /blogger/link/social/yt/:bloggerId

Отправить запрос на связывание YouTube канала с блогером.

**Авторизация:** Bearer Token (Client JWT)

**Тело запроса:**

```typescript
interface BloggerLinkMediaYtRequestInputDto {
  channel: string; // YouTube URL или handle
}
```

### POST /blogger/link/social/ig/:bloggerId

Отправить запрос на связывание Instagram аккаунта с блогером.

**Авторизация:** Bearer Token (Client JWT)

**Тело запроса:**

```typescript
interface BloggerLinkMediaIgRequestInputDto {
  username: string; // Instagram username
}
```

**Админские endpoints для одобрения:**

- `POST /blogger/link/social/tg/:bloggerId/:requestId` - одобрить Telegram
- `POST /blogger/link/social/yt/:bloggerId/:requestId` - одобрить YouTube
- `POST /blogger/link/social/ig/:bloggerId/:requestId` - одобрить Instagram

## 👤 Client API

### POST /client/blogger/link

Связать текущего клиента с блогером по Instagram username.

**Авторизация:** Bearer Token (Client JWT)

**Тело запроса:**

```typescript
interface ClientLinkToBloggerInputDto {
  username: string; // Instagram username блогера (без @)
}
```

**Примечание:** Создает запрос на модерацию. Админ должен одобрить через `/admin/link/blogger-client/approve/:requestId`.

### GET /auth/client/me

Получение информации о текущем авторизованном клиенте.

**Авторизация:** Bearer Token (Client JWT)

**Ответ:**

```typescript
interface ClientAuthMeOutputDto {
  iss: string;
  sub: string;
  email: string;
  phone: string;
  blogger: {
    id: number;
    name: string | null;
    lastName: string | null;
    verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  } | null;
}
```

## ⚠️ Нереализованные эндпоинты

### YouTube Client Management

- `POST /yt-client/login` - авторизация YouTube клиента
- `POST /yt-client/confirm` - подтверждение YouTube клиента

## 🎯 Готовность API

✅ **Все основные эндпоинты** реализованы и протестированы  
✅ **Swagger документация** актуальна и интерактивна  
✅ **Типизация** покрывает все API интерфейсы  
✅ **Система аутентификации** полностью функциональна  
✅ **Обработка ошибок** централизована  
✅ **Маппинги** между API и frontend настроены

## 📦 API Модули

Все endpoints организованы в модули в `src/api/endpoints/`:

- **admin.ts** - 26+ функций: админская аутентификация, управление блогерами, парсер-аккаунты, связывание соцсетей
- **blogger.ts** - 6 функций: публичный API блогеров, обновление профилей, цены
- **client.ts** - 2 функции: связывание клиента с блогером, получение информации о клиенте
- **instagram.ts** - 1 функция: управление Instagram клиентом
- **social-linking.ts** - 6 функций: запросы и одобрения связывания соцсетей (от пользователей)
- **telegram.ts** - 5+ функций: управление Telegram клиентом и сессиями
- **topics.ts** - 7 функций: публичный и админский API тематик (категории и запрещенные темы)
- **youtube.ts** - 3 функции: управление YouTube каналами и сессиями

**Всего:** **56 функций** в 8 модулях.

### API Core модули (`src/api/core/`)

Модульная архитектура API клиента:

- **TokenManager.ts** - управление токенами с приоритетами (adminToken → accessToken → supabaseToken)
- **ResponseHandler.ts** - централизованная обработка HTTP ответов
- **ApiErrorHandler.ts** - обработка и классификация ошибок API
- **types.ts** - типы для API Core

Все модули используют Singleton pattern.

---

## 🔐 Система аутентификации

### Приоритет токенов

API клиент использует следующую систему приоритетов токенов:

1. **adminToken** (sessionStorage) - для админских операций
2. **adminTempToken** (sessionStorage) - для подтверждения 2FA
3. **accessToken** (sessionStorage) - основной токен для пользователей
4. **supabaseToken** (session) - fallback из Supabase сессии

**Реализация:** `src/api/core/TokenManager.ts`

---

## 📊 Статистика API

- **8 модулей endpoints** - основные API модули
- **56 функций** - все доступные API функции
- **4 core модуля** - базовая инфраструктура API клиента
- **REST API** - все эндпоинты используют REST архитектуру
- **JWT аутентификация** - для админов и пользователей

---

_Последнее обновление: Январь 2025_
