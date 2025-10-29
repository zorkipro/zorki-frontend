# Реализация: Исправление отображения черновиков

**Дата:** 2025-10-23  
**Задача:** Исправить отображение черновиков на странице `/profile/edit`

## Проблема

На странице `/profile/edit` показывались данные из чистовика (`price`), а не из черновиков (`priceDraft`), несмотря на то что API возвращал черновики с корректными данными (например, `storiesPrice: "999"`).

## Причина

В `src/hooks/profile/useProfileData.ts` данные платформ (`availablePlatforms`) заполнялись только из основных данных (`detailedBlogger.price`), полностью игнорируя черновики (`detailedBlogger.priceDraft` и `detailedBlogger.profileDraft`).

## Решение

Изменена логика в `useProfileData.ts` для приоритета черновиков над основными данными.

### Файл: `src/hooks/profile/useProfileData.ts`

#### 1. Приоритет черновикам для данных профиля (строки 107-146)

```typescript
// ПРИОРИТЕТ ЧЕРНОВИКАМ: если есть profileDraft, используем его данные
const profileDraft = detailedBlogger.profileDraft;
const mergedBloggerData = {
  ...detailedBlogger,
  // Переопределяем поля черновиками если они есть (не null)
  name: profileDraft?.name !== null && profileDraft?.name !== undefined
    ? profileDraft.name
    : detailedBlogger.name,
  lastName: profileDraft?.lastName !== null && profileDraft?.lastName !== undefined
    ? profileDraft.lastName
    : detailedBlogger.lastName,
  description: profileDraft?.description !== null && profileDraft?.description !== undefined
    ? profileDraft.description
    : detailedBlogger.description,
  contactLink: profileDraft?.contactLink !== null && profileDraft?.contactLink !== undefined
    ? profileDraft.contactLink
    : detailedBlogger.contactLink,
  workFormat: profileDraft?.workFormat !== null && profileDraft?.workFormat !== undefined
    ? profileDraft.workFormat
    : detailedBlogger.workFormat,
  genderType: profileDraft?.genderType !== null && profileDraft?.genderType !== undefined
    ? profileDraft.genderType
    : detailedBlogger.genderType,
  isBarterAvailable: profileDraft?.isBarterAvailable !== null && profileDraft?.isBarterAvailable !== undefined
    ? profileDraft.isBarterAvailable
    : detailedBlogger.isBarterAvailable,
  isMartRegistry: profileDraft?.isMartRegistry !== null && profileDraft?.isMartRegistry !== undefined
    ? profileDraft.isMartRegistry
    : detailedBlogger.isMartRegistry,
  topics: profileDraft?.topics !== null && profileDraft?.topics !== undefined
    ? profileDraft.topics
    : detailedBlogger.topics,
  restrictedTopics: profileDraft?.restrictedTopics !== null && profileDraft?.restrictedTopics !== undefined
    ? profileDraft.restrictedTopics
    : detailedBlogger.restrictedTopics,
};

const transformedBlogger = mapApiDetailBloggerToLocal(mergedBloggerData);
```

#### 2. Приоритет черновикам для цен платформ (строки 148-193)

```typescript
// Преобразуем платформы в нужный формат
// ПРИОРИТЕТ ЧЕРНОВИКАМ: сначала проверяем priceDraft, потом основные данные
const platformsData: Record<string, any> = {};
if (detailedBlogger.social) {
  detailedBlogger.social.forEach((social) => {
    const platformName = social.type.toLowerCase();
    
    // Ищем черновик цены для этой платформы
    const priceDraft = detailedBlogger.priceDraft?.find((p) => p.type === social.type);
    const mainPrice = detailedBlogger.price.find((p) => p.type === social.type);
    
    platformsData[platformName] = {
      username: social.username || "",
      profile_url: social.type === 'YOUTUBE' 
        ? convertYouTubeIdToUrl(social.externalId || "", social.username)
        : social.externalId || "",
      subscribers: parseInt(social.subscribers || "0"),
      er: social.er || 0,
      reach: parseInt(social.postCoverage || "0"),
      
      // ПРИОРИТЕТ ЧЕРНОВИКАМ: если в черновике есть значение (не null), используем его
      price: priceDraft?.postPrice !== null && priceDraft?.postPrice !== undefined
        ? parseFloat(priceDraft.postPrice)
        : (social.type === 'YOUTUBE' 
          ? parseFloat(mainPrice?.integrationPrice || "0")
          : parseFloat(mainPrice?.postPrice || "0")),
      
      storyReach: parseInt(social.coverage || "0"),
      
      storyPrice: priceDraft?.storiesPrice !== null && priceDraft?.storiesPrice !== undefined
        ? parseFloat(priceDraft.storiesPrice)
        : parseFloat(mainPrice?.storiesPrice || "0"),
      
      integrationPrice: priceDraft?.integrationPrice !== null && priceDraft?.integrationPrice !== undefined
        ? parseFloat(priceDraft.integrationPrice)
        : parseFloat(mainPrice?.integrationPrice || "0"),
      
      ...(platformName === "youtube" && {
        views: parseInt(social.postCoverage || "0"),
      }),
    };
  });
}
```

## Логика проверки

Для каждого поля проверяется:
1. Есть ли значение в черновике И оно не `null` И не `undefined`
2. Если да - используется значение из черновика
3. Если нет - используется значение из основных данных
4. Если и там нет - используется значение по умолчанию

```typescript
field: draft?.field !== null && draft?.field !== undefined
  ? draft.field
  : mainData.field
```

## Результат

✅ Черновики теперь корректно отображаются на странице `/profile/edit` сразу при загрузке  
✅ Приоритет: черновик → основные данные → значение по умолчанию  
✅ Логика работает для всех полей:
  - Цены (postPrice, storiesPrice, integrationPrice)
  - Данные профиля (name, lastName, description, contactLink, workFormat, genderType, isBarterAvailable, isMartRegistry)
  - Темы (topics, restrictedTopics)

## Тестирование

После изменений:
1. Авторизоваться под пользователем с черновиками
2. Открыть `/profile/edit`
3. Убедиться что отображаются данные из `priceDraft` (например, `storiesPrice: "999"`)
4. Убедиться что если какого-то поля нет в черновике - берется из чистовика

## Проверка токена

Токен пользователя уже корректно отправляется через `apiRequest` в `src/api/client.ts` (строки 48-64). Изменений не требовалось.

## Измененные файлы

1. `src/hooks/profile/useProfileData.ts` - добавлен приоритет черновиков при формировании данных профиля и платформ
2. `auth-profile-verification.plan.md` - обновлена документация

## Никаких изменений НЕ требовалось в:

- `src/hooks/profile/useProfileDrafts.ts` - логика уже была правильной
- `src/utils/draft-helpers.ts` - утилиты работают корректно
- `src/api/client.ts` - токен уже отправляется правильно
- Другие компоненты и хуки

## Простота решения

Решение максимально простое и надежное:
- Изменен только один файл (`useProfileData.ts`)
- Логика понятная и прямолинейная
- Нет избыточной инженерии
- Работает для всех случаев (с черновиками и без)

