# API Core Tests

Unit тесты для модулей API клиента.

## 🧪 Тесты

### APIError.test.ts

Тесты для класса `APIError`:

- ✅ Создание экземпляра с разными типами ошибок
- ✅ `isValidationError()` - проверка ошибок валидации
- ✅ `isAuthError()` - проверка 401 ошибок
- ✅ `isForbiddenError()` - проверка 403 ошибок
- ✅ `isServerError()` - проверка 5xx ошибок
- ✅ `getValidationErrors()` - получение ошибок полей

### TokenManager.test.ts

Тесты для `TokenManager`:

- ✅ Singleton pattern
- ✅ Приоритет токенов (admin > adminTemp > access > supabase)
- ✅ `clearAllTokens()` - очистка всех токенов
- ✅ `clearAdminTokens()` - очистка только админских токенов
- ✅ `hasAuthToken()` - проверка наличия токена
- ✅ `getCurrentTokenType()` - определение типа токена
- ✅ Обработка ошибок Supabase

### ResponseHandler.test.ts

Тесты для `ResponseHandler`:

- ✅ Singleton pattern
- ✅ Обработка 204 No Content
- ✅ Парсинг JSON ответов
- ✅ Обработка ответов без JSON
- ✅ Обработка ошибок с JSON
- ✅ Обработка ошибок без JSON
- ✅ Обработка ошибок парсинга JSON
- ✅ Детальное логирование 500 ошибок

## 🚀 Запуск тестов

```bash
# Все тесты
npm run test

# Только API тесты
npm run test src/api/core

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## 📊 Coverage Goals

| Метрика    | Цель | Текущее |
| ---------- | ---- | ------- |
| Statements | 90%  | -       |
| Branches   | 85%  | -       |
| Functions  | 90%  | -       |
| Lines      | 90%  | -       |

## 📝 Примеры использования

### Тестирование APIError

```typescript
it("should identify validation errors", () => {
  const error = new APIError({
    message: "Validation failed",
    statusCode: 400,
    errorField: [
      { field: "email", message: "Invalid", errorKey: "invalid_email" },
    ],
  });

  expect(error.isValidationError()).toBe(true);
  expect(error.getValidationErrors()).toEqual({
    email: "Invalid",
  });
});
```

### Тестирование TokenManager

```typescript
it("should return admin token with highest priority", async () => {
  sessionStorage.setItem("adminToken", "admin-123");
  sessionStorage.setItem("accessToken", "user-456");

  const token = await tokenManager.getAuthToken();
  expect(token).toBe("admin-123");
});
```

### Тестирование ResponseHandler

```typescript
it("should parse successful JSON response", async () => {
  const mockData = { id: 1, name: "Test" };
  const response = new Response(JSON.stringify(mockData), {
    status: 200,
    headers: { "content-type": "application/json" },
  });

  const result = await responseHandler.parseResponse(response, "/test");

  expect(result.data).toEqual(mockData);
  expect(result.hasError).toBe(false);
});
```

## 🔧 Конфигурация

Используется **Vitest** с jsdom окружением для тестирования:

```typescript
/**
 * @vitest-environment jsdom
 */
```

## 📚 Ресурсы

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [API Architecture](../../../docs/API_ARCHITECTURE.md)
