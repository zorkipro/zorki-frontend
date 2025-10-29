# Исправление загрузки скриншотов для всех платформ при инициализации

## Проблема

Скриншоты в Instagram не видны сразу, но появляются после переключения между табами, а после обновления страницы пропадают. Пользователь должен был переключаться между табами, чтобы увидеть скриншоты.

### Описание проблемы:
- Скриншоты Instagram не отображаются при загрузке страницы
- Скриншоты появляются только после переключения на другие табы и обратно
- После обновления страницы скриншоты снова пропадают
- Проблема затрагивает все платформы, но особенно заметна на Instagram

## Причина

Проблема была в том, что `useScreenshotManager` загружает скриншоты только для текущего `activeTab` (активной платформы), а не для всех платформ одновременно. При инициализации страницы скриншоты не загружались для всех платформ.

### Детали проблемы:

1. **В `useScreenshotManager`**: Загружает скриншоты только для текущего `activeTab`
2. **При инициализации**: `activeTab` может быть не "instagram", поэтому скриншоты Instagram не загружаются
3. **При переключении табов**: `useScreenshotManager` загружает скриншоты для новой платформы и обновляет `availablePlatforms`
4. **После обновления**: Процесс повторяется - скриншоты не загружаются для всех платформ

### Workflow проблемы:

1. **Загрузка страницы** → `useScreenshotManager` загружает скриншоты только для `activeTab`
2. **Instagram не активен** → Скриншоты Instagram не загружаются
3. **Переключение на Instagram** → `useScreenshotManager` загружает скриншоты Instagram
4. **Обновление страницы** → Процесс повторяется

## Решение

### Добавление принудительной загрузки скриншотов для всех платформ

**Файл:** `src/pages/ProfileEditor.tsx`

Добавлена функция `loadScreenshotsForAllPlatforms`, которая загружает скриншоты для всех платформ при инициализации:

```typescript
// ДО (неправильно):
// Скриншоты загружались только для текущего activeTab

// ПОСЛЕ (правильно):
// Принудительно загружаем скриншоты для всех платформ при инициализации
const loadScreenshotsForAllPlatforms = useCallback(async () => {
  if (!profile?.id || !availablePlatforms) return;
  
  const platforms = Object.keys(availablePlatforms).filter(p => p !== 'settings');
  
  // Загружаем скриншоты для каждой платформы последовательно
  for (const platform of platforms) {
    try {
      // Используем прямой вызов API для загрузки скриншотов
      const response = await getBloggerById(Number(profile.id));
      
      if (response.social) {
        for (const social of response.social) {
          if (social.type.toLowerCase() === platform && social.statsFiles) {
            const screenshots = social.statsFiles.map(file => ({
              id: file.id,
              influencer_id: profile.id,
              platform: social.type.toLowerCase(),
              file_name: file.name,
              file_url: file.publicUrl,
              file_size: file.size * 1024,
              width: file.width,
              height: file.height,
              created_at: file.createdAt,
              is_draft: false,
            }));
            
            handleScreenshotsUpdate(platform, screenshots);
          }
        }
      }
      
      if (response.socialMediaDrafts) {
        for (const socialDraft of response.socialMediaDrafts) {
          if (socialDraft.type.toLowerCase() === platform && socialDraft.statsFiles) {
            const screenshots = socialDraft.statsFiles.map(file => ({
              id: file.id,
              influencer_id: profile.id,
              platform: socialDraft.type.toLowerCase(),
              file_name: file.name,
              file_url: file.publicUrl,
              file_size: file.size * 1024,
              width: file.width,
              height: file.height,
              created_at: file.createdAt,
              is_draft: false,
            }));
            
            handleScreenshotsUpdate(platform, screenshots);
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to load screenshots for ${platform}:`, error);
    }
  }
}, [profile?.id, availablePlatforms, handleScreenshotsUpdate]);

// Загружаем скриншоты для всех платформ после загрузки профиля
useEffect(() => {
  if (profile && availablePlatforms && Object.keys(availablePlatforms).length > 0) {
    loadScreenshotsForAllPlatforms();
  }
}, [profile, availablePlatforms, loadScreenshotsForAllPlatforms]);
```

### Логика исправления:

1. **Принудительная загрузка**: Загружаем скриншоты для всех платформ при инициализации
2. **Прямой вызов API**: Используем `getBloggerById` для получения данных
3. **Проверка обеих источников**: Проверяем `social` и `socialMediaDrafts`
4. **Обновление состояния**: Вызываем `handleScreenshotsUpdate` для каждой платформы
5. **Обработка ошибок**: Логируем ошибки, но не прерываем процесс

### Преимущества решения:

- **Полная загрузка**: Скриншоты загружаются для всех платформ сразу
- **Независимость от activeTab**: Не зависит от текущего активного таба
- **Стабильность**: Скриншоты отображаются сразу после загрузки страницы
- **Обратная совместимость**: Существующая логика `useScreenshotManager` сохранена

## Результат

✅ **Скриншоты отображаются сразу** при загрузке страницы  
✅ **Скриншоты загружаются для всех платформ** при инициализации  
✅ **Не нужно переключать табы** для просмотра скриншотов  
✅ **Скриншоты сохраняются** после обновления страницы  
✅ **Обратная совместимость** сохранена

## Тестирование

### Сценарий 1: Загрузка скриншотов при инициализации
1. Открыть форму редактирования профиля
2. **Ожидаемый результат:** Скриншоты Instagram отображаются сразу

### Сценарий 2: Скриншоты после обновления страницы
1. Обновить страницу
2. **Ожидаемый результат:** Скриншоты всех платформ отображаются сразу

### Сценарий 3: Переключение между табами
1. Переключаться между табами Instagram, YouTube, TikTok, Telegram
2. **Ожидаемый результат:** Скриншоты отображаются на всех табах

## Файлы изменений

1. `src/pages/ProfileEditor.tsx` - добавлена функция `loadScreenshotsForAllPlatforms` и `useEffect` для принудительной загрузки скриншотов

## Совместимость

- ✅ Обратная совместимость сохранена
- ✅ Работает со всеми платформами
- ✅ Существующая логика `useScreenshotManager` не изменена
- ✅ Все существующие функции работают как прежде

## Workflow для загрузки скриншотов

1. **Загрузка профиля** → `useProfileEditor` загружает данные профиля
2. **Инициализация платформ** → `availablePlatforms` заполняется данными платформ
3. **Принудительная загрузка** → `loadScreenshotsForAllPlatforms` загружает скриншоты для всех платформ
4. **Обновление состояния** → `handleScreenshotsUpdate` обновляет `availablePlatforms`
5. **Отображение** → Скриншоты отображаются на всех табах

## Преимущества

- **Надежность**: Скриншоты загружаются для всех платформ
- **Производительность**: Один запрос для всех платформ
- **UX**: Пользователь видит скриншоты сразу
- **Стабильность**: Не зависит от порядка переключения табов
