# 🐛 История исправлений

Хронологический список всех значимых исправлений в проекте Zorki.

---

## 16 октября 2025

### Race Condition в ProfileChecker

**Проблема**: Пользователя редиректило на `/profile-setup` ДО загрузки данных из `/auth/client/me`, даже если username был валидным.

**Причина**: Race Condition - ProfileChecker проверял профиль до того, как BloggerContext успел загрузить данные из API.

**Решение**:
- Исправлен файл `src/components/ProfileChecker.tsx`
- Проверка НЕ запускается пока `bloggerInfoLoading === true`
- Проверка НЕ запускается если есть `user`, но нет `bloggerInfo` (ждем начала загрузки)
- Loader показывается пока загружаются данные
- Флаг `hasCheckedRef` устанавливается только после загрузки данных

**Измененные файлы**:
- `src/components/ProfileChecker.tsx` - исправлен race condition
- `src/utils/profile-navigation.ts` - улучшена валидация username

**Результат**: 
- ✅ Больше никаких преждевременных редиректов
- ✅ Показывается loader во время загрузки
- ✅ Валидация происходит только после загрузки данных

---

### Упрощение логики авторизации

**Проблема**: После авторизации пользователь с валидным `username` редиректился на `/profile-setup`, хотя в ответе API `/auth/client/me` приходил username.

**Решение**: Убрана проверка обязательности полей `name` и `lastName` из логики валидации профиля.

**Изменения**:

1. **`src/utils/profile-navigation.ts`**:
   - Упрощена функция `validateBloggerInfo()` - проверяет только `username` и `verificationStatus`
   - Обновлен тип `BloggerValidationResult` (убран `'incomplete_profile'`)
   - Упрощена функция `determineRedirectPath()`

2. **`src/components/ProfileChecker.tsx`**:
   - Улучшена логика определения причины редиректа
   - Добавлен импорт `validateBloggerInfo`

**Результат**:
- ✅ Если есть `username` (любое имя/фамилия) → остаемся на главной
- ❌ Если нет `username` → редирект на `/profile-setup`
- ❌ Если нет `blogger` → редирект на `/profile-setup`
- ❌ Если статус `REJECTED` → редирект на `/profile-setup`

---

## 15 октября 2025

### Обновление логики редиректов

**Проблема**: Сложная система редиректов с параметризованными URL типа `/profile/:username/edit`.

**Решение**: Переход на упрощенную систему редиректов с короткими URL.

**Изменения**:

1. **Обновлены типы API** (`src/api/types.ts`):
   - Добавлено поле `username: string` в `ClientBloggerInfo`
   - Добавлено поле `username: string` в `ClientLinkRequestInfo`

2. **Упрощен маршрут профиля** (`src/App.tsx`):
   - Было: `/profile/:username/edit`
   - Стало: `/profile/edit`

3. **Обновлена логика ProfileChecker** (`src/components/ProfileChecker.tsx`):
   - Проверка наличия `username` перед редиректом
   - Упрощенная логика навигации

4. **Обновлены все ссылки**:
   - `src/hooks/dashboard/useDashboardNavigation.ts`
   - `src/pages/ProfileSetup.tsx`
   - `src/components/layout/Header.tsx`

**Преимущества**:
- 🎯 Простота - короткая ссылка `/profile/edit`
- 🔒 Безопасность - не раскрывает username в URL
- 📈 Масштабируемость - легко добавлять новые функции
- 🔄 Консистентность - все пользователи используют одинаковый URL

---

### Исправления enum'ов и типов

**Проблема**: 
- Дефолтные значения в мапперах API
- Некорректная типизация компонентов
- Проблемы с `null` значениями

**Решение**:

1. **Мапперы API** (`src/utils/api/mappers.ts`):
   - Убраны дефолтные значения
   - Добавлена корректная типизация с `undefined`

2. **Типы Blogger** (`src/types/blogger.ts`):
   - Поля `gender`, `legalForm`, `workFormat` стали опциональными

3. **Компоненты профилей** (`src/components/profile/SidebarComponents.tsx`):
   - Улучшена типизация состояний

4. **Blogger Transform** (`src/utils/bloggerTransform.ts`):
   - Заменены дефолтные значения на `undefined`

**Результат**:
- ✅ Данные отображаются только из базы данных
- ✅ Корректная обработка `null` значений из API
- ✅ Улучшенная типизация для предотвращения ошибок
- ✅ Более точное отображение информации о блогерах

---

## Статистика исправлений

| Дата | Исправление | Файлов изменено | Статус |
|------|-------------|-----------------|--------|
| 16.10.2025 | Race Condition | 2 | ✅ |
| 16.10.2025 | Упрощение авторизации | 2 | ✅ |
| 15.10.2025 | Обновление редиректов | 9 | ✅ |
| 15.10.2025 | Исправления enum'ов | 4 | ✅ |

**Всего**: 17 файлов изменено, 4 критических исправления

---

## Связанные документы

- **[CHANGELOG.md](CHANGELOG.md)** - полная история изменений
- **[WHAT_CHANGED.md](WHAT_CHANGED.md)** - что изменилось в версии 2.0
- **[docs/REFACTORING_SUMMARY.md](docs/REFACTORING_SUMMARY.md)** - итоги SOLID рефакторинга

---

_Последнее обновление: 17 января 2025_
