# 🗄️ База данных Zorki7

## 🎯 Обзор

Zorki7 использует PostgreSQL с Supabase в качестве BaaS платформы. База данных интегрирована с NestJS API backend.

## ⚠️ Важная информация

**RLS (Row Level Security) политики ОТКЛЮЧЕНЫ** для упрощения разработки.

Все таблицы имеют полные права доступа для всех пользователей. В продакшене необходимо включить RLS политики для безопасности.

## 📊 Основные таблицы

### `influencers` - Блогеры

```sql
CREATE TABLE influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  description TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Поля:**

- `id` - уникальный идентификатор (UUID)
- `full_name` - полное имя блогера (обязательное)
- `avatar_url` - URL аватара
- `description` - описание блогера
- `is_visible` - видимость профиля (по умолчанию true)
- `created_at` - дата создания
- `updated_at` - дата последнего обновления

### `influencer_platform_stats` - Статистика по платформам

```sql
CREATE TABLE influencer_platform_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
  platform_id UUID REFERENCES platforms(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  followers INTEGER,
  post_price INTEGER,
  story_price INTEGER,
  integration_price INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Поля:**

- `id` - уникальный идентификатор
- `influencer_id` - ссылка на блогера
- `platform_id` - ссылка на платформу
- `username` - имя пользователя на платформе
- `followers` - количество подписчиков
- `post_price` - цена за пост
- `story_price` - цена за сторис
- `integration_price` - цена за интеграцию

### `platforms` - Платформы

```sql
CREATE TABLE platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL UNIQUE, -- instagram, tiktok, youtube, telegram
  icon TEXT, -- иконка платформы
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `topics` - Тематики

```sql
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  is_restricted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `profile_edits` - Черновики изменений

```sql
CREATE TABLE profile_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
  edit_data JSONB NOT NULL,
  edit_status TEXT DEFAULT 'draft' CHECK (edit_status IN ('draft', 'published', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔗 Связи между таблицами

```
auth.users (1) ←→ (1) influencers (1) ←→ (N) influencer_platform_stats
                                    ↓
                               (N) profile_edits

platforms (1) ←→ (N) influencer_platform_stats
```

## ⚡ Индексы для производительности

```sql
-- Индексы для быстрого поиска
CREATE INDEX idx_influencers_visible ON influencers(is_visible);
CREATE INDEX idx_influencers_name ON influencers(full_name);
CREATE INDEX idx_influencers_created_at ON influencers(created_at);

-- Индексы для связей
CREATE INDEX idx_influencer_platform_stats_influencer_id ON influencer_platform_stats(influencer_id);
CREATE INDEX idx_influencer_platform_stats_platform_id ON influencer_platform_stats(platform_id);
CREATE INDEX idx_profile_edits_influencer_id ON profile_edits(influencer_id);

-- Индексы для статусов
CREATE INDEX idx_profile_edits_status ON profile_edits(edit_status);
CREATE INDEX idx_topics_restricted ON topics(is_restricted);

-- Составные индексы для сложных запросов
CREATE INDEX idx_influencer_platform_stats_composite ON influencer_platform_stats(influencer_id, platform_id);
CREATE INDEX idx_profile_edits_composite ON profile_edits(influencer_id, edit_status);
```

## 🔧 Функции и процедуры

### `get_bloggers_with_stats()`

Возвращает блогеров с их статистикой по платформам.

```sql
CREATE OR REPLACE FUNCTION get_bloggers_with_stats()
RETURNS TABLE (
  blogger_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  platform_title TEXT,
  username TEXT,
  followers INTEGER,
  post_price INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.full_name,
    i.avatar_url,
    p.title,
    ips.username,
    ips.followers,
    ips.post_price
  FROM influencers i
  LEFT JOIN influencer_platform_stats ips ON i.id = ips.influencer_id
  LEFT JOIN platforms p ON ips.platform_id = p.id
  WHERE i.is_visible = true
  ORDER BY i.created_at DESC;
END;
$$ LANGUAGE plpgsql;
```

### `get_blogger_profile(blogger_id)`

Возвращает полный профиль блогера с статистикой.

```sql
CREATE OR REPLACE FUNCTION get_blogger_profile(blogger_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'id', i.id,
    'full_name', i.full_name,
    'avatar_url', i.avatar_url,
    'description', i.description,
    'platforms', (
      SELECT json_agg(
        json_build_object(
          'platform', p.title,
          'username', ips.username,
          'followers', ips.followers,
          'post_price', ips.post_price,
          'story_price', ips.story_price
        )
      )
      FROM influencer_platform_stats ips
      JOIN platforms p ON ips.platform_id = p.id
      WHERE ips.influencer_id = i.id
    )
  ) INTO result
  FROM influencers i
  WHERE i.id = blogger_id AND i.is_visible = true;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

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

## 🔒 RLS политики (Row Level Security)

### ⚠️ Текущее состояние

**RLS политики ОТКЛЮЧЕНЫ** для упрощения разработки.

### Планируемые RLS политики

```sql
-- Включение RLS для таблиц
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_platform_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_edits ENABLE ROW LEVEL SECURITY;

-- Политики для блогеров
CREATE POLICY "Публичный доступ к видимым блогерам" ON influencers
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Админы могут управлять блогерами" ON influencers
  FOR ALL USING (auth.role() = 'admin');

-- Политики для статистики
CREATE POLICY "Публичный доступ к статистике" ON influencer_platform_stats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM influencers
      WHERE id = influencer_id AND is_visible = true
    )
  );
```

### ⚠️ ВАЖНО для продакшена

В продакшене **ОБЯЗАТЕЛЬНО** включить RLS политики для:

- Защиты данных пользователей
- Контроля доступа к API
- Соответствия требованиям безопасности
- Защиты от несанкционированного доступа

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
      .eq('is_visible', true)
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

## 🎯 Готовность базы данных

✅ **Схема БД** оптимизирована для производительности  
✅ **Индексы** настроены для быстрого поиска  
✅ **Функции и процедуры** реализованы  
✅ **Миграции** настроены и работают  
✅ **Интеграция с NestJS API** функциональна  
✅ **Backup и восстановление** настроены

### Рекомендации для продакшена

1. **Включить RLS политики** для безопасности
2. **Настроить мониторинг** производительности
3. **Регулярные backup'ы** данных
4. **Оптимизация запросов** при росте данных
5. **Настройка репликации** для высокой доступности

---

_Последнее обновление: Октябрь 2025_
