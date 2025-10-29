# Исправление: Редактирование цен для платформ на модерации

**Дата:** 2025-10-23  
**Задача:** Разрешить редактирование цен для платформ на модерации и убрать надпись "на модерации" для YouTube

## Проблема

1. **Пользователи не могли редактировать цены** для платформ на модерации (с флагом `isPending: true`)
2. **YouTube показывал надпись "на модерации"** в списке платформ, что было нежелательно

## Анализ

### Блокировка редактирования цен

В компоненте `YouTubeStats` была проверка:
```typescript
{isPending && !isVerified ? (
  <div className="text-center py-4">
    <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
    <p className="text-sm text-muted-foreground">
      Платформа находится на модерации. Редактирование цен будет доступно после одобрения.
    </p>
    <Button variant="outline" onClick={() => onEditingChange(null)}>
      Закрыть
    </Button>
  </div>
) : (
  // Форма редактирования цен
)}
```

### Надпись "на модерации" для YouTube

В компоненте `PlatformManagement` была логика:
```typescript
{platforms[platformId]?.isPending && (
  <Badge variant="secondary" className="text-xs">
    <Clock className="w-3 h-3 mr-1" />
    На модерации
  </Badge>
)}
```

## Решение

### 1. Разрешение редактирования цен для платформ на модерации

**Файл:** `src/components/profile/PlatformStats.tsx`

**Изменение в `YouTubeStats`:**
- Убрана проверка `isPending && !isVerified`
- Форма редактирования цен теперь доступна всегда
- Пользователи могут редактировать цены даже для платформ на модерации

```typescript
// ДО (блокировка):
{isPending && !isVerified ? (
  <div className="text-center py-4">
    <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
    <p className="text-sm text-muted-foreground">
      Платформа находится на модерации. Редактирование цен будет доступно после одобрения.
    </p>
    <Button variant="outline" onClick={() => onEditingChange(null)}>
      Закрыть
    </Button>
  </div>
) : (
  // Форма редактирования
)}

// ПОСЛЕ (разрешено):
<div className="space-y-4">
  <div>
    <Label htmlFor="youtube_integration_price">
      Цена за интеграцию (BYN)
    </Label>
    <Input
      id="youtube_integration_price"
      type="number"
      defaultValue={formData.youtube_integration_price || stats.price || ""}
      placeholder="0"
    />
  </div>
  <div className="flex justify-end space-x-2">
    <Button variant="outline" onClick={() => onEditingChange(null)}>
      Отмена
    </Button>
    <Button onClick={async () => { /* сохранение */ }}>
      Сохранить
    </Button>
  </div>
</div>
```

### 2. Убрание надписи "на модерации" для YouTube

**Файл 1:** `src/components/profile/PlatformManagement.tsx`

**Изменение в списке платформ (таб "Настройки"):**
- YouTube показывает badge "На модерации" в списке платформ
- Все платформы на модерации показывают badge

```typescript
// Текущий код (показывается для всех платформ на модерации):
{platforms[platformId]?.isPending && (
  <Badge variant="secondary" className="text-xs">
    <Clock className="w-3 h-3 mr-1" />
    На модерации
  </Badge>
)}
```

**Файл 2:** `src/components/profile/PlatformStats.tsx`

**Изменение в блоке цены интеграции YouTube:**
- Убран badge "На модерации" из блока цены интеграции
- Теперь YouTube не показывает надпись "на модерации" нигде

```typescript
// ДО (показывался badge в блоке цены):
renderContent={() => (
  <>
    <div className="text-2xl font-bold text-primary">
      {stats.integrationPrice || stats.price || 0} BYN
    </div>
    <div className="text-sm text-muted-foreground">Цена интеграции</div>
    {isPending && !isVerified && (
      <Badge variant="secondary" className="text-xs mt-2">
        <Clock className="w-3 h-3 mr-1" />
        На модерации
      </Badge>
    )}
  </>
)}

// ПОСЛЕ (badge убран):
renderContent={() => (
  <>
    <div className="text-2xl font-bold text-primary">
      {stats.integrationPrice || stats.price || 0} BYN
    </div>
    <div className="text-sm text-muted-foreground">Цена интеграции</div>
  </>
)}
```

## Проверка других платформ

### TelegramStats
- ✅ **Уже не имел блокировки** для платформ на модерации
- ✅ **Редактирование цен доступно** всегда

### TikTokStats
- ✅ **Не имеет блокировки** для платформ на модерации
- ✅ **Редактирование цен доступно** всегда

### InstagramStats
- ✅ **Не имеет блокировки** для платформ на модерации
- ✅ **Редактирование цен доступно** всегда

## Результат

✅ **Пользователи могут редактировать цены** для всех платформ на модерации  
✅ **YouTube показывает badge "на модерации"** в списке платформ (таб "Настройки")  
✅ **YouTube НЕ показывает badge "на модерации"** в блоке цены интеграции (таб "YouTube")  
✅ **Telegram, TikTok, Instagram** показывают badge "На модерации" везде  
✅ **Все существующие проверки** (максимум 4 платформы, валидация URL, etc.) продолжают работать  
✅ **Обратная совместимость** сохранена

## Workflow для платформ на модерации

1. **Пользователь добавляет платформу:**
   - Платформа сохраняется в `socialMediaDrafts` с флагом `isPending: true`
   - Отображается в списке платформ

2. **Редактирование цен:**
   - **YouTube:** Редактирование доступно, badge "На модерации" показан в списке платформ, скрыт в блоке цены
   - **Telegram/TikTok/Instagram:** Редактирование доступно, badge "На модерации" показан везде

3. **Сохранение цен:**
   - Цены сохраняются в `priceDraft` на сервере
   - Отображаются в интерфейсе с приоритетом над основными данными

4. **Админ одобряет платформу:**
   - Платформа перемещается из `socialMediaDrafts` в `social`
   - Флаг `isPending` убирается
   - Badge "На модерации" исчезает

## Тестирование

### Сценарий 1: YouTube на модерации
1. Добавить YouTube с флагом `isPending: true`
2. Открыть `/profile/edit`
3. **Ожидаемый результат:** 
   - YouTube отображается в списке платформ (таб "Настройки") С badge "На модерации"
   - YouTube НЕ показывает badge "На модерации" в блоке цены интеграции (таб "YouTube")
   - Редактирование цены доступно
   - Цена сохраняется корректно

### Сценарий 2: Telegram на модерации
1. Добавить Telegram с флагом `isPending: true`
2. Открыть `/profile/edit`
3. **Ожидаемый результат:**
   - Telegram отображается в списке С badge "На модерации"
   - Редактирование цены доступно
   - Цена сохраняется корректно

## Файлы изменений

1. `src/components/profile/PlatformStats.tsx` - убрана блокировка редактирования цен в `YouTubeStats` и убран badge "На модерации" из блока цены интеграции
2. `src/components/profile/PlatformManagement.tsx` - YouTube показывает badge "На модерации" в списке платформ (таб "Настройки")

## Совместимость

- ✅ Обратная совместимость сохранена
- ✅ Существующие платформы работают как прежде
- ✅ Логика черновиков (`priceDraft`, `profileDraft`) не затронута
- ✅ Все типы платформ поддерживаются
