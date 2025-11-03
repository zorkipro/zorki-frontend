# API Architecture

Документация по модульной архитектуре API клиента Zorki.

## ⚡ Быстрый старт

### Базовое использование (без знания модулей)

```typescript
import { apiRequest } from '@/api/client';

// Простой GET запрос
const bloggers = await apiRequest<Blogger[]>('/blogger/public');

// POST запрос с данными
const result = await apiRequest('/blogger/:id', {
  method: 'PUT',
  body: JSON.stringify({ name: 'Новое имя' })
});

// Обработка ошибок
try {
  const data = await apiRequest('/endpoint');
} catch (error) {
  if (error instanceof APIError) {
    console.error('Ошибка:', error.message);
  }
}
```

**Этого достаточно для начала работы!** Модули работают автоматически.

---

## 🏗️ Архитектура

API клиент разбит на независимые модули, следуя принципам **SOLID**:

```
src/api/
├── client.ts              # Основной API клиент (100 строк)
└── core/                  # Модули API
    ├── types.ts           # Типы (39 строк)
    ├── TokenManager.ts    # Управление токенами (120 строк)
    ├── ResponseHandler.ts # Обработка ответов (171 строка)
    ├── ApiErrorHandler.ts # Обработка ошибок (156 строк)
    └── index.ts           # Реэкспорт (21 строка)
```

---

## 📦 Модули

### 1. **types.ts** - Типы API

Определяет все типы для работы с API:

```typescript
interface BadRequestErrorFieldExceptionDto {
  message: string;
  field: string;
  errorKey: string;
}

interface BadRequestExceptionDto {
  message: string;
  statusCode: number;
  errorField: BadRequestErrorFieldExceptionDto[] | null;
}

interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
  baseUrl?: string;
}
```

---

### 2. **TokenManager.ts** - Управление токенами

**Ответственность:** Получение и управление токенами аутентификации

**Приоритет токенов:**
1. `adminToken` (sessionStorage) - для админских операций
2. `adminTempToken` (sessionStorage) - для подтверждения 2FA
3. `accessToken` (sessionStorage) - основной токен для пользователей
4. `supabaseToken` (session) - fallback из Supabase сессии

**API:**

```typescript
class TokenManager {
  // Получить токен
  async getAuthToken(): Promise<string | null>
  
  // Очистить все токены
  clearAllTokens(): void
  
  // Очистить админские токены
  clearAdminTokens(): void
  
  // Проверить наличие токена
  async hasAuthToken(): Promise<boolean>
  
  // Получить тип текущего токена
  getCurrentTokenType(): 'admin' | 'admin_temp' | 'access' | 'supabase' | null
}

// Singleton instance
export const tokenManager = TokenManager.getInstance();
```

**Использование:**

```typescript
import { tokenManager } from '@/api/core/TokenManager';

// Получить токен
const token = await tokenManager.getAuthToken();

// Проверить наличие
if (await tokenManager.hasAuthToken()) {
  // User authenticated
}

// Очистить при logout
tokenManager.clearAllTokens();
```

---

### 3. **ResponseHandler.ts** - Обработка ответов

**Ответственность:** Парсинг HTTP ответов и валидация статусов

**API:**

```typescript
interface ParsedResponse<T = unknown> {
  data: T | undefined;
  hasError: boolean;
  errorData?: BadRequestExceptionDto;
}

class ResponseHandler {
  // Обработать HTTP ответ
  async parseResponse<T>(
    response: Response,
    endpoint: string
  ): Promise<ParsedResponse<T>>
  
  // Создать Response из ошибки (для тестирования)
  createErrorResponse(
    message: string,
    statusCode: number
  ): BadRequestExceptionDto
}

// Singleton instance
export const responseHandler = ResponseHandler.getInstance();
```

**Особенности:**

- Автоматическая обработка `204 No Content`
- Проверка `Content-Type` перед парсингом JSON
- Детальное логирование для 500 ошибок
- Graceful fallback для ответов без JSON

**Использование:**

```typescript
import { responseHandler } from '@/api/core/ResponseHandler';

const response = await fetch(url);
const { data, hasError, errorData } = await responseHandler.parseResponse(
  response,
  '/api/endpoint'
);

if (hasError) {
  console.error(errorData);
} else {
  console.log(data);
}
```

---

### 4. **ApiErrorHandler.ts** - Обработка ошибок

**Ответственность:** Создание и обработка API ошибок

**API:**

```typescript
class APIError extends Error {
  statusCode: number;
  errorField: BadRequestErrorFieldExceptionDto[] | null;
  
  // Проверки типа ошибки
  isValidationError(): boolean
  isAuthError(): boolean
  isForbiddenError(): boolean
  isServerError(): boolean
  
  // Получить ошибки валидации
  getValidationErrors(): Record<string, string>
}

class ApiErrorHandler {
  // Обработать ошибку API
  handleError(error: unknown, endpoint: string): APIError
  
  // Обработать ошибку аутентификации (401)
  handleAuthError(
    errorData: BadRequestExceptionDto,
    redirectPath?: string
  ): void
  
  // Проверить нужно ли перенаправить
  shouldRedirect(statusCode: number): boolean
}

// Singleton instance
export const apiErrorHandler = ApiErrorHandler.getInstance();
```

**Использование:**

```typescript
import { APIError, apiErrorHandler } from '@/api/core/ApiErrorHandler';

try {
  const data = await apiRequest('/endpoint');
} catch (error) {
  if (error instanceof APIError) {
    // Проверки типа ошибки
    if (error.isValidationError()) {
      const fieldErrors = error.getValidationErrors();
      // { email: 'Invalid email format', password: 'Too short' }
    }
    
    if (error.isAuthError()) {
      // Handle 401
    }
  }
}
```

---

### 5. **client.ts** - Основной API клиент

**Ответственность:** Координация модулей для выполнения запросов

**API:**

```typescript
async function apiRequest<T = unknown>(
  endpoint: string,
  options?: ApiRequestOptions
): Promise<T>

// Опции
interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;    // Пропустить добавление токена
  baseUrl?: string;      // Кастомный базовый URL
}
```

**Использование:**

```typescript
import { apiRequest } from '@/api/client';

// GET запрос
const profile = await apiRequest<UserProfile>('/user/profile');

// POST запрос
const result = await apiRequest<CreateResult>('/user/create', {
  method: 'POST',
  body: JSON.stringify({ name: 'John' })
});

// Без аутентификации
const public Data = await apiRequest('/public/data', {
  skipAuth: true
});

// Кастомный базовый URL
const external = await apiRequest('/api/data', {
  baseUrl: 'https://external-api.com'
});
```

---

## 🎯 Когда использовать модули напрямую?

В большинстве случаев **НЕ нужно** использовать модули напрямую - `apiRequest` делает всё автоматически.

Используйте модули только если нужно:

1. **Управление токенами вручную:**
```typescript
import { tokenManager } from '@/api/core/TokenManager';

// Очистить токены при logout
tokenManager.clearAllTokens();

// Проверить наличие токена
const hasToken = await tokenManager.hasAuthToken();
```

2. **Специфичная обработка ошибок:**
```typescript
import { APIError, apiErrorHandler } from '@/api/core/ApiErrorHandler';

try {
  await apiRequest('/endpoint');
} catch (error) {
  const apiError = apiErrorHandler.handleError(error, '/endpoint');
  if (apiError.isValidationError()) {
    // Специальная обработка валидации
  }
}
```

## 🎯 Преимущества модульной архитектуры

1. **Single Responsibility** - каждый модуль делает одну вещь
2. **Тестируемость** - модули тестируются независимо
3. **Поддерживаемость** - изменения изолированы
4. **Расширяемость** - легко добавить новый функционал

---

## 📊 Сравнение с прежней архитектурой

| Метрика | До | После | Улучшение |
|---------|-----|-------|-----------|
| **Файлов** | 1 | 6 | ✅ Модульность |
| **client.ts** | 199 строк | 100 строк | **-50%** ✅ |
| **Ответственностей в 1 файле** | 4 | 1 | ✅ SRP |
| **Тестируемость** | Низкая | Высокая | ✅ |
| **Singleton instances** | 0 | 3 | ✅ Удобство |

---

## 🧪 Пример тестирования

```typescript
// TokenManager.test.ts
describe('TokenManager', () => {
  let tokenManager: TokenManager;
  
  beforeEach(() => {
    tokenManager = TokenManager.getInstance();
    sessionStorage.clear();
  });
  
  it('should return admin token with highest priority', async () => {
    sessionStorage.setItem('adminToken', 'admin-123');
    sessionStorage.setItem('accessToken', 'user-456');
    
    const token = await tokenManager.getAuthToken();
    expect(token).toBe('admin-123');
  });
  
  it('should clear all tokens', () => {
    sessionStorage.setItem('adminToken', 'admin-123');
    sessionStorage.setItem('accessToken', 'user-456');
    
    tokenManager.clearAllTokens();
    
    expect(sessionStorage.getItem('adminToken')).toBeNull();
    expect(sessionStorage.getItem('accessToken')).toBeNull();
  });
});

// APIError.test.ts
describe('APIError', () => {
  it('should identify validation errors', () => {
    const error = new APIError({
      message: 'Validation failed',
      statusCode: 400,
      errorField: [
        { field: 'email', message: 'Invalid', errorKey: 'invalid_email' }
      ]
    });
    
    expect(error.isValidationError()).toBe(true);
    expect(error.getValidationErrors()).toEqual({
      email: 'Invalid'
    });
  });
  
  it('should identify auth errors', () => {
    const error = new APIError({
      message: 'Unauthorized',
      statusCode: 401,
      errorField: null
    });
    
    expect(error.isAuthError()).toBe(true);
  });
});
```

---

## 🔄 Миграция с старого API

Старый API полностью обратно совместим:

```typescript
// Старый код - работает без изменений
import { apiRequest, APIError } from '@/api/client';

const data = await apiRequest<UserData>('/user');
```

Новые возможности:

```typescript
// Доступ к модулям
import { tokenManager } from '@/api/client';

// Очистить токены при logout
tokenManager.clearAllTokens();

// Проверить тип ошибки
if (error instanceof APIError && error.isValidationError()) {
  const fieldErrors = error.getValidationErrors();
}
```

---

## 📝 Best Practices

1. **Всегда используйте типизацию**
   ```typescript
   const data = await apiRequest<UserProfile>('/user/profile');
   ```

2. **Обрабатывайте ошибки специфично**
   ```typescript
   try {
     const data = await apiRequest('/endpoint');
   } catch (error) {
     if (error instanceof APIError) {
       if (error.isValidationError()) {
         // Handle validation
       } else if (error.isAuthError()) {
         // Handle auth
       }
     }
   }
   ```

3. **Используйте опции для специальных случаев**
   ```typescript
   // Публичный API
   await apiRequest('/public', { skipAuth: true });
   
   // Внешний API
   await apiRequest('/data', { baseUrl: 'https://api.external.com' });
   ```

4. **Не забывайте про логирование**
   - Все модули используют centralized logger
   - Проверяйте логи в dev tools

---

_Последнее обновление: Январь 2025_

