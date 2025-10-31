# Отчет о новых изменениях в бэкенде API

Дата анализа: 2025

## Обзор

Анализ нового Swagger JSON файла выявил следующие новые эндпоинты и изменения в API, которые необходимо интегрировать во frontend.

---

## Новые эндпоинты для реализации

### 1. Telegram Client Management

#### GET /tg-client
**Описание:** Получение списка Telegram сессий с пагинацией и фильтрацией

**Параметры запроса:**
- `page?: number` (default: 1)
- `size?: number` (default: 50)
- `isAuthorized?: boolean` (default: true)

**Ответ:** `PaginationUtil<TgClientSessionsOutputDto[]>`

**Авторизация:** Требует admin-auth-jwt-schema

**Файл:** `src/api/endpoints/telegram.ts`
**Функция:** `getTgSessions(params?: GetTgSessionsParams)`

---

#### POST /tg-client/logout/{sessionId}
**Описание:** Выход из Telegram сессии

**Path параметры:**
- `sessionId: number` - ID сессии

**Ответ:** 204 No Content

**Авторизация:** Требует admin-auth-jwt-schema

**Файл:** `src/api/endpoints/telegram.ts`
**Функция:** `logoutTgSession(sessionId: number)`

---

#### DELETE /tg-client/{sessionId}
**Описание:** Удаление Telegram сессии

**Path параметры:**
- `sessionId: number` - ID сессии

**Ответ:** 204 No Content

**Авторизация:** Требует admin-auth-jwt-schema

**Файл:** `src/api/endpoints/telegram.ts`
**Функция:** `deleteTgSession(sessionId: number)`

---

### 2. YouTube Client Management

#### GET /yt-client
**Описание:** Получение списка YouTube сессий

**Параметры запроса:**
- `page?: number` (default: 1)
- `size?: number` (default: 50)

**Ответ:** `PaginationUtil<YtClientSessionOutputDto[]>`

**Авторизация:** Требует admin-auth-jwt-schema

**Файл:** `src/api/endpoints/youtube.ts` (новый)
**Функция:** `getYtSessions(params?: GetYtSessionsParams)`

---

#### POST /yt-client/add
**Описание:** Добавление новой YouTube сессии

**Тело запроса:** `YtClientAddInputDto`
- `token: string` - YouTube API токен (35-40 chars, pattern: `^AIza[0-9A-Za-z_\\-]{30,35}$`)
- `name: string` - Название сессии (2-40 chars)

**Ответ:** 201 Created

**Авторизация:** Требует admin-auth-jwt-schema

**Файл:** `src/api/endpoints/youtube.ts` (новый)
**Функция:** `addYtSession(data: YtClientAddInputDto)`

---

#### DELETE /yt-client/{sessionId}
**Описание:** Удаление YouTube сессии

**Path параметры:**
- `sessionId: number` - ID сессии

**Ответ:** 204 No Content

**Авторизация:** Требует admin-auth-jwt-schema

**Файл:** `src/api/endpoints/youtube.ts` (новый)
**Функция:** `deleteYtSession(sessionId: number)`

---

### 3. Admin Blogger Management - Link Social Media

#### POST /admin/blogger/link/TG/{bloggerId}
**Описание:** Связывание Telegram канала с блогером (админ)

**Path параметры:**
- `bloggerId: number` - ID блогера

**Тело запроса:** `BloggerLinkMediaTgRequestInputDto`
- `username: string` - Telegram username (3-33 chars, pattern: `^[a-zA-Z0-9_]{3,33}$`)

**Ответ:** 204 No Content

**Авторизация:** Требует admin-auth-jwt-schema

**Ошибки:**
- 400 - Incorrect input data или channel already linked или parsing error
- 403 - The operation is not possible
- 404 - Blogger not found

**Файл:** `src/api/endpoints/admin.ts`
**Функция:** `adminLinkTgChannelToBlogger(bloggerId: number, data: BloggerLinkMediaTgRequestInputDto)`

---

#### POST /admin/blogger/link/YT/{bloggerId}
**Описание:** Связывание YouTube канала с блогером (админ)

**Path параметры:**
- `bloggerId: number` - ID блогера

**Тело запроса:** `BloggerLinkMediaYtRequestInputDto`
- `channel: string` - YouTube channel URL или handle (3-100 chars)

**Ответ:** 204 No Content

**Авторизация:** Требует admin-auth-jwt-schema

**Ошибки:**
- 400 - Incorrect input data или channel already linked или parsing error
- 403 - The operation is not possible
- 404 - Blogger not found

**Файл:** `src/api/endpoints/admin.ts`
**Функция:** `adminLinkYtChannelToBlogger(bloggerId: number, data: BloggerLinkMediaYtRequestInputDto)`

---

## Новые поля в существующих схемах

### 1. BloggerUpdateProfileInputDto

**Добавлено поле:**
- `cooperation?: string` - Текст о сотрудничестве (1-1000 символов, опционально)

**Файл:** `src/api/types.ts`

---

### 2. TgClientSessionsOutputDto

**Добавлены поля:**
- `requests?: number` - Количество выполненных запросов
- `lastReset?: string` - Дата последнего сброса (ISO date string)

**Примечание:** Поле `createdAt` уже существует

**Файл:** `src/api/types.ts`

---

## Новые типы для добавления

### 1. YtClientSessionOutputDto

```typescript
interface YtClientSessionOutputDto {
  id: number;
  name: string | null;
  lastReset: string; // ISO date string
  quota: number;
  createdAt: string; // ISO date string
}
```

**Файл:** `src/api/types.ts`

---

### 2. YtClientAddInputDto

```typescript
interface YtClientAddInputDto {
  token: string; // 35-40 chars, pattern: ^AIza[0-9A-Za-z_\\-]{30,35}$
  name: string; // 2-40 chars
}
```

**Файл:** `src/api/types.ts`

---

### 3. GetTgSessionsParams

```typescript
interface GetTgSessionsParams {
  page?: number;
  size?: number;
  isAuthorized?: boolean;
}
```

**Файл:** `src/api/endpoints/telegram.ts`

---

### 4. TgSessionsResponse

```typescript
interface TgSessionsResponse {
  totalCount: number;
  pagesCount: number;
  page: number;
  size: number;
  items: TgClientSessionsOutputDto[];
}
```

**Файл:** `src/api/endpoints/telegram.ts` или `src/api/types.ts`

---

### 5. GetYtSessionsParams

```typescript
interface GetYtSessionsParams {
  page?: number;
  size?: number;
}
```

**Файл:** `src/api/endpoints/youtube.ts`

---

### 6. YtSessionsResponse

```typescript
interface YtSessionsResponse {
  totalCount: number;
  pagesCount: number;
  page: number;
  size: number;
  items: YtClientSessionOutputDto[];
}
```

**Файл:** `src/api/endpoints/youtube.ts` или `src/api/types.ts`

---

## Список файлов для обновления

### 1. src/api/types.ts
- [x] Добавить `cooperation?: string` в `BloggerUpdateProfileInputDto`
- [x] Обновить `TgClientSessionsOutputDto` (добавить `requests`, `lastReset`)
- [x] Добавить `YtClientSessionOutputDto`
- [x] Добавить `YtClientAddInputDto`

### 2. src/api/endpoints/telegram.ts
- [x] Добавить `getTgSessions()` - GET /tg-client
- [x] Добавить `logoutTgSession()` - POST /tg-client/logout/{sessionId}
- [x] Добавить `deleteTgSession()` - DELETE /tg-client/{sessionId}
- [x] Добавить типы `GetTgSessionsParams` и `TgSessionsResponse`

### 3. src/api/endpoints/admin.ts
- [x] Добавить `adminLinkTgChannelToBlogger()` - POST /admin/blogger/link/TG/{bloggerId}
- [x] Добавить `adminLinkYtChannelToBlogger()` - POST /admin/blogger/link/YT/{bloggerId}

### 4. src/api/endpoints/youtube.ts (новый файл)
- [x] Создать файл для YouTube Client Management
- [x] Добавить `getYtSessions()` - GET /yt-client
- [x] Добавить `addYtSession()` - POST /yt-client/add
- [x] Добавить `deleteYtSession()` - DELETE /yt-client/{sessionId}
- [x] Добавить типы `GetYtSessionsParams` и `YtSessionsResponse`

---

## Известные различия

### Эндпоинты, которые уже реализованы в коде

Следующие эндпоинты уже присутствуют в коде, но имеют другие пути или реализацию:

1. **POST /blogger/link/social/tg/{bloggerId}** - Реализован в `src/api/endpoints/social-linking.ts`
2. **POST /blogger/link/social/yt/{bloggerId}** - Реализован в `src/api/endpoints/social-linking.ts`

Эти эндпоинты используются для запросов от пользователей (user-auth-jwt-schema), в то время как новые эндпоинты `/admin/blogger/link/...` предназначены для админов.

---

## Рекомендации по реализации

1. **Приоритет 1:** Обновить типы в `src/api/types.ts` - это критично для типизации
2. **Приоритет 2:** Реализовать Telegram Client Management - расширение существующего функционала
3. **Приоритет 3:** Реализовать YouTube Client Management - новый функционал
4. **Приоритет 4:** Добавить Admin функции для связывания соцсетей - для админ-панели

---

## Тестирование

После реализации рекомендуется протестировать:

1. Все новые эндпоинты с валидными данными
2. Обработку ошибок (400, 401, 403, 404)
3. Пагинацию для списков сессий
4. Валидацию входных данных

---

_Документ создан автоматически на основе анализа Swagger JSON_
