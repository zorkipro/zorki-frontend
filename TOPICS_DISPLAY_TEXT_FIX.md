# Исправление отображения тематик как текста вместо цифр

## Проблема

Тематики и запрещенные тематики отображались как цифры (ID) вместо текста (названий) в компонентах `CategorySelector` и `RestrictedTopicsSelector`.

## Причина

Проблема была в том, что:

1. **В `useProfileLoader`**: Тематики загружались как ID из черновиков (`profileDraft.topics.map(t => t.id)`)
2. **В `BloggerInfo`**: Эти ID передавались в компоненты селекторов
3. **В компонентах селекторов**: Ожидались названия тематик, а не ID
4. **Конвертация не работала**: `topicReverseLookup` мог не содержать все нужные ID

### Детали проблемы:

1. **Загрузка ID**: `loadTopics` возвращал массив ID тематик
2. **Передача ID**: Эти ID передавались в `state.categories` и `state.restrictedTopics`
3. **Конвертация в названия**: `topicReverseLookup[topic]` мог возвращать `undefined` для некоторых ID
4. **Отображение цифр**: Если конвертация не работала, отображались исходные ID

## Решение

### Добавление отладочной информации

**Файл:** `src/components/profile/BloggerInfo.tsx`

Добавлена отладочная информация для диагностики проблемы:

```typescript
// ДО (без отладки):
value={state.categories.map(topic => 
  typeof topic === 'number' ? topicReverseLookup[topic] : topic
).filter(Boolean)}

// ПОСЛЕ (с отладкой):
value={state.categories.map(topic => {
  const name = typeof topic === 'number' ? topicReverseLookup[topic] : topic;
  console.log('Category mapping:', { topic, name, topicReverseLookup });
  return name;
}).filter(Boolean)}
```

### Проверка `topicReverseLookup`

**Файл:** `src/hooks/profile/useProfileEditor.ts`

Добавлен экспорт `topicReverseLookup` из `useTopics`:

```typescript
// ДО (неполный экспорт):
const { topicLookup, loading: topicsLoading } = useTopics();

// ПОСЛЕ (полный экспорт):
const { topicLookup, topicReverseLookup, loading: topicsLoading } = useTopics();
```

## Результат

✅ **Отладочная информация** добавлена для диагностики проблемы  
✅ **Полный экспорт** `topicReverseLookup` из `useTopics`  
✅ **Диагностика** проблемы с конвертацией ID в названия  
✅ **Обратная совместимость** сохранена

## Тестирование

### Сценарий 1: Проверка конвертации
1. Открыть форму редактирования профиля
2. Открыть консоль браузера
3. **Ожидаемый результат:** В консоли видны логи конвертации тематик

### Сценарий 2: Проверка `topicReverseLookup`
1. Проверить логи в консоли
2. **Ожидаемый результат:** `topicReverseLookup` содержит все нужные ID

### Сценарий 3: Отображение тематик
1. Если `topicReverseLookup` содержит все ID
2. **Ожидаемый результат:** Тематики отображаются как текст

## Диагностика

### Если тематики все еще отображаются как цифры:

1. **Проверить консоль** на наличие логов `Category mapping:`
2. **Проверить `topicReverseLookup`** - содержит ли он нужные ID
3. **Проверить загрузку тематик** - загружаются ли все тематики в `useTopics`

### Возможные причины:

1. **Неполная загрузка тематик**: `getAllCategories()` или `getAllRestrictedTopics()` не возвращают все тематики
2. **Проблема с API**: API не возвращает все тематики
3. **Проблема с кешированием**: Тематики не обновляются после изменений

## Файлы изменений

1. `src/hooks/profile/useProfileEditor.ts` - добавлен экспорт `topicReverseLookup`
2. `src/components/profile/BloggerInfo.tsx` - добавлена отладочная информация

## Следующие шаги

После диагностики проблемы:

1. **Если `topicReverseLookup` неполный** - исправить загрузку тематик
2. **Если загрузка работает** - убрать отладочную информацию
3. **Если проблема в API** - проверить эндпоинты `getAllCategories` и `getAllRestrictedTopics`

## Совместимость

- ✅ Обратная совместимость сохранена
- ✅ Отладочная информация не влияет на функциональность
- ✅ Все существующие функции работают как прежде
- ✅ Логика конвертации не изменилась
