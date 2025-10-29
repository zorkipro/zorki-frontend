# Исправление множественных API запросов при загрузке скриншотов

## Проблема

Предыдущее решение создавало проблему с производительностью - отправлялись сотни запросов на бэкенд. В функции `loadScreenshotsForAllPlatforms` делался отдельный запрос `getBloggerById` для каждой платформы, что приводило к множественным дублирующим запросам.

### Описание проблемы:
- Отправлялись сотни запросов на бэкенд
- Каждая платформа вызывала отдельный `getBloggerById` запрос
- Дублирование данных в запросах
- Проблемы с производительностью и нагрузкой на сервер

## Причина

Проблема была в том, что в цикле `for` для каждой платформы делался отдельный запрос к API:

```typescript
// ПРОБЛЕМНЫЙ КОД:
for (const platform of platforms) {
  const response = await getBloggerById(Number(profile.id)); // ❌ Отдельный запрос для каждой платформы
  // обработка данных...
}
```

### Детали проблемы:

1. **Множественные запросы**: Для каждой платформы (Instagram, YouTube, TikTok, Telegram) делался отдельный запрос
2. **Дублирование данных**: Все запросы возвращали одинаковые данные профиля
3. **Нагрузка на сервер**: Сотни запросов создавали избыточную нагрузку
4. **Медленная загрузка**: Множественные запросы замедляли загрузку страницы

## Решение

### Оптимизация до одного запроса для всех платформ

**Файл:** `src/pages/ProfileEditor.tsx`

Исправлена функция `loadScreenshotsForAllPlatforms` для использования одного запроса:

```typescript
// ДО (неправильно):
const loadScreenshotsForAllPlatforms = useCallback(async () => {
  const platforms = Object.keys(availablePlatforms).filter(p => p !== 'settings');
  
  // Загружаем скриншоты для каждой платформы последовательно
  for (const platform of platforms) {
    try {
      // ❌ Отдельный запрос для каждой платформы
      const response = await getBloggerById(Number(profile.id));
      // обработка данных...
    } catch (error) {
      console.warn(`Failed to load screenshots for ${platform}:`, error);
    }
  }
}, [profile?.id, availablePlatforms, handleScreenshotsUpdate]);

// ПОСЛЕ (правильно):
const loadScreenshotsForAllPlatforms = useCallback(async () => {
  const platforms = Object.keys(availablePlatforms).filter(p => p !== 'settings');
  
  try {
    // ✅ ОДИН запрос для всех платформ
    const response = await getBloggerById(Number(profile.id));
    
    // Обрабатываем скриншоты для всех платформ из одного ответа
    platforms.forEach(platform => {
      let platformScreenshots: any[] = [];
      
      // Проверяем одобренные платформы
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
            
            platformScreenshots.push(...screenshots);
          }
        }
      }
      
      // Проверяем платформы на модерации
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
            
            platformScreenshots.push(...screenshots);
          }
        }
      }
      
      // Обновляем скриншоты для платформы только если они есть
      if (platformScreenshots.length > 0) {
        handleScreenshotsUpdate(platform, platformScreenshots);
      }
    });
  } catch (error) {
    console.warn('Failed to load screenshots for all platforms:', error);
  }
}, [profile?.id, availablePlatforms, handleScreenshotsUpdate]);
```

### Логика оптимизации:

1. **Один запрос**: Делаем `getBloggerById` только один раз
2. **Обработка всех платформ**: Используем `forEach` для обработки всех платформ из одного ответа
3. **Фильтрация по платформе**: Проверяем `social.type.toLowerCase() === platform`
4. **Объединение скриншотов**: Собираем скриншоты для каждой платформы
5. **Обновление состояния**: Вызываем `handleScreenshotsUpdate` только для платформ со скриншотами

### Преимущества оптимизации:

- **Производительность**: Один запрос вместо множественных
- **Нагрузка на сервер**: Значительно снижена нагрузка на бэкенд
- **Скорость загрузки**: Быстрее загружается страница
- **Эффективность**: Используем данные из одного ответа

## Результат

✅ **Один запрос** вместо сотен запросов  
✅ **Оптимизированная производительность**  
✅ **Снижена нагрузка на сервер**  
✅ **Быстрая загрузка скриншотов**  
✅ **Сохранена функциональность**

## Тестирование

### Сценарий 1: Проверка количества запросов
1. Открыть DevTools → Network
2. Открыть форму редактирования профиля
3. **Ожидаемый результат:** Только один запрос `getBloggerById`

### Сценарий 2: Загрузка скриншотов
1. Проверить отображение скриншотов на всех табах
2. **Ожидаемый результат:** Скриншоты отображаются на всех платформах

### Сценарий 3: Производительность
1. Измерить время загрузки страницы
2. **Ожидаемый результат:** Быстрая загрузка без задержек

## Файлы изменений

1. `src/pages/ProfileEditor.tsx` - оптимизирована функция `loadScreenshotsForAllPlatforms`

## Совместимость

- ✅ Обратная совместимость сохранена
- ✅ Функциональность не изменена
- ✅ Все скриншоты отображаются корректно
- ✅ Производительность улучшена

## Workflow для оптимизированной загрузки

1. **Инициализация** → `loadScreenshotsForAllPlatforms` вызывается
2. **Один запрос** → `getBloggerById(profile.id)` выполняется один раз
3. **Обработка данных** → Данные обрабатываются для всех платформ
4. **Фильтрация** → Скриншоты фильтруются по платформам
5. **Обновление состояния** → `handleScreenshotsUpdate` вызывается для каждой платформы
6. **Отображение** → Скриншоты отображаются на всех табах

## Преимущества

- **Эффективность**: Один запрос вместо множественных
- **Производительность**: Быстрая загрузка страницы
- **Масштабируемость**: Решение работает для любого количества платформ
- **Надежность**: Меньше точек отказа
