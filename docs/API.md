# 🔌 API документация Zorki7

## 🎯 Обзор

Zorki7 использует NestJS backend с RESTful API архитектурой для управления блогерами, аутентификации и админ-панели.

## 🌐 Базовые настройки

### URL и окружение

```
Development: http://localhost:4000
Production: VITE_API_BASE_URL
Swagger: http://localhost:4000/swagger
```

### Переменные окружения

```typescript
VITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_CURRENCY=RUB
VITE_REDIRECT_URL=http://localhost:5173
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

### GET /blogger/public

Получить список блогеров с пагинацией.

**Параметры:**

```typescript
interface BloggerQueryParams {
  page?: number; // номер страницы (default: 1)
  size?: number; // размер страницы (default: 50)
  search?: string; // поиск по имени
  gender?: ApiGender; // фильтр по полу
  platform?: ApiSocialType; // фильтр по платформе
}
```

**Ответ:**

```typescript
interface PaginatedBloggerResponse {
  items: PublicGetAllBloggersOutputDto[];
  total: number;
  page: number;
  size: number;
  hasMore: boolean;
}
```

### GET /blogger/public/:id

Получить детальную информацию о блогере.

**Ответ:**

```typescript
interface PublicGetBloggerByIdOutputDto {
  id: number;
  name: string | null;
  lastName: string | null;
  contactLink: string | null;
  genderType: ApiGender | null;
  workFormat: ApiWorkFormat | null;
  verificationStatus: ApiVerificationStatus | null;
  social: PublicGetAllBloggersSocialAccOutputDto[] | null;
  price: PublicGetAllBloggersSocialPriceOutputDto[];
  topics: PublicGetBloggerByIdTopicOutputDto[] | null;
}
```

### PUT /blogger/:id

Обновить профиль блогера.

**Авторизация:** Bearer Token (Client JWT)

**Тело запроса:**

```typescript
interface BloggerUpdateProfileInputDto {
  name?: string; // 1-30 chars
  lastName?: string; // 1-30 chars
  contactLink?: string; // URI
  workFormat?: ApiWorkFormat;
  genderType?: ApiGender;
  topics?: number[]; // массив ID тематик
  restrictedTopics?: number[]; // массив ID запрещенных тем
  isBarterAvailable?: boolean;
  isMartRegistry?: boolean;
}
```

## 🔐 Аутентификация

### POST /auth/signup

Регистрация нового пользователя.

**Тело запроса:**

```typescript
interface SignUpInputDto {
  email: string;
  password: string; // 6-128 chars
  confirmPassword: string;
}
```

### POST /auth/signin

Вход пользователя.

**Тело запроса:**

```typescript
interface SignInInputDto {
  email: string;
  password: string;
}
```

### GET /auth/client/me

Получение информации о текущем пользователе.

**Авторизация:** Bearer Token (Client JWT)

**Ответ:**

```typescript
interface ClientAuthMeOutputDto {
  iss: string; // Issuer
  sub: string; // Subject (user ID)
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

## 🛠️ Админ API

### GET /admin/bloggers

Получить список всех блогеров для админа.

**Авторизация:** Bearer Token (Admin JWT)

**Параметры:**

```typescript
interface AdminBloggerQueryParams {
  page?: number;
  size?: number;
  search?: string;
  status?: ApiVerificationStatus;
  sortField?: 'createdAt' | 'name' | 'followers';
  sortDirection?: 'asc' | 'desc';
}
```

### POST /admin/bloggers

Создать нового блогера.

**Авторизация:** Bearer Token (Admin JWT)

**Тело запроса:**

```typescript
interface AdminCreateBloggerInputDto {
  name: string;
  lastName: string;
  email?: string;
  genderType?: ApiGender;
  workFormat?: ApiWorkFormat;
  socialAccounts?: SocialAccountInputDto[];
  topics?: number[];
  restrictedTopics?: number[];
}
```

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

## 📚 Swagger документация

### Доступ к Swagger

- **URL:** http://localhost:4000/swagger
- **Описание:** Автоматически генерируемая документация API
- **Интерактивность:** Возможность тестирования эндпоинтов

## ⚠️ Нереализованные эндпоинты

### YouTube Client Management

- `POST /yt-client/login` - авторизация YouTube клиента
- `POST /yt-client/confirm` - подтверждение YouTube клиента

### Topics API

- `GET /topics` - получение списка тематик (используется только mock)

## 🎯 Готовность API

✅ **Все основные эндпоинты** реализованы и протестированы  
✅ **Swagger документация** актуальна и интерактивна  
✅ **Типизация** покрывает все API интерфейсы  
✅ **Система аутентификации** полностью функциональна  
✅ **Обработка ошибок** централизована  
✅ **Маппинги** между API и frontend настроены

---

_Последнее обновление: Октябрь 2025_
