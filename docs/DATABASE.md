# 🗄️ База данных Zorki7

## 🎯 Обзор

Zorki7 использует PostgreSQL с Supabase в качестве BaaS платформы. База данных интегрирована с NestJS API backend.

## ⚡ Быстрый обзор

**12 таблиц БД:**
- `influencers` - основная таблица блогеров
- `influencer_profiles` - профили по платформам
- `influencer_platform_stats` - статистика по платформам
- `topics` / `banned_topics` - тематики
- `platforms` - социальные платформы
- И другие...

**Миграции:** `supabase/migrations/`  
**Применение:** `npm run supabase:db:push`

---

## ⚠️ Важная информация

**RLS (Row Level Security) политики ОТКЛЮЧЕНЫ** для упрощения разработки.

Все таблицы имеют полные права доступа для всех пользователей. В продакшене необходимо включить RLS политики для безопасности.

---

## 📐 ENUM типы

База данных использует следующие ENUM типы:

### `platform_type`

Типы социальных платформ:

```sql
CREATE TYPE public.platform_type AS ENUM ('instagram', 'tiktok', 'youtube', 'telegram');
```

### `profile_status`

Статусы профилей блогеров:

```sql
CREATE TYPE public.profile_status AS ENUM ('unverified', 'pending', 'verified');
```

### `data_source`

Источники данных:

```sql
CREATE TYPE public.data_source AS ENUM ('imported', 'scraped', 'graph_api', 'manual');
```

### `edit_status`

Статусы редактирования профилей:

```sql
CREATE TYPE public.edit_status AS ENUM ('new', 'pending', 'approved', 'rejected');
```

---

## 📊 Основные таблицы

### 1. `influencers` - Основная таблица блогеров

Основная таблица для хранения информации о блогерах.

```sql
CREATE TABLE public.influencers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL CHECK (length(full_name) >= 2 AND length(full_name) <= 100),
    avatar_url TEXT CHECK (avatar_url IS NULL OR avatar_url ~ '^https?://'),
    description TEXT CHECK (description IS NULL OR length(description) <= 1000),
    barter_available BOOLEAN DEFAULT FALSE,
    mart_registry BOOLEAN DEFAULT FALSE,
    contact_link TEXT CHECK (contact_link IS NULL OR contact_link ~ '^https?://'),
    work_format TEXT CHECK (work_format IN ('ИП', 'профдоход', 'договор подряда', 'ООО')),
    gender_type TEXT CHECK (gender_type IN ('мужчина', 'женщина', 'пара', 'паблик')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verification_status TEXT CHECK (verification_status IN ('новый', 'на проверке', 'одобрен', 'отклонён')) DEFAULT 'новый',
    visibility_status TEXT CHECK (visibility_status IN ('виден', 'скрыт', 'удалён')) DEFAULT 'виден',
    linked_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

**Поля:**

- `id` - уникальный идентификатор (UUID)
- `full_name` - полное имя блогера (2-100 символов)
- `avatar_url` - URL аватара (должен начинаться с http:// или https://)
- `description` - описание блогера (до 1000 символов)
- `barter_available` - доступен ли бартер
- `mart_registry` - регистрация в марте
- `contact_link` - ссылка для связи
- `work_format` - правовая форма работы ('ИП', 'профдоход', 'договор подряда', 'ООО')
- `gender_type` - тип пола ('мужчина', 'женщина', 'пара', 'паблик')
- `verification_status` - статус верификации ('новый', 'на проверке', 'одобрен', 'отклонён')
- `visibility_status` - статус видимости ('виден', 'скрыт', 'удалён')
- `linked_user_id` - ссылка на пользователя в auth.users
- `created_at`, `updated_at` - временные метки

### 2. `topics` - Тематики блогов

Таблица для хранения тематик блогов.

```sql
CREATE TABLE public.topics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL
);
```

**Поля:**

- `id` - уникальный идентификатор
- `title` - название тематики

### 3. `influencer_topics` - Связь блогеров с тематиками

Связующая таблица для связи блогеров с тематиками (many-to-many).

```sql
CREATE TABLE public.influencer_topics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE
);
```

### 4. `banned_topics` - Запрещенные тематики

Таблица для хранения запрещенных тематик.

```sql
CREATE TABLE public.banned_topics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL
);
```

### 5. `influencer_banned_topics` - Связь блогеров с запрещенными тематиками

Связующая таблица для связи блогеров с запрещенными тематиками (many-to-many).

```sql
CREATE TABLE public.influencer_banned_topics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE,
    banned_topic_id UUID REFERENCES public.banned_topics(id) ON DELETE CASCADE
);
```

### 6. `platforms` - Социальные платформы

Таблица для хранения социальных платформ.

```sql
CREATE TABLE public.platforms (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title platform_type NOT NULL
);
```

**Предустановленные платформы:**
- instagram
- tiktok
- youtube
- telegram

### 7. `influencer_platform_stats` - Статистика по платформам

Статистика блогеров по каждой платформе.

```sql
CREATE TABLE public.influencer_platform_stats (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE,
    platform_id UUID REFERENCES public.platforms(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    profile_url TEXT,
    followers BIGINT DEFAULT 0,
    engagement_rate NUMERIC(5,2),
    post_reach BIGINT DEFAULT 0,
    story_reach BIGINT DEFAULT 0,
    post_price BIGINT DEFAULT 0,
    story_price BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Поля:**

- `id` - уникальный идентификатор
- `influencer_id` - ссылка на блогера
- `platform_id` - ссылка на платформу
- `username` - имя пользователя на платформе
- `profile_url` - URL профиля
- `followers` - количество подписчиков (BIGINT)
- `engagement_rate` - коэффициент вовлеченности (NUMERIC 5,2)
- `post_reach` - охват постов
- `story_reach` - охват сторис
- `post_price` - цена за пост
- `story_price` - цена за сторис
- `updated_at` - дата обновления статистики

### 8. `profiles` - Профили пользователей

Профили пользователей системы.

```sql
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    display_name TEXT,
    instagram_username TEXT,
    primary_profile_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

**Поля:**

- `id` - уникальный идентификатор
- `user_id` - ссылка на пользователя в auth.users (UNIQUE)
- `email` - email пользователя
- `full_name` - полное имя
- `display_name` - отображаемое имя
- `instagram_username` - username в Instagram
- `primary_profile_id` - ссылка на основной профиль блогера

### 9. `influencer_profiles` - Профили блогеров по платформам

Профили блогеров для каждой платформы отдельно.

```sql
CREATE TABLE public.influencer_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    platform platform_type NOT NULL,
    username TEXT NOT NULL CHECK (length(username) >= 1 AND length(username) <= 50),
    full_name TEXT CHECK (full_name IS NULL OR (length(full_name) >= 2 AND length(full_name) <= 100)),
    bio TEXT CHECK (bio IS NULL OR length(bio) <= 500),
    followers_count BIGINT DEFAULT 0,
    following_count BIGINT DEFAULT 0,
    posts_count BIGINT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    profile_picture_url TEXT CHECK (profile_picture_url IS NULL OR profile_picture_url ~ '^https?://'),
    external_url TEXT CHECK (external_url IS NULL OR external_url ~ '^https?://'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    public_visible BOOLEAN DEFAULT FALSE,
    is_business BOOLEAN DEFAULT FALSE,
    avg_reels_views INTEGER DEFAULT 0,
    last_scraped_at TIMESTAMP WITH TIME ZONE,
    source data_source DEFAULT 'manual',
    status profile_status DEFAULT 'unverified',
    UNIQUE(platform, username)
);
```

**Поля:**

- `id` - уникальный идентификатор
- `user_id` - ссылка на пользователя
- `platform` - тип платформы (platform_type ENUM)
- `username` - имя пользователя на платформе (1-50 символов, UNIQUE с platform)
- `full_name` - полное имя (2-100 символов)
- `bio` - биография (до 500 символов)
- `followers_count`, `following_count`, `posts_count` - статистика
- `is_verified` - верифицирован ли аккаунт
- `is_private` - приватный ли аккаунт
- `profile_picture_url` - URL аватара
- `external_url` - внешняя ссылка
- `public_visible` - видимость для публики
- `is_business` - бизнес-аккаунт
- `avg_reels_views` - среднее количество просмотров reels
- `last_scraped_at` - дата последнего парсинга
- `source` - источник данных (data_source ENUM)
- `status` - статус профиля (profile_status ENUM)

**Ограничения:**

- UNIQUE(platform, username) - уникальность комбинации платформы и username

### 10. `platform_screenshots` - Скриншоты профилей

Скриншоты профилей блогеров.

```sql
CREATE TABLE public.platform_screenshots (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    influencer_profile_id UUID REFERENCES public.influencer_profiles(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    platform platform_type,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 11. `profile_edits` - Черновики изменений профилей

Черновики изменений профилей для модерации.

```sql
CREATE TABLE public.profile_edits (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status edit_status DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    influencer_profile_id UUID REFERENCES public.influencer_profiles(id) ON DELETE CASCADE,
    changes_json JSONB CHECK (changes_json IS NULL OR octet_length(changes_json::text) <= 10000)
);
```

**Поля:**

- `id` - уникальный идентификатор
- `user_id` - ссылка на пользователя
- `status` - статус редактирования (edit_status ENUM: 'new', 'pending', 'approved', 'rejected')
- `influencer_profile_id` - ссылка на профиль блогера
- `changes_json` - JSON с изменениями (до 10000 байт)

### 12. `admin_actions` - Действия администраторов

Логирование действий администраторов.

```sql
CREATE TABLE public.admin_actions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('approve', 'reject', 'delete', 'hide', 'edit')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔗 Связи между таблицами

```
auth.users
    ├── (1:1) → profiles (user_id)
    ├── (1:N) → influencer_profiles (user_id)
    ├── (1:N) → platform_screenshots (user_id)
    ├── (1:N) → profile_edits (user_id)
    └── (1:N) → admin_actions (admin_id)

influencers
    ├── (1:N) → influencer_topics (influencer_id)
    ├── (1:N) → influencer_banned_topics (influencer_id)
    ├── (1:N) → influencer_platform_stats (influencer_id)
    └── (1:N) → admin_actions (influencer_id)
    └── (N:1) → auth.users (linked_user_id)

topics
    └── (1:N) → influencer_topics (topic_id)

banned_topics
    └── (1:N) → influencer_banned_topics (banned_topic_id)

platforms
    └── (1:N) → influencer_platform_stats (platform_id)

influencer_profiles
    ├── (1:N) → platform_screenshots (influencer_profile_id)
    └── (1:N) → profile_edits (influencer_profile_id)

profiles
    └── (N:1) → influencer_profiles (primary_profile_id)
```

---

## ⚡ Индексы для производительности

### Индексы для `influencers`

```sql
CREATE INDEX idx_influencers_visibility ON public.influencers(visibility_status);
CREATE INDEX idx_influencers_verification ON public.influencers(verification_status);
CREATE INDEX idx_influencers_linked_user_id ON public.influencers(linked_user_id);
```

### Индексы для `influencer_platform_stats`

```sql
CREATE INDEX idx_influencer_platform_followers ON public.influencer_platform_stats(platform_id, followers);
CREATE INDEX idx_influencer_platform_post_price ON public.influencer_platform_stats(platform_id, post_price);
CREATE UNIQUE INDEX idx_influencer_platform_username 
ON public.influencer_platform_stats(platform_id, lower(username));
```

### Индексы для `profiles`

```sql
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_instagram_username ON public.profiles(instagram_username);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_full_name ON public.profiles(full_name);
```

### Индексы для `influencer_profiles`

```sql
CREATE INDEX idx_influencer_profiles_platform_username ON public.influencer_profiles(platform, username);
CREATE INDEX idx_influencer_profiles_user_id ON public.influencer_profiles(user_id);
CREATE INDEX idx_influencer_profiles_status ON public.influencer_profiles(status);
```

### Индексы для `platform_screenshots`

```sql
CREATE INDEX idx_platform_screenshots_user_id ON public.platform_screenshots(user_id);
CREATE INDEX idx_platform_screenshots_platform ON public.platform_screenshots(platform);
```

### Индексы для `profile_edits`

```sql
CREATE INDEX idx_profile_edits_user_id ON public.profile_edits(user_id);
CREATE INDEX idx_profile_edits_status ON public.profile_edits(status);
```

---

## 🔧 Функции и триггеры

### Функция обновления `updated_at`

Автоматическое обновление поля `updated_at` при изменении записи.

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

**Используется в таблицах:**
- `influencers`
- `profiles`
- `influencer_profiles`
- `profile_edits`

### Функция создания профиля пользователя

Автоматическое создание профиля при регистрации нового пользователя.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public 
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name')
  );
  RETURN NEW;
END;
$$;
```

**Триггер:** `on_auth_user_created` срабатывает после INSERT в `auth.users`

---

## 📦 Базовые данные (Seed)

### Платформы

При создании базы данных автоматически добавляются платформы:
- instagram
- tiktok
- youtube
- telegram

### Тематики

Предустановленные тематики блогов:
- Красота и мода
- Здоровье и фитнес
- Путешествия
- Еда и рецепты
- Технологии
- Образование
- Развлечения
- Спорт
- Автомобили
- Дом и интерьер
- Бизнес
- Психология
- Дети и семья
- Искусство и творчество
- Финансы

### Запрещенные тематики

Предустановленные запрещенные тематики:
- Алкоголь
- Табак и курение
- Наркотики
- Азартные игры
- Политика
- Религия
- Взрослый контент
- Насилие
- Экстремизм
- Медицинские советы

---

## 🔒 RLS политики (Row Level Security)

### ⚠️ Текущее состояние

**RLS политики ОТКЛЮЧЕНЫ** для упрощения разработки.

Все таблицы имеют `DISABLE ROW LEVEL SECURITY` для разработки.

### ⚠️ ВАЖНО для продакшена

В продакшене **ОБЯЗАТЕЛЬНО** включить RLS политики для:

- Защиты данных пользователей
- Контроля доступа к API
- Соответствия требованиям безопасности
- Защиты от несанкционированного доступа

**Таблицы, требующие RLS:**
- `influencers`
- `influencer_profiles`
- `influencer_platform_stats`
- `platform_screenshots`
- `profile_edits`
- `admin_actions`
- `profiles`
- `topics`
- `banned_topics`
- `platforms`
- `influencer_topics`
- `influencer_banned_topics`

---

## 💾 Storage Buckets

### `profile-assets`

Bucket для хранения файлов профилей (аватары, скриншоты и т.д.).

```sql
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-assets', 'profile-assets', false);
```

- **ID:** `profile-assets`
- **Public:** `false` (приватный bucket)

---

## 📦 Миграции

### Применение миграций

```bash
# Применение всех миграций
npm run supabase:db:push

# Сброс базы данных
npm run supabase:reset

# Просмотр статуса миграций
npm run supabase:status
```

### Создание новой миграции

```bash
# Создание новой миграции
supabase migration new migration_name

# Применение миграции
supabase db push
```

### Расположение миграций

Миграции находятся в папке `supabase/migrations/`.

---

## 🔌 Интеграция с NestJS API

### Подключение к базе данных

```typescript
// Конфигурация подключения к Supabase
const supabaseConfig = {
  url: process.env.SUPABASE_URL,
  anonKey: process.env.SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

// NestJS модуль для работы с БД
@Module({
  imports: [SupabaseModule.forRoot(supabaseConfig)],
})
export class DatabaseModule {}
```

### Примеры запросов

```typescript
// Получение блогеров с фильтрацией
async getBloggers(filters: BloggerFilters) {
  try {
    const { data, error } = await this.supabase
      .from('influencers')
      .select(`
        *,
        influencer_platform_stats (
          *,
          platforms (*)
        )
      `)
      .eq('visibility_status', 'виден')
      .range(filters.offset, filters.offset + filters.limit - 1);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch bloggers:', error);
    throw error;
  }
}
```

---

## 💾 Backup и восстановление

### Создание backup

```bash
# Создание backup базы данных
pg_dump -h localhost -U postgres -d zorki7 > backup_$(date +%Y%m%d_%H%M%S).sql

# Создание backup только схемы
pg_dump -h localhost -U postgres -d zorki7 --schema-only > schema_backup.sql

# Создание backup только данных
pg_dump -h localhost -U postgres -d zorki7 --data-only > data_backup.sql
```

### Восстановление из backup

```bash
# Восстановление из backup
psql -h localhost -U postgres -d zorki7 < backup_file.sql

# Восстановление схемы
psql -h localhost -U postgres -d zorki7 < schema_backup.sql
```

---

## 🎯 Готовность базы данных

✅ **Схема БД** - полная схема с 12 таблицами  
✅ **ENUM типы** - 4 типа для типизации данных  
✅ **Индексы** - оптимизированы для быстрого поиска  
✅ **Функции и триггеры** - автоматическое обновление и создание записей  
✅ **Миграции** - настроены и работают  
✅ **Интеграция с NestJS API** - функциональна  
✅ **Backup и восстановление** - настроены  
✅ **Seed данные** - предустановленные платформы, тематики

### Рекомендации для продакшена

1. **Включить RLS политики** для безопасности
2. **Настроить мониторинг** производительности
3. **Регулярные backup'ы** данных
4. **Оптимизация запросов** при росте данных
5. **Настройка репликации** для высокой доступности
6. **Настройка индексов** для часто используемых запросов
7. **Мониторинг размера БД** и очистка старых данных

---

_Последнее обновление: Январь 2025_
