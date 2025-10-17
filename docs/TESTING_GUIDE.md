# Testing Guide

Руководство по тестированию проекта Zorki.

## 🧪 Стратегия тестирования

### Типы тестов

1. **Unit тесты** (приоритет: HIGH)
   - Утилиты и хелперы
   - Type guards
   - Мапперы
   - Сервисы

2. **Integration тесты** (приоритет: MEDIUM)
   - API endpoints
   - Hooks с API вызовами
   - Контексты

3. **E2E тесты** (приоритет: LOW)
   - Playwright тесты
   - Критические user flows

---

## 📦 Созданные тесты

### API Core ✅

Примеры unit тестов созданы для:

1. **`APIError.test.ts`** (154 строки)
   - ✅ Создание экземпляра
   - ✅ `isValidationError()`
   - ✅ `isAuthError()`
   - ✅ `isForbiddenError()`
   - ✅ `isServerError()`
   - ✅ `getValidationErrors()`

2. **`TokenManager.test.ts`** (154 строки)
   - ✅ Singleton pattern
   - ✅ Приоритет токенов
   - ✅ `clearAllTokens()`
   - ✅ `clearAdminTokens()`
   - ✅ `hasAuthToken()`
   - ✅ `getCurrentTokenType()`

3. **`ResponseHandler.test.ts`** (147 строк)
   - ✅ Singleton pattern
   - ✅ Обработка 204 No Content
   - ✅ Парсинг JSON ответов
   - ✅ Обработка ошибок
   - ✅ Логирование 500 ошибок

**Локация**: `src/api/core/__tests__/`

---

## 🚀 Для запуска тестов

### Установка Vitest

```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
```

### Конфигурация vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/**',
        'src/test/**',
        'src/main.tsx',
      ],
    },
  },
});
```

### package.json scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

### Запуск тестов

```bash
# Все тесты (watch mode)
npm run test

# UI интерфейс
npm run test:ui

# Coverage
npm run test:coverage

# Один раз (CI)
npm run test:run
```

---

## 📝 Примеры тестов

### 1. Unit тест для утилиты

```typescript
/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from 'vitest';
import { isValidEmail } from '../validation';

describe('isValidEmail', () => {
  it('should return true for valid email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('test+tag@domain.co.uk')).toBe(true);
  });

  it('should return false for invalid email', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });
});
```

### 2. Unit тест для type guard

```typescript
import { describe, it, expect } from 'vitest';
import { isSocialPlatform } from '../type-guards';

describe('isSocialPlatform', () => {
  it('should return true for valid platforms', () => {
    expect(isSocialPlatform('instagram')).toBe(true);
    expect(isSocialPlatform('tiktok')).toBe(true);
    expect(isSocialPlatform('youtube')).toBe(true);
    expect(isSocialPlatform('telegram')).toBe(true);
  });

  it('should return false for invalid platforms', () => {
    expect(isSocialPlatform('facebook')).toBe(false);
    expect(isSocialPlatform('')).toBe(false);
    expect(isSocialPlatform(123)).toBe(false);
    expect(isSocialPlatform(null)).toBe(false);
  });
});
```

### 3. Unit тест для класса

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { PlatformService } from '../PlatformService';

describe('PlatformService', () => {
  let service: PlatformService;

  beforeEach(() => {
    service = new PlatformService();
  });

  describe('getPlatformData', () => {
    it('should extract platform data from raw object', () => {
      const rawData = {
        username: 'test_user',
        profileUrl: 'https://instagram.com/test',
        followers: 10000,
      };

      const result = service.getPlatformData('instagram', rawData);

      expect(result).toEqual({
        username: 'test_user',
        profile_url: 'https://instagram.com/test',
        subscribers: 10000,
        er: 0,
        reach: 0,
        price: 0,
        storyReach: 0,
        storyPrice: 0,
        views: undefined,
      });
    });

    it('should handle missing fields', () => {
      const result = service.getPlatformData('instagram', {});

      expect(result.username).toBe('');
      expect(result.subscribers).toBe(0);
    });
  });

  describe('validatePlatformData', () => {
    it('should validate correct data', () => {
      const data = {
        username: 'valid_username',
        subscribers: 1000,
        er: 5.5,
      };

      const result = service.validatePlatformData('instagram', data);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return errors for invalid data', () => {
      const data = {
        username: 'ab', // too short
        subscribers: -1, // negative
      };

      const result = service.validatePlatformData('instagram', data);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('username');
      expect(result.errors).toHaveProperty('followers');
    });
  });
});
```

### 4. Unit тест для React Hook

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProfileLoader } from '../useProfileLoader';

// Mock API
vi.mock('@/api/endpoints/blogger', () => ({
  getBloggerById: vi.fn(),
}));

describe('useProfileLoader', () => {
  it('should load profile data', async () => {
    const mockProfile = {
      id: 123,
      name: 'Test Blogger',
      // ...
    };

    const { getBloggerById } = await import('@/api/endpoints/blogger');
    vi.mocked(getBloggerById).mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useProfileLoader(123));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors', async () => {
    const { getBloggerById } = await import('@/api/endpoints/blogger');
    vi.mocked(getBloggerById).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useProfileLoader(123));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profile).toBeNull();
    expect(result.current.error).toBe('API Error');
  });
});
```

---

## 🎯 Coverage Goals

| Метрика | Цель | Приоритет |
|---------|------|-----------|
| **Утилиты** | 90% | HIGH |
| **Type Guards** | 95% | HIGH |
| **Сервисы** | 85% | HIGH |
| **Мапперы** | 80% | MEDIUM |
| **Hooks** | 70% | MEDIUM |
| **Components** | 60% | LOW |

---

## ✅ Что тестировать

### HIGH Priority

1. **Type Guards** - критичны для type safety
   - `type-guards.ts` - все функции
   
2. **Утилиты**
   - `platform-helpers.ts` - генерация полей, маппинг
   - `validation.ts` - все валидаторы
   - `retry.ts` - логика повторов

3. **Сервисы**
   - `PlatformService.ts` - все публичные методы

4. **Мапперы**
   - `platform-mappers.ts` - маппинг платформ
   - `profile-mappers.ts` - маппинг профилей

### MEDIUM Priority

5. **API Core**
   - `TokenManager.ts` - приоритет токенов
   - `ResponseHandler.ts` - парсинг ответов
   - `ApiErrorHandler.ts` - обработка ошибок

6. **Error Handling**
   - `errorHandler.ts` - обработка ошибок
   - `useErrorHandler.ts` - hook для ошибок

### LOW Priority

7. **Hooks**
   - `useProfileForm.ts` - форма профиля
   - `useProfileLoader.ts` - загрузка данных

8. **Components**
   - `PlatformCard.tsx` - карточка платформы
   - `BloggerInfo.tsx` - информация блогера

---

## 🛠️ Best Practices

### 1. Используйте describe/it структуру

```typescript
describe('FunctionName', () => {
  describe('when condition X', () => {
    it('should do Y', () => {
      // test
    });
  });
});
```

### 2. Тестируйте edge cases

```typescript
it('should handle empty string', () => {});
it('should handle null', () => {});
it('should handle undefined', () => {});
it('should handle very large numbers', () => {});
```

### 3. Используйте beforeEach для setup

```typescript
describe('MyClass', () => {
  let instance: MyClass;

  beforeEach(() => {
    instance = new MyClass();
  });

  it('should work', () => {
    expect(instance.method()).toBe(true);
  });
});
```

### 4. Мокайте внешние зависимости

```typescript
vi.mock('@/api/client', () => ({
  apiRequest: vi.fn(),
}));
```

### 5. Тестируйте один сценарий за раз

```typescript
// ❌ Плохо
it('should create user and send email and log action', () => {});

// ✅ Хорошо
it('should create user', () => {});
it('should send email after user creation', () => {});
it('should log user creation action', () => {});
```

---

## 📊 Текущий статус

| Компонент | Тесты созданы | Статус |
|-----------|---------------|--------|
| **API Core** | ✅ 3 файла (455 строк) | Примеры готовы |
| **Type Guards** | ⏳ Шаблоны | Нужна реализация |
| **PlatformService** | ⏳ Шаблоны | Нужна реализация |
| **Mappers** | ⏳ Шаблоны | Нужна реализация |

**Примечание**: Для запуска тестов нужно установить Vitest.

---

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test:run
        
      - name: Generate coverage
        run: npm run test:coverage
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 📚 Ресурсы

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [React Hooks Testing Library](https://react-hooks-testing-library.com/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

**Последнее обновление**: 2025-10-16

