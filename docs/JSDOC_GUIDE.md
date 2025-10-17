# JSDoc Guide

Руководство по написанию JSDoc комментариев для проекта Zorki.

## 📋 Стандарты JSDoc

### Базовый формат

```typescript
/**
 * Краткое описание функции (1-2 предложения)
 * 
 * Более подробное описание если необходимо.
 * Может быть многострочным.
 * 
 * @param paramName - описание параметра
 * @param optionalParam - описание опционального параметра (опционально)
 * @returns описание возвращаемого значения
 * @throws {ErrorType} когда бросается ошибка
 * 
 * @example
 * const result = functionName('value');
 * console.log(result); // Output: ...
 */
export function functionName(paramName: string, optionalParam?: number): ReturnType {
  // ...
}
```

---

## 🎯 Примеры для разных типов кода

### 1. Функции-утилиты

```typescript
/**
 * Проверяет является ли значение валидным email адресом
 * 
 * @param email - строка для проверки
 * @returns true если email валиден, иначе false
 * 
 * @example
 * isValidEmail('user@example.com'); // true
 * isValidEmail('invalid'); // false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

### 2. React Hooks

```typescript
/**
 * Hook для управления состоянием формы профиля блогера
 * 
 * Предоставляет методы для создания, обновления и валидации данных профиля.
 * Автоматически синхронизируется с серверным состоянием.
 * 
 * @param bloggerId - ID блогера (опционально для нового профиля)
 * @returns объект с данными формы и методами управления
 * 
 * @example
 * const { formData, updateField, saveProfile, errors } = useProfileForm(123);
 * 
 * updateField('name', 'John Doe');
 * await saveProfile();
 */
export function useProfileForm(bloggerId?: number): ProfileFormHookReturn {
  // ...
}
```

### 3. Классы и Services

```typescript
/**
 * Сервис для работы с социальными платформами
 * 
 * Предоставляет единый API для работы с разными социальными сетями
 * (Instagram, TikTok, YouTube, Telegram).
 * 
 * @example
 * const platform = PlatformService.getInstance();
 * const config = platform.getPlatformConfig('instagram');
 * const isValid = platform.isValidPlatformUrl('instagram', url);
 */
export class PlatformService {
  private static instance: PlatformService;
  
  /**
   * Получить singleton instance сервиса
   * 
   * @returns единственный экземпляр PlatformService
   */
  static getInstance(): PlatformService {
    if (!PlatformService.instance) {
      PlatformService.instance = new PlatformService();
    }
    return PlatformService.instance;
  }
  
  /**
   * Получить конфигурацию для платформы
   * 
   * @param platform - название платформы
   * @returns конфигурация платформы или undefined
   * @throws {Error} если платформа не поддерживается
   */
  getPlatformConfig(platform: SocialPlatform): PlatformConfig {
    // ...
  }
}
```

### 4. Type Guards

```typescript
/**
 * Проверяет является ли значение валидной социальной платформой
 * 
 * Type guard для сужения типа до SocialPlatform.
 * 
 * @param value - значение для проверки
 * @returns true если value является SocialPlatform
 * 
 * @example
 * if (isSocialPlatform(userInput)) {
 *   // TypeScript знает что userInput: SocialPlatform
 *   const config = getPlatformConfig(userInput);
 * }
 */
export function isSocialPlatform(value: unknown): value is SocialPlatform {
  return (
    typeof value === 'string' &&
    ['instagram', 'tiktok', 'youtube', 'telegram'].includes(value)
  );
}
```

### 5. React Components

```typescript
/**
 * Props для компонента PlatformCard
 */
export interface PlatformCardProps {
  /** Название платформы */
  platform: SocialPlatform;
  /** URL профиля платформы */
  profileUrl: string;
  /** Количество подписчиков */
  followers: number;
  /** Callback при клике на карточку */
  onClick?: () => void;
}

/**
 * Карточка социальной платформы блогера
 * 
 * Отображает информацию о профиле блогера на конкретной платформе.
 * Поддерживает клик для перехода к редактированию.
 * 
 * @example
 * <PlatformCard
 *   platform="instagram"
 *   profileUrl="https://instagram.com/user"
 *   followers={10000}
 *   onClick={() => navigate('/edit')}
 * />
 */
export const PlatformCard: React.FC<PlatformCardProps> = React.memo(({ 
  platform, 
  profileUrl, 
  followers, 
  onClick 
}) => {
  // ...
});
```

### 6. Асинхронные функции

```typescript
/**
 * Загружает данные блогера с сервера
 * 
 * Выполняет HTTP запрос к API для получения информации о блогере.
 * Автоматически обрабатывает ошибки и повторяет запрос при сбоях.
 * 
 * @param bloggerId - ID блогера
 * @param options - опции запроса
 * @returns Promise с данными блогера
 * @throws {APIError} при ошибке запроса
 * @throws {ValidationError} если bloggerId невалиден
 * 
 * @example
 * try {
 *   const blogger = await fetchBloggerData(123);
 *   console.log(blogger.name);
 * } catch (error) {
 *   if (error instanceof APIError) {
 *     console.error('API Error:', error.message);
 *   }
 * }
 */
export async function fetchBloggerData(
  bloggerId: number,
  options?: FetchOptions
): Promise<BloggerData> {
  // ...
}
```

---

## 🏷️ Основные теги JSDoc

| Тег | Назначение | Пример |
|-----|-----------|--------|
| `@param` | Параметр функции | `@param userId - ID пользователя` |
| `@returns` | Возвращаемое значение | `@returns массив блогеров` |
| `@throws` | Бросаемые ошибки | `@throws {APIError} при ошибке сети` |
| `@example` | Пример использования | `@example const data = fn(123);` |
| `@deprecated` | Устаревший код | `@deprecated использовать newFn вместо` |
| `@see` | Ссылка на связанный код | `@see {@link OtherFunction}` |
| `@since` | Версия добавления | `@since 2.0.0` |
| `@template` | Generic параметр | `@template T extends BaseType` |

---

## ✅ Checklist для JSDoc

При написании JSDoc комментария убедитесь:

- [ ] Краткое описание на первой строке
- [ ] Все параметры описаны с `@param`
- [ ] Возвращаемое значение описано с `@returns`
- [ ] Исключения описаны с `@throws`
- [ ] Есть хотя бы один `@example`
- [ ] Используется корректная терминология
- [ ] Нет опечаток и грамматических ошибок
- [ ] Описание актуально

---

## 🎨 Стиль написания

### ✅ Хорошо

```typescript
/**
 * Валидирует email адрес с использованием регулярного выражения
 * 
 * @param email - строка для проверки
 * @returns true если email валиден, иначе false
 * 
 * @example
 * isValidEmail('user@example.com'); // true
 */
export function isValidEmail(email: string): boolean {
  // ...
}
```

### ❌ Плохо

```typescript
/**
 * checks email
 */
export function isValidEmail(email: string): boolean {
  // ...
}
```

### Почему плохо:
- Нет описания параметров
- Нет описания возвращаемого значения
- Нет примера
- Описание слишком краткое
- Описание на английском (в русскоязычном проекте)

---

## 📊 Приоритет документирования

### Высокий приоритет (обязательно)

1. **Публичные API функции**
   - Все экспортируемые функции
   - Методы классов
   - Хуки React

2. **Сложная бизнес-логика**
   - Функции с > 20 строк кода
   - Алгоритмы
   - Валидация

3. **Type Guards**
   - Функции с `value is Type`

### Средний приоритет (желательно)

1. **Утилиты**
   - Helper функции
   - Formatters
   - Converters

2. **Компоненты**
   - React компоненты
   - Props interfaces

### Низкий приоритет (опционально)

1. **Приватные функции**
   - Внутренние хелперы
   - Очевидная логика

2. **Простые функции**
   - < 5 строк кода
   - Очевидное назначение

---

## 🛠️ Инструменты

### VS Code Extensions

1. **Document This** - автогенерация JSDoc
2. **Better Comments** - подсветка комментариев
3. **JSDoc Markdown** - поддержка markdown в JSDoc

### Генерация документации

```bash
# TypeDoc (для генерации HTML документации)
npm install --save-dev typedoc
npx typedoc --out docs src
```

---

## 📝 Шаблоны

### Шаблон для функции

```typescript
/**
 * [Краткое описание что делает функция]
 * 
 * [Более подробное описание если нужно]
 * 
 * @param param1 - [описание]
 * @param param2 - [описание]
 * @returns [что возвращает]
 * @throws {ErrorType} [когда бросает ошибку]
 * 
 * @example
 * [пример использования]
 */
```

### Шаблон для хука

```typescript
/**
 * Hook для [назначение хука]
 * 
 * [Дополнительное описание поведения]
 * 
 * @param param - [описание]
 * @returns объект с [что возвращает]
 * 
 * @example
 * const { data, loading } = useHook(param);
 */
```

### Шаблон для класса

```typescript
/**
 * [Назначение класса]
 * 
 * [Дополнительная информация о классе]
 * 
 * @example
 * const instance = ClassName.getInstance();
 * instance.method();
 */
export class ClassName {
  /**
   * [Описание метода]
   * 
   * @param param - [описание]
   * @returns [что возвращает]
   */
  method(param: Type): ReturnType {
    // ...
  }
}
```

---

## 📚 Ресурсы

- [JSDoc Official Documentation](https://jsdoc.app/)
- [TypeScript JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [Google JavaScript Style Guide - Comments](https://google.github.io/styleguide/jsguide.html#jsdoc)

**Последнее обновление**: 2025-10-16

