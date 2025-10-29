# Исправление асинхронной загрузки тематик

## Проблема

Тематики отображались как цифры вместо текста из-за асинхронной загрузки `topicReverseLookup`. Компонент `BloggerInfo` рендерился до того, как тематики полностью загружались.

### Логи из консоли:
```
Category mapping: {topic: '3', numericId: 3, name: undefined, topicReverseLookup: {…}}
Category mapping: {topic: '4', numericId: 4, name: undefined, topicReverseLookup: {…}}
Category mapping: '5', numericId: 5, name: undefined, topicReverseLookup: {…}}

// Потом после загрузки:
Category mapping: {topic: '3', numericId: 3, name: 'Авто и мото', topicReverseLookup: {…}}
Category mapping: {topic: '4', numericId: 4, name: 'Бизнес', topicReverseLookup: {…}}
Category mapping: {topic: '5', numericId: 5, name: 'Гейминг', topicReverseLookup: {…}}
```

## Причина

Проблема была в том, что:

1. **Асинхронная загрузка**: `useTopics` загружает тематики асинхронно
2. **Ранний рендеринг**: `BloggerInfo` рендерится до полной загрузки `topicReverseLookup`
3. **Пустой lookup**: В момент первого рендера `topicReverseLookup` пустой
4. **Отображение ID**: Если `name` undefined, показывается исходное значение (ID)

### Детали проблемы:

1. **В `useTopics`**: Тематики загружаются асинхронно через API
2. **В `BloggerInfo`**: Компонент рендерится сразу, не дожидаясь загрузки
3. **В `topicReverseLookup`**: Сначала пустой объект `{}`, потом заполняется
4. **В конвертации**: `topicReverseLookup[3]` возвращает `undefined` до загрузки

## Решение

### Добавление проверки на загрузку тематик

**Файл:** `src/components/profile/BloggerInfo.tsx`

Добавлена проверка `topicsLoading` перед рендерингом компонентов с тематиками:

```typescript
// ДО (неправильно):
<CategorySelector
  value={state.categories.map(topic => {
    const numericId = typeof topic === 'string' ? parseInt(topic, 10) : topic;
    const name = typeof numericId === 'number' ? topicReverseLookup[numericId] : topic;
    return name || '';
  }).filter(Boolean) as string[]}
  onChange={(categories) => dispatch({ type: 'SET_CATEGORIES', payload: categories })}
/>

// ПОСЛЕ (правильно):
{topicsLoading ? (
  <div className="flex items-center justify-center p-3 text-sm text-muted-foreground">
    Загрузка тематик...
  </div>
) : (
  <CategorySelector
    value={state.categories.map(topic => {
      const numericId = typeof topic === 'string' ? parseInt(topic, 10) : topic;
      const name = typeof numericId === 'number' ? topicReverseLookup[numericId] : topic;
      return name || '';
    }).filter(Boolean) as string[]}
    onChange={(categories) => dispatch({ type: 'SET_CATEGORIES', payload: categories })}
  />
)}
```

### Логика загрузки:

1. **Получаем статус загрузки**: `const { topicLookup, topicReverseLookup, loading: topicsLoading } = useTopics();`
2. **Проверяем загрузку**: `{topicsLoading ? ... : ...}`
3. **Показываем индикатор**: "Загрузка тематик..." пока `topicsLoading === true`
4. **Рендерим компонент**: Только после полной загрузки `topicReverseLookup`

### Исправление для обеих секций:

- **Категории**: Добавлена проверка `topicsLoading` перед `CategorySelector`
- **Запрещенные тематики**: Добавлена проверка `topicsLoading` перед `RestrictedTopicsSelector`

## Результат

✅ **Тематики отображаются как текст** после полной загрузки  
✅ **Индикатор загрузки** показывается во время загрузки тематик  
✅ **Нет мигания цифр** - компонент рендерится только после загрузки  
✅ **Правильная последовательность** загрузки и отображения  
✅ **Улучшенный UX** с индикатором загрузки

## Тестирование

### Сценарий 1: Проверка индикатора загрузки
1. Открыть форму редактирования профиля
2. **Ожидаемый результат:** Виден индикатор "Загрузка тематик..." и "Загрузка запрещенных тематик..."

### Сценарий 2: Отображение тематик после загрузки
1. Дождаться завершения загрузки тематик
2. **Ожидаемый результат:** Тематики отображаются как текст (названия)

### Сценарий 3: Отсутствие мигания цифр
1. Обновить страницу несколько раз
2. **Ожидаемый результат:** Никогда не видны цифры вместо названий тематик

## Файлы изменений

1. `src/components/profile/BloggerInfo.tsx` - добавлена проверка `topicsLoading` для обеих секций

## Совместимость

- ✅ Обратная совместимость сохранена
- ✅ Работает с любыми тематиками
- ✅ Улучшенный UX с индикаторами загрузки
- ✅ Все существующие функции работают как прежде

## Workflow для загрузки тематик

1. **Компонент монтируется** → `BloggerInfo` рендерится
2. **Проверка загрузки** → `topicsLoading === true`
3. **Показ индикатора** → "Загрузка тематик..."
4. **Загрузка тематик** → `useTopics` загружает данные
5. **Завершение загрузки** → `topicsLoading === false`
6. **Рендер компонентов** → `CategorySelector` и `RestrictedTopicsSelector`
7. **Отображение тематик** → тематики показываются как текст

## Преимущества

- **Надежность**: Компонент рендерится только после загрузки данных
- **UX**: Индикатор загрузки улучшает пользовательский опыт
- **Стабильность**: Нет мигания цифр вместо названий
- **Производительность**: Избегаем лишних рендеров с пустыми данными
