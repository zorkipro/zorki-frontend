# Исправление мгновенного отображения скриншотов

## Проблема

После загрузки скриншота пользователь не видел его сразу - нужно было обновлять страницу чтобы увидеть новый скриншот. Это создавало плохой пользовательский опыт.

## Причина

Проблема была в том, что после загрузки скриншота обновлялось только локальное состояние `screenshots` в `useScreenshotManager`, но не обновлялся объект `availablePlatforms` в `useProfileData`. Компонент `ScreenshotManagement` получал скриншоты из `stats.screenshots` (который берется из `availablePlatforms`), а не из локального состояния `useScreenshotManager`.

### Детали проблемы:

1. **В `useScreenshotManager`**: После загрузки скриншота обновлялось только локальное состояние `setScreenshots`
2. **В `ProfileEditor`**: `availablePlatforms` не обновлялся после загрузки скриншота
3. **В `PlatformProfileForm`**: Компонент `ScreenshotManagement` получал скриншоты из `stats.screenshots` (из `availablePlatforms`), а не из локального состояния

## Решение

### 1. Добавление callback в `useScreenshotManager`

**Файл:** `src/hooks/profile/useScreenshotManager.ts`

Добавлен новый параметр `onScreenshotsUpdate` для callback функции:

```typescript
export const useScreenshotManager = (
  profileId?: string,
  platform: string = "instagram",
  isEditorPage: boolean = false,
  onScreenshotsUpdate?: (platform: string, screenshots: Screenshot[]) => void,
) => {
```

### 2. Обновление функций загрузки и удаления

**Функция `uploadScreenshot`:**

```typescript
const uploadScreenshot = useCallback(
  async (file: File, userId: string) => {
    const result = await upload(file, userId);
    if (result && profileId) {
      const newScreenshots = [result, ...screenshots];
      setScreenshots(newScreenshots);
      
      // Обновляем availablePlatforms если есть callback
      if (onScreenshotsUpdate) {
        onScreenshotsUpdate(platform, newScreenshots);
      }
    }
  },
  [upload, profileId, setScreenshots, screenshots, onScreenshotsUpdate, platform],
);
```

**Функция `uploadMultipleScreenshots`:**

```typescript
const uploadMultipleScreenshots = useCallback(
  async (files: File[], userId: string) => {
    const results = await uploadMultiple(files, userId);
    if (results.length > 0 && profileId) {
      const newScreenshots = [...results, ...screenshots];
      setScreenshots(newScreenshots);
      
      // Обновляем availablePlatforms если есть callback
      if (onScreenshotsUpdate) {
        onScreenshotsUpdate(platform, newScreenshots);
      }
    }
  },
  [uploadMultiple, profileId, setScreenshots, screenshots, onScreenshotsUpdate, platform],
);
```

**Функция `deleteScreenshot`:**

```typescript
// Обновляем кеш - удаляем скриншот из списка
const newScreenshots = screenshots.filter((s) => s.id !== screenshot.id);
setScreenshots(newScreenshots);

// Обновляем availablePlatforms если есть callback
if (onScreenshotsUpdate) {
  onScreenshotsUpdate(platform, newScreenshots);
}
```

### 3. Добавление callback в `ProfileEditor`

**Файл:** `src/pages/ProfileEditor.tsx`

Добавлен callback для обновления `availablePlatforms`:

```typescript
// Callback для обновления availablePlatforms после загрузки скриншотов
const handleScreenshotsUpdate = useCallback(
  (platform: string, screenshots: any[]) => {
    setAvailablePlatforms((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        screenshots: screenshots,
      },
    }));
  },
  [setAvailablePlatforms],
);

// Передаем callback в useScreenshotManager
const {
  screenshots,
  uploading: uploadingScreenshot,
  loading: loadingScreenshots,
  error: screenshotError,
  uploadScreenshot,
  uploadMultipleScreenshots,
  deleteScreenshot,
} = useScreenshotManager(
  profile?.id,
  activeTab === "settings"
    ? "instagram"
    : (activeTab as "instagram" | "tiktok" | "youtube" | "telegram"),
  true, // isEditorPage = true для страницы редактирования
  handleScreenshotsUpdate, // Callback для обновления availablePlatforms
);
```

## Результат

✅ **Скриншоты отображаются мгновенно** после загрузки  
✅ **Скриншоты исчезают мгновенно** после удаления  
✅ **Работает для всех платформ** (Instagram, YouTube, TikTok, Telegram)  
✅ **Работает для множественной загрузки**  
✅ **Обратная совместимость** сохранена  
✅ **Синхронизация состояния** между `useScreenshotManager` и `availablePlatforms`

## Тестирование

### Сценарий 1: Одиночная загрузка
1. Открыть таб Instagram
2. Загрузить один скриншот
3. **Ожидаемый результат:** Скриншот появляется сразу без обновления страницы

### Сценарий 2: Множественная загрузка
1. Открыть таб YouTube
2. Загрузить несколько скриншотов одновременно
3. **Ожидаемый результат:** Все скриншоты появляются сразу

### Сценарий 3: Удаление
1. Удалить скриншот
2. **Ожидаемый результат:** Скриншот исчезает сразу

### Сценарий 4: Переключение между платформами
1. Загрузить скриншоты для Instagram
2. Переключиться на YouTube
3. Загрузить скриншоты для YouTube
4. Вернуться на Instagram
5. **Ожидаемый результат:** Скриншоты Instagram остались на месте

## Файлы изменений

1. `src/hooks/profile/useScreenshotManager.ts` - добавлен callback `onScreenshotsUpdate`
2. `src/pages/ProfileEditor.tsx` - добавлен callback `handleScreenshotsUpdate`

## Совместимость

- ✅ Обратная совместимость сохранена
- ✅ Существующие функции работают как прежде
- ✅ Callback опциональный - если не передан, работает как раньше
- ✅ Все существующие проверки (валидация, лимиты файлов) продолжают работать

## Workflow для мгновенного отображения

1. **Пользователь загружает скриншот** → файл сохраняется на сервере
2. **`useScreenshotManager` обновляет локальное состояние** → `setScreenshots`
3. **Вызывается callback `onScreenshotsUpdate`** → обновляется `availablePlatforms`
4. **Компонент `ScreenshotManagement` получает новые скриншоты** → из `stats.screenshots`
5. **Скриншот отображается мгновенно** → без необходимости обновления страницы

## Преимущества

- **Лучший UX**: Пользователь видит результат сразу
- **Синхронизация**: Состояние остается согласованным
- **Производительность**: Не нужно перезагружать данные с сервера
- **Надежность**: Работает для всех операций (загрузка, удаление, множественная загрузка)
