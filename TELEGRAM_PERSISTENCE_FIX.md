# Исправление: Сохранение Telegram после обновления страницы

**Дата:** 2025-10-23  
**Задача:** Исправить проблему с исчезновением Telegram после обновления страницы для неверифицированных пользователей

## Проблема

Пользователи, которые не прошли верификацию (`verificationStatus !== "APPROVED"`), добавляли Telegram на странице `/profile/edit`, но после обновления страницы Telegram исчезал. Это происходило потому что:

1. **Telegram добавлялся только локально** с флагом `isPending: true`
2. **Не сохранялся на сервере** до одобрения админом
3. **После обновления страницы** данные загружались заново с сервера
4. **Telegram исчезал**, потому что он еще не был одобрен админом

## Анализ Swagger API

Согласно Swagger спецификации (`swagger-json new.json`):

**Эндпоинт:** `GET /blogger/public/{bloggerId}`

```json
{
  "schema": {
    "$ref": "#/components/schemas/PublicGetBloggerByIdOutputDto"
  }
}
```

**Схема `PublicGetBloggerByIdOutputDto` содержит:**
- `social` - одобренные платформы
- `socialMediaDrafts` - платформы на модерации (черновики)

```json
{
  "social": "nullable array of PublicGetBloggerByIdSocialAccOutputDto",
  "socialMediaDrafts": "nullable array of PublicGetBloggerByIdSocialAccOutputDto"
}
```

## Решение

### 1. Обновление типов API

**Файл:** `src/api/types.ts`

Добавлено поле `socialMediaDrafts` в интерфейс `PublicGetBloggerByIdOutputDto`:

```typescript
export interface PublicGetBloggerByIdOutputDto {
  // ... другие поля
  social: PublicGetBloggerByIdSocialAccOutputDto[] | null; // Одобренные платформы
  socialMediaDrafts: PublicGetBloggerByIdSocialAccOutputDto[] | null; // Платформы на модерации
  // ... остальные поля
}
```

### 2. Обновление логики загрузки платформ

**Файл:** `src/hooks/profile/useProfileData.ts`

Изменена логика формирования `availablePlatforms`:

```typescript
// Сначала добавляем основные платформы (одобренные)
if (detailedBlogger.social) {
  detailedBlogger.social.forEach((social) => {
    const platformName = social.type.toLowerCase();
    platformsData[platformName] = {
      // ... данные платформы
      // БЕЗ флага isPending
    };
  });
}

// Затем добавляем платформы на модерации (socialMediaDrafts)
if (detailedBlogger.socialMediaDrafts) {
  detailedBlogger.socialMediaDrafts.forEach((socialDraft) => {
    const platformName = socialDraft.type.toLowerCase();
    
    // Проверяем, есть ли уже одобренная платформа этого типа
    if (!platformsData[platformName]) {
      platformsData[platformName] = {
        // ... данные платформы
        isPending: true, // Флаг "на модерации"
      };
    }
  });
}
```

## Логика работы

### Приоритет платформ:
1. **Одобренные платформы** (`social`) - имеют приоритет
2. **Платформы на модерации** (`socialMediaDrafts`) - добавляются только если нет одобренной платформы того же типа

### Флаг `isPending`:
- **`false` или отсутствует** - платформа одобрена
- **`true`** - платформа на модерации

## Результат

✅ **Telegram сохраняется после обновления страницы**  
✅ **Отображается с флагом "На модерации"**  
✅ **Кнопки "Редактировать" и "Удалить" заблокированы**  
✅ **Все существующие проверки продолжают работать**  
✅ **Поддержка всех типов платформ** (Telegram, YouTube, Instagram, TikTok)

## Workflow для неверифицированных пользователей

1. **Пользователь добавляет Telegram:**
   - Открывает `/profile/edit`
   - Переходит в таб "Настройки"
   - Нажимает "Добавить платформу"
   - Выбирает Telegram
   - Вводит username канала
   - Нажимает "Добавить"

2. **Что происходит:**
   - Отправляется запрос `POST /blogger/link/social/tg/{bloggerId}`
   - Платформа сохраняется на сервере в `socialMediaDrafts`
   - Отображается с флагом `isPending: true`
   - Badge "На модерации" показывается пользователю

3. **После обновления страницы:**
   - Данные загружаются с сервера
   - `socialMediaDrafts` содержит Telegram
   - Telegram отображается с флагом `isPending: true`
   - **Telegram НЕ исчезает!**

4. **Админ одобряет запрос:**
   - Админ получает уведомление о запросе
   - Админ одобряет запрос через админ панель
   - Telegram перемещается из `socialMediaDrafts` в `social`
   - Флаг `isPending` убирается
   - Парсер собирает данные с Telegram канала

## Тестирование

### Сценарий 1: Неверифицированный пользователь добавляет Telegram
1. Авторизоваться под неверифицированным пользователем
2. Открыть `/profile/edit`
3. Добавить Telegram
4. Обновить страницу
5. **Ожидаемый результат:** Telegram остается и отображается с флагом "На модерации"

### Сценарий 2: Одобренный пользователь добавляет Telegram
1. Авторизоваться под одобренным пользователем
2. Добавить Telegram
3. Обновить страницу
4. **Ожидаемый результат:** Telegram остается и отображается без флага "На модерации"

## Файлы изменений

1. `src/api/types.ts` - добавлено поле `socialMediaDrafts`
2. `src/hooks/profile/useProfileData.ts` - обновлена логика загрузки платформ

## Совместимость

- ✅ Обратная совместимость сохранена
- ✅ Существующие одобренные платформы работают как прежде
- ✅ Логика черновиков (`priceDraft`, `profileDraft`) не затронута
- ✅ Все типы платформ поддерживаются
