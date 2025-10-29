# Исправление отображения скриншотов Instagram

## Проблема

На вкладке Instagram не отображались добавленные скриншоты. Пользователи видели пустой блок скриншотов, хотя файлы были загружены и сохранялись на сервере.

## Причина

Проблема была в том, что `useScreenshotLoader` искал скриншоты только в одобренных платформах (`bloggerData.social`), но не проверял платформы на модерации (`socialMediaDrafts`). Если Instagram находился на модерации, его скриншоты не загружались.

### Детали проблемы:

1. **В `useScreenshotLoader.ts`**: Проверялись только `bloggerData.social` для поиска скриншотов
2. **Instagram на модерации**: Если Instagram находился в `socialMediaDrafts`, его скриншоты игнорировались
3. **Неполная логика**: Отсутствовала проверка `socialMediaDrafts` для загрузки скриншотов

## Решение

### Расширение логики поиска скриншотов

**Файл:** `src/hooks/profile/useScreenshotLoader.ts`

Добавлена проверка платформ на модерации (`socialMediaDrafts`):

```typescript
// Сначала проверяем одобренные платформы
if (bloggerData.social) {
  for (const social of bloggerData.social) {
    if (social.type.toLowerCase() === platform.toLowerCase() && social.statsFiles) {
      // Преобразуем API формат в локальный формат Screenshot
      const platformScreenshotsData = social.statsFiles.map(file => ({
        id: file.id,
        influencer_id: Number(profileId),
        platform: social.type.toLowerCase(),
        file_name: file.name,
        file_url: file.publicUrl,
        file_size: file.size * 1024, // Конвертируем KB в байты
        width: file.width,
        height: file.height,
        created_at: file.createdAt,
        is_draft: false,
      }));
      
      platformScreenshots.push(...platformScreenshotsData);
    }
  }
}

// Затем проверяем платформы на модерации (socialMediaDrafts)
if (bloggerData.socialMediaDrafts) {
  for (const socialDraft of bloggerData.socialMediaDrafts) {
    if (socialDraft.type.toLowerCase() === platform.toLowerCase() && socialDraft.statsFiles) {
      // Преобразуем API формат в локальный формат Screenshot
      const platformScreenshotsData = socialDraft.statsFiles.map(file => ({
        id: file.id,
        influencer_id: Number(profileId),
        platform: socialDraft.type.toLowerCase(),
        file_name: file.name,
        file_url: file.publicUrl,
        file_size: file.size * 1024, // Конвертируем KB в байты
        width: file.width,
        height: file.height,
        created_at: file.createdAt,
        is_draft: false,
      }));
      
      platformScreenshots.push(...platformScreenshotsData);
    }
  }
}
```

### Логика поиска скриншотов:

1. **Сначала проверяем одобренные платформы** (`bloggerData.social`)
2. **Затем проверяем платформы на модерации** (`bloggerData.socialMediaDrafts`)
3. **Объединяем все найденные скриншоты** в один массив
4. **Преобразуем API формат** в локальный формат `Screenshot`

## Результат

✅ **Скриншоты Instagram отображаются** независимо от статуса модерации  
✅ **Работает для всех платформ** (Instagram, YouTube, TikTok, Telegram)  
✅ **Работает для одобренных платформ** и платформ на модерации  
✅ **Обратная совместимость** сохранена  
✅ **Консистентность** с логикой в `useProfileData`

## Тестирование

### Сценарий 1: Instagram одобрен
1. Instagram находится в `social` (одобрен)
2. Загрузить скриншоты для Instagram
3. **Ожидаемый результат:** Скриншоты отображаются на вкладке Instagram

### Сценарий 2: Instagram на модерации
1. Instagram находится в `socialMediaDrafts` (на модерации)
2. Загрузить скриншоты для Instagram
3. **Ожидаемый результат:** Скриншоты отображаются на вкладке Instagram

### Сценарий 3: Другие платформы
1. Загрузить скриншоты для YouTube, TikTok, Telegram
2. **Ожидаемый результат:** Скриншоты отображаются для всех платформ

### Сценарий 4: Переключение между платформами
1. Загрузить скриншоты для разных платформ
2. Переключаться между табами
3. **Ожидаемый результат:** Скриншоты отображаются для каждой платформы

## Файлы изменений

1. `src/hooks/profile/useScreenshotLoader.ts` - добавлена проверка `socialMediaDrafts` для поиска скриншотов

## Совместимость

- ✅ Обратная совместимость сохранена
- ✅ Существующие скриншоты продолжают работать
- ✅ Логика для одобренных платформ не изменилась
- ✅ Все существующие функции (загрузка, удаление, просмотр) работают как прежде

## Workflow для скриншотов Instagram

1. **Пользователь загружает скриншот** → файл сохраняется в `statsFiles`
2. **`useScreenshotLoader` ищет скриншоты** → проверяет `social` и `socialMediaDrafts`
3. **Находит скриншоты Instagram** → независимо от статуса модерации
4. **Преобразует в локальный формат** → `Screenshot[]`
5. **Отображает в интерфейсе** → через `ScreenshotManagement`

## Преимущества

- **Полнота**: Находит скриншоты для всех статусов платформ
- **Консистентность**: Логика соответствует `useProfileData`
- **Надежность**: Работает для всех сценариев
- **Простота**: Минимальные изменения в коде
