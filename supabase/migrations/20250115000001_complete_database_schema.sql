-- ===============================================
-- ПОЛНАЯ СХЕМА БАЗЫ ДАННЫХ ZORKI.PRO
-- ===============================================
-- Этот файл содержит всю схему базы данных в одном месте
-- Объединяет все предыдущие миграции в единый файл

-- ===============================================
-- 1. СОЗДАНИЕ ENUM ТИПОВ
-- ===============================================

-- Создаем enum для типов платформ
DO $$ BEGIN
    CREATE TYPE public.platform_type AS ENUM ('instagram', 'tiktok', 'youtube', 'telegram');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Создаем enum для статусов профилей
DO $$ BEGIN
    CREATE TYPE public.profile_status AS ENUM ('unverified', 'pending', 'verified');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Создаем enum для источников данных
DO $$ BEGIN
    CREATE TYPE public.data_source AS ENUM ('imported', 'scraped', 'graph_api', 'manual');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Создаем enum для статусов редактирования
DO $$ BEGIN
    CREATE TYPE public.edit_status AS ENUM ('new', 'pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ===============================================
-- 2. СОЗДАНИЕ ТАБЛИЦ
-- ===============================================

-- 1) influencers (блогеры) - основная таблица блогеров
CREATE TABLE IF NOT EXISTS public.influencers (
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

-- 2) topics (тематики блогов)
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL
);

-- 3) influencer_topics (связь блогер ↔ тематика)
CREATE TABLE IF NOT EXISTS public.influencer_topics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE
);

-- 4) banned_topics (запрещённые тематики)
CREATE TABLE IF NOT EXISTS public.banned_topics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL
);

-- 5) influencer_banned_topics (связь блогер ↔ запрещённая тематика)
CREATE TABLE IF NOT EXISTS public.influencer_banned_topics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE,
    banned_topic_id UUID REFERENCES public.banned_topics(id) ON DELETE CASCADE
);

-- 6) platforms (соцсети)
CREATE TABLE IF NOT EXISTS public.platforms (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title platform_type NOT NULL
);

-- 7) influencer_platform_stats (статистика по платформам)
CREATE TABLE IF NOT EXISTS public.influencer_platform_stats (
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

-- 8) profiles (профили пользователей)
CREATE TABLE IF NOT EXISTS public.profiles (
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

-- 9) influencer_profiles (профили блогеров по платформам)
CREATE TABLE IF NOT EXISTS public.influencer_profiles (
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

-- 10) platform_screenshots (скриншоты профилей)
CREATE TABLE IF NOT EXISTS public.platform_screenshots (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    influencer_profile_id UUID REFERENCES public.influencer_profiles(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    platform platform_type,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 11) profile_edits (черновики изменений профилей)
CREATE TABLE IF NOT EXISTS public.profile_edits (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status edit_status DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    influencer_profile_id UUID REFERENCES public.influencer_profiles(id) ON DELETE CASCADE,
    changes_json JSONB CHECK (changes_json IS NULL OR octet_length(changes_json::text) <= 10000)
);

-- 12) admin_actions (действия админов)
CREATE TABLE IF NOT EXISTS public.admin_actions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('approve', 'reject', 'delete', 'hide', 'edit')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 3. ДОБАВЛЕНИЕ ВНЕШНИХ КЛЮЧЕЙ
-- ===============================================

-- Связь между influencers и influencer_profiles через user_id

-- Добавляем внешний ключ для primary_profile_id в profiles
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_profiles_primary_profile'
    ) THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT fk_profiles_primary_profile 
        FOREIGN KEY (primary_profile_id) REFERENCES public.influencer_profiles(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ===============================================
-- 4. СОЗДАНИЕ ИНДЕКСОВ
-- ===============================================

-- Индексы для influencers
CREATE INDEX IF NOT EXISTS idx_influencers_visibility ON public.influencers(visibility_status);
CREATE INDEX IF NOT EXISTS idx_influencers_verification ON public.influencers(verification_status);
CREATE INDEX IF NOT EXISTS idx_influencers_linked_user_id ON public.influencers(linked_user_id);

-- Индексы для influencer_platform_stats
CREATE INDEX IF NOT EXISTS idx_influencer_platform_followers ON public.influencer_platform_stats(platform_id, followers);
CREATE INDEX IF NOT EXISTS idx_influencer_platform_post_price ON public.influencer_platform_stats(platform_id, post_price);
CREATE UNIQUE INDEX IF NOT EXISTS idx_influencer_platform_username 
ON public.influencer_platform_stats(platform_id, lower(username));

-- Индексы для profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_instagram_username ON public.profiles(instagram_username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON public.profiles(full_name);

-- Индексы для influencer_profiles
CREATE INDEX IF NOT EXISTS idx_influencer_profiles_platform_username ON public.influencer_profiles(platform, username);
CREATE INDEX IF NOT EXISTS idx_influencer_profiles_user_id ON public.influencer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_influencer_profiles_status ON public.influencer_profiles(status);

-- Индексы для platform_screenshots
CREATE INDEX IF NOT EXISTS idx_platform_screenshots_user_id ON public.platform_screenshots(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_screenshots_platform ON public.platform_screenshots(platform);

-- Индексы для profile_edits
CREATE INDEX IF NOT EXISTS idx_profile_edits_user_id ON public.profile_edits(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_edits_status ON public.profile_edits(status);

-- ===============================================
-- 5. ВСТАВКА БАЗОВЫХ ДАННЫХ
-- ===============================================

-- Вставляем платформы
INSERT INTO public.platforms (title) 
SELECT 'instagram'::platform_type WHERE NOT EXISTS (SELECT 1 FROM public.platforms WHERE title::text = 'instagram');

INSERT INTO public.platforms (title) 
SELECT 'tiktok'::platform_type WHERE NOT EXISTS (SELECT 1 FROM public.platforms WHERE title::text = 'tiktok');

INSERT INTO public.platforms (title) 
SELECT 'youtube'::platform_type WHERE NOT EXISTS (SELECT 1 FROM public.platforms WHERE title::text = 'youtube');

INSERT INTO public.platforms (title) 
SELECT 'telegram'::platform_type WHERE NOT EXISTS (SELECT 1 FROM public.platforms WHERE title::text = 'telegram');

-- Вставляем тематики
INSERT INTO public.topics (title) 
SELECT 'Красота и мода' WHERE NOT EXISTS (SELECT 1 FROM public.topics WHERE title = 'Красота и мода');

INSERT INTO public.topics (title) 
SELECT 'Здоровье и фитнес' WHERE NOT EXISTS (SELECT 1 FROM public.topics WHERE title = 'Здоровье и фитнес');

INSERT INTO public.topics (title) 
SELECT 'Путешествия' WHERE NOT EXISTS (SELECT 1 FROM public.topics WHERE title = 'Путешествия');

INSERT INTO public.topics (title) 
SELECT 'Еда и рецепты' WHERE NOT EXISTS (SELECT 1 FROM public.topics WHERE title = 'Еда и рецепты');

INSERT INTO public.topics (title) 
SELECT 'Технологии' WHERE NOT EXISTS (SELECT 1 FROM public.topics WHERE title = 'Технологии');

INSERT INTO public.topics (title) 
SELECT 'Образование' WHERE NOT EXISTS (SELECT 1 FROM public.topics WHERE title = 'Образование');

INSERT INTO public.topics (title) 
SELECT 'Развлечения' WHERE NOT EXISTS (SELECT 1 FROM public.topics WHERE title = 'Развлечения');

INSERT INTO public.topics (title) 
SELECT 'Спорт' WHERE NOT EXISTS (SELECT 1 FROM public.topics WHERE title = 'Спорт');

INSERT INTO public.topics (title) 
SELECT 'Автомобили' WHERE NOT EXISTS (SELECT 1 FROM public.topics WHERE title = 'Автомобили');

INSERT INTO public.topics (title) 
SELECT 'Дом и интерьер' WHERE NOT EXISTS (SELECT 1 FROM public.topics WHERE title = 'Дом и интерьер');

INSERT INTO public.topics (title) 
SELECT 'Бизнес' WHERE NOT EXISTS (SELECT 1 FROM public.topics WHERE title = 'Бизнес');

INSERT INTO public.topics (title) 
SELECT 'Психология' WHERE NOT EXISTS (SELECT 1 FROM public.topics WHERE title = 'Психология');

INSERT INTO public.topics (title) 
SELECT 'Дети и семья' WHERE NOT EXISTS (SELECT 1 FROM public.topics WHERE title = 'Дети и семья');

INSERT INTO public.topics (title) 
SELECT 'Искусство и творчество' WHERE NOT EXISTS (SELECT 1 FROM public.topics WHERE title = 'Искусство и творчество');

INSERT INTO public.topics (title) 
SELECT 'Финансы' WHERE NOT EXISTS (SELECT 1 FROM public.topics WHERE title = 'Финансы');

-- Вставляем запрещенные тематики
INSERT INTO public.banned_topics (title) 
SELECT 'Алкоголь' WHERE NOT EXISTS (SELECT 1 FROM public.banned_topics WHERE title = 'Алкоголь');

INSERT INTO public.banned_topics (title) 
SELECT 'Табак и курение' WHERE NOT EXISTS (SELECT 1 FROM public.banned_topics WHERE title = 'Табак и курение');

INSERT INTO public.banned_topics (title) 
SELECT 'Наркотики' WHERE NOT EXISTS (SELECT 1 FROM public.banned_topics WHERE title = 'Наркотики');

INSERT INTO public.banned_topics (title) 
SELECT 'Азартные игры' WHERE NOT EXISTS (SELECT 1 FROM public.banned_topics WHERE title = 'Азартные игры');

INSERT INTO public.banned_topics (title) 
SELECT 'Политика' WHERE NOT EXISTS (SELECT 1 FROM public.banned_topics WHERE title = 'Политика');

INSERT INTO public.banned_topics (title) 
SELECT 'Религия' WHERE NOT EXISTS (SELECT 1 FROM public.banned_topics WHERE title = 'Религия');

INSERT INTO public.banned_topics (title) 
SELECT 'Взрослый контент' WHERE NOT EXISTS (SELECT 1 FROM public.banned_topics WHERE title = 'Взрослый контент');

INSERT INTO public.banned_topics (title) 
SELECT 'Насилие' WHERE NOT EXISTS (SELECT 1 FROM public.banned_topics WHERE title = 'Насилие');

INSERT INTO public.banned_topics (title) 
SELECT 'Экстремизм' WHERE NOT EXISTS (SELECT 1 FROM public.banned_topics WHERE title = 'Экстремизм');

INSERT INTO public.banned_topics (title) 
SELECT 'Медицинские советы' WHERE NOT EXISTS (SELECT 1 FROM public.banned_topics WHERE title = 'Медицинские советы');

-- ===============================================
-- 6. СОЗДАНИЕ ФУНКЦИЙ
-- ===============================================

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Функция для обработки новых пользователей
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

-- ===============================================
-- 7. СОЗДАНИЕ ТРИГГЕРОВ
-- ===============================================

-- Триггеры для обновления updated_at
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_influencers_updated_at') THEN
        CREATE TRIGGER update_influencers_updated_at
          BEFORE UPDATE ON public.influencers
          FOR EACH ROW
          EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
        CREATE TRIGGER update_profiles_updated_at
          BEFORE UPDATE ON public.profiles
          FOR EACH ROW
          EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_influencer_profiles_updated_at') THEN
        CREATE TRIGGER update_influencer_profiles_updated_at
          BEFORE UPDATE ON public.influencer_profiles
          FOR EACH ROW
          EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profile_edits_updated_at') THEN
        CREATE TRIGGER update_profile_edits_updated_at
          BEFORE UPDATE ON public.profile_edits
          FOR EACH ROW
          EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- Триггер для автоматического создания профиля
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created'
    ) THEN
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

-- ===============================================
-- 8. НАСТРОЙКА RLS (ОТКЛЮЧЕНО ДЛЯ РАЗРАБОТКИ)
-- ===============================================

-- ВНИМАНИЕ: RLS отключен для разработки
-- В продакшене RLS должен быть включен!

-- Отключаем RLS для всех таблиц (для разработки)
ALTER TABLE IF EXISTS public.influencers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.influencer_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.influencer_platform_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.platform_screenshots DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profile_edits DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_actions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.banned_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.platforms DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.influencer_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.influencer_banned_topics DISABLE ROW LEVEL SECURITY;

-- ===============================================
-- 9. СОЗДАНИЕ STORAGE BUCKET
-- ===============================================

-- Создаем bucket для файлов профилей
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-assets', 'profile-assets', false)
ON CONFLICT (id) DO NOTHING;

-- ===============================================
-- 10. КОММЕНТАРИИ
-- ===============================================

COMMENT ON TABLE public.influencers IS 'Основная таблица блогеров';
COMMENT ON TABLE public.topics IS 'Тематики блогов';
COMMENT ON TABLE public.influencer_topics IS 'Связь блогеров с тематиками';
COMMENT ON TABLE public.banned_topics IS 'Запрещенные тематики';
COMMENT ON TABLE public.influencer_banned_topics IS 'Связь блогеров с запрещенными тематиками';
COMMENT ON TABLE public.platforms IS 'Социальные платформы';
COMMENT ON TABLE public.influencer_platform_stats IS 'Статистика блогеров по платформам';
COMMENT ON TABLE public.profiles IS 'Профили пользователей';
COMMENT ON TABLE public.influencer_profiles IS 'Профили блогеров по платформам';
COMMENT ON TABLE public.platform_screenshots IS 'Скриншоты профилей';
COMMENT ON TABLE public.profile_edits IS 'Черновики изменений профилей';
COMMENT ON TABLE public.admin_actions IS 'Действия администраторов';

-- ===============================================
-- МИГРАЦИЯ ЗАВЕРШЕНА
-- ===============================================
