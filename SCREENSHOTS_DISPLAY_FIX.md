# Исправление отображения скриншотов

## Проблема

Скриншоты не отображались после загрузки и обновления страницы на `/profile/edit`. Пользователи видели пустые блоки скриншотов, хотя файлы были загружены и сохранялись на сервере.

## Причина

Проблема была в том, что скриншоты не передавались в компонент `ScreenshotManagement` из данных платформы. В `useProfileData.ts` скриншоты не добавлялись в объект `availablePlatforms`, а в `PlatformProfileForm.tsx` использовался отдельный проп `screenshots` вместо `stats.screenshots`.

### Детали проблемы:

1. **В `useProfileData.ts`**: При создании `platformsData` скриншоты из `social.statsFiles` не добавлялись в объект платформы
2. **В `PlatformProfileForm.tsx`**: Компонент `ScreenshotManagement` получал скриншоты из отдельного пропа `screenshots`, а не из `stats.screenshots`

## Решение

### 1. Добавление скриншотов в `useProfileData.ts`

**Файл:** `src/hooks/profile/useProfileData.ts`

Добавлено поле `screenshots` в объект платформы для одобренных платформ:

```typescript
platformsData[platformName] = {
  // ... существующие поля ...
  
  // Добавляем скриншоты из statsFiles
  screenshots: social.statsFiles?.map(file => ({
    id: file.id,
    influencer_id: detailedBlogger.id,
    platform: social.type.toLowerCase(),
    file_name: file.name,
    file_url: file.publicUrl,
    file_size: file.size * 1024, // Конвертируем KB в байты
    width: file.width,
    height: file.height,
    created_at: file.createdAt,
    is_draft: false,
  })) || [],
  
  // ... остальные поля ...
};
```

**Аналогично для платформ на модерации:**

```typescript
// Добавляем скриншоты из statsFiles для платформ на модерации
screenshots: socialDraft.statsFiles?.map(file => ({
  id: file.id,
  influencer_id: detailedBlogger.id,
  platform: socialDraft.type.toLowerCase(),
  file_name: file.name,
  file_url: file.publicUrl,
  file_size: file.size * 1024, // Конвертируем KB в байты
  width: file.width,
  height: file.height,
  created_at: file.createdAt,
  is_draft: false,
})) || [],
```

### 2. Исправление передачи скриншотов в `PlatformProfileForm.tsx`

**Файл:** `src/components/profile/organisms/PlatformProfileForm.tsx`

Изменена передача скриншотов в компонент `ScreenshotManagement`:

```typescript
// ДО (неправильно):
<ScreenshotManagement
  platform={platform}
  screenshots={screenshots} // Использовался отдельный проп
  // ...
/>

// ПОСЛЕ (правильно):
<ScreenshotManagement
  platform={platform}
  screenshots={stats.screenshots || []} // Используем скриншоты из данных платформы
  // ...
/>
```

## Результат

✅ **Скриншоты отображаются** после загрузки страницы  
✅ **Скриншоты сохраняются** после обновления страницы  
✅ **Работает для всех платформ** (Instagram, YouTube, TikTok, Telegram)  
✅ **Работает для платформ на модерации** (socialMediaDrafts)  
✅ **Обратная совместимость** сохранена

## Тестирование

### Сценарий 1: Одобренные платформы
1. Загрузить скриншоты для Instagram
2. Обновить страницу
3. **Ожидаемый результат:** Скриншоты отображаются в табе Instagram

### Сценарий 2: Платформы на модерации
1. Добавить YouTube на модерацию
2. Загрузить скриншоты для YouTube
3. Обновить страницу
4. **Ожидаемый результат:** Скриншоты отображаются в табе YouTube

### Сценарий 3: Множественные платформы
1. Загрузить скриншоты для нескольких платформ
2. Переключаться между табами
3. **Ожидаемый результат:** Скриншоты отображаются для каждой платформы

## Файлы изменений

1. `src/hooks/profile/useProfileData.ts` - добавлены скриншоты в `availablePlatforms`
2. `src/components/profile/organisms/PlatformProfileForm.tsx` - исправлена передача скриншотов в `ScreenshotManagement`

## Совместимость

- ✅ Обратная совместимость сохранена
- ✅ Существующие скриншоты продолжают работать
- ✅ Интерфейс `PlatformData` уже содержал поле `screenshots?: Screenshot[]`
- ✅ Все существующие функции (загрузка, удаление, просмотр) работают как прежде

## Workflow для скриншотов

1. **Пользователь загружает скриншот** → файл сохраняется в `statsFiles`
2. **Данные загружаются** → `useProfileData` включает скриншоты в `availablePlatforms`
3. **Компонент отображает** → `ScreenshotManagement` получает скриншоты из `stats.screenshots`
4. **Обновление страницы** → скриншоты сохраняются и отображаются корректно
