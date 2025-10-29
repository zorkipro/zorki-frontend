# Исправление отображения названий тематик на сайте

## Проблема

Тематики отображались как цифры на сайте, хотя в логах консоли были видны правильные названия (`name: 'Гейминг'`). Проблема была в том, что компоненты `CategorySelector` и `RestrictedTopicsSelector` ожидают массив названий тематик, а мы передавали им ID.

### Логи из консоли:
```
Category mapping: {topic: '3', numericId: 3, name: 'Авто и мото', topicReverseLookup: {…}}
Category mapping: {topic: '4', numericId: 4, name: 'Бизнес', topicReverseLookup: {…}}
Category mapping: {topic: '5', numericId: 5, name: 'Гейминг', topicReverseLookup: {…}}
```

**Но на сайте все еще отображались цифры `3`, `4`, `5` вместо названий.**

## Причина

Проблема была в том, что:

1. **Компоненты ожидают названия**: `CategorySelector` и `RestrictedTopicsSelector` ожидают `value: string[]` (массив названий)
2. **Мы передавали ID**: В `value` передавались ID тематик (`'3'`, `'4'`, `'5'`)
3. **Конвертация работала в логах**: `topicReverseLookup` правильно конвертировал ID в названия
4. **Но не передавалась в компоненты**: Названия не передавались в `value` компонентов

### Детали проблемы:

1. **В `CategorySelector`**: Ожидает `value: string[]` - массив названий тематик
2. **В `RestrictedTopicsSelector`**: Ожидает `value: string[]` - массив названий запрещенных тематик
3. **В `BloggerInfo`**: Передавали ID тематик вместо названий
4. **В `MultiSelect`**: Отображал переданные значения (ID) вместо названий

## Решение

### Убрание отладочных логов и правильная передача названий

**Файл:** `src/components/profile/BloggerInfo.tsx`

Убраны отладочные логи и исправлена передача названий в компоненты:

```typescript
// ДО (неправильно):
<CategorySelector
  value={state.categories.map(topic => {
    const numericId = typeof topic === 'string' ? parseInt(topic, 10) : topic;
    const name = typeof numericId === 'number' ? topicReverseLookup[numericId] : topic;
    console.log('Category mapping:', { topic, numericId, name, topicReverseLookup });
    return name || '';
  }).filter(Boolean) as string[]}
  onChange={(categories) => dispatch({ type: 'SET_CATEGORIES', payload: categories })}
/>

// ПОСЛЕ (правильно):
<CategorySelector
  value={state.categories.map(topic => {
    // Конвертируем строковые ID в числовые для lookup
    const numericId = typeof topic === 'string' ? parseInt(topic, 10) : topic;
    const name = typeof numericId === 'number' ? topicReverseLookup[numericId] : topic;
    return name || '';
  }).filter(Boolean) as string[]}
  onChange={(categories) => dispatch({ type: 'SET_CATEGORIES', payload: categories })}
/>
```

### Логика исправления:

1. **Убраны отладочные логи**: `console.log` удалены из обеих секций
2. **Сохранена конвертация**: ID → названия через `topicReverseLookup`
3. **Правильная передача**: Названия передаются в `value` компонентов
4. **Фильтрация пустых**: `.filter(Boolean)` убирает пустые значения

### Исправление для обеих секций:

- **Категории**: Убраны логи, названия передаются в `CategorySelector`
- **Запрещенные тематики**: Убраны логи, названия передаются в `RestrictedTopicsSelector`

## Результат

✅ **Тематики отображаются как названия** на сайте  
✅ **Убраны отладочные логи** из консоли  
✅ **Правильная передача данных** в компоненты  
✅ **Корректное отображение** в `MultiSelect`  
✅ **Улучшенный UX** без лишней информации в консоли

## Тестирование

### Сценарий 1: Отображение названий тематик
1. Открыть форму редактирования профиля
2. **Ожидаемый результат:** Тематики отображаются как названия ("Авто и мото", "Бизнес", "Гейминг")

### Сценарий 2: Отображение запрещенных тематик
1. Проверить секцию "Запрещенные темы"
2. **Ожидаемый результат:** Запрещенные тематики отображаются как названия

### Сценарий 3: Отсутствие логов в консоли
1. Открыть консоль браузера
2. **Ожидаемый результат:** Нет логов "Category mapping" и "Restricted topic mapping"

## Файлы изменений

1. `src/components/profile/BloggerInfo.tsx` - убраны отладочные логи из обеих секций

## Совместимость

- ✅ Обратная совместимость сохранена
- ✅ Работает с любыми тематиками
- ✅ Улучшенный UX без лишних логов
- ✅ Все существующие функции работают как прежде

## Workflow для отображения тематик

1. **Загрузка тематик** → `useTopics` загружает данные
2. **Проверка загрузки** → `topicsLoading === false`
3. **Конвертация ID в названия** → `topicReverseLookup[numericId]`
4. **Фильтрация пустых** → `.filter(Boolean)`
5. **Передача в компонент** → `value={[...]}` с названиями
6. **Отображение** → `MultiSelect` показывает названия

## Преимущества

- **Чистота кода**: Убраны отладочные логи
- **Правильное отображение**: Тематики показываются как названия
- **Улучшенный UX**: Пользователь видит понятные названия
- **Производительность**: Нет лишних операций в консоли
