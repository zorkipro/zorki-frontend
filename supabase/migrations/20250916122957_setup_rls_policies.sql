-- ===============================================
-- НАСТРОЙКА RLS ПОЛИТИК ДЛЯ ZORKI.PRO
-- ===============================================
-- Этот файл настраивает Row Level Security политики
-- для обеспечения безопасного доступа к данным

-- ===============================================
-- 1. ВКЛЮЧЕНИЕ RLS
-- ===============================================

-- Включаем RLS для всех таблиц
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_platform_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_edits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banned_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_banned_topics ENABLE ROW LEVEL SECURITY;

-- ===============================================
-- 2. ПОЛИТИКИ ДЛЯ АНОНИМНОГО ДОСТУПА (ПУБЛИЧНЫЕ ДАННЫЕ)
-- ===============================================

-- Публичные данные - доступны всем
-- influencers (только видимые)
CREATE POLICY "Public can view visible influencers" ON public.influencers
    FOR SELECT USING (visibility_status = 'виден');

-- platforms (все)
CREATE POLICY "Public can view platforms" ON public.platforms
    FOR SELECT USING (true);

-- topics (все)
CREATE POLICY "Public can view topics" ON public.topics
    FOR SELECT USING (true);

-- banned_topics (все)
CREATE POLICY "Public can view banned topics" ON public.banned_topics
    FOR SELECT USING (true);

-- influencer_topics (только для видимых блогеров)
CREATE POLICY "Public can view influencer topics" ON public.influencer_topics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.influencers 
            WHERE id = influencer_id 
            AND visibility_status = 'виден'
        )
    );

-- influencer_banned_topics (только для видимых блогеров)
CREATE POLICY "Public can view influencer banned topics" ON public.influencer_banned_topics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.influencers 
            WHERE id = influencer_id 
            AND visibility_status = 'виден'
        )
    );

-- influencer_platform_stats (только для видимых блогеров)
CREATE POLICY "Public can view influencer platform stats" ON public.influencer_platform_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.influencers 
            WHERE id = influencer_id 
            AND visibility_status = 'виден'
        )
    );

-- ===============================================
-- 3. ПОЛИТИКИ ДЛЯ АУТЕНТИФИЦИРОВАННЫХ ПОЛЬЗОВАТЕЛЕЙ
-- ===============================================

-- profiles - пользователи могут видеть только свой профиль
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- influencer_profiles - пользователи могут управлять своими профилями
CREATE POLICY "Users can view own influencer profiles" ON public.influencer_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own influencer profiles" ON public.influencer_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own influencer profiles" ON public.influencer_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own influencer profiles" ON public.influencer_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- platform_screenshots - пользователи могут управлять своими скриншотами
CREATE POLICY "Users can view own screenshots" ON public.platform_screenshots
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own screenshots" ON public.platform_screenshots
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own screenshots" ON public.platform_screenshots
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own screenshots" ON public.platform_screenshots
    FOR DELETE USING (auth.uid() = user_id);

-- profile_edits - пользователи могут управлять своими черновиками
CREATE POLICY "Users can view own profile edits" ON public.profile_edits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile edits" ON public.profile_edits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile edits" ON public.profile_edits
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile edits" ON public.profile_edits
    FOR DELETE USING (auth.uid() = user_id);

-- ===============================================
-- 4. ПОЛИТИКИ ДЛЯ АДМИНИСТРАТОРОВ
-- ===============================================

-- Создаем роль администратора (если не существует)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
        CREATE ROLE admin;
    END IF;
END $$;

-- Администраторы имеют полный доступ ко всем таблицам
CREATE POLICY "Admins have full access to influencers" ON public.influencers
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to influencer_profiles" ON public.influencer_profiles
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to influencer_platform_stats" ON public.influencer_platform_stats
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to platform_screenshots" ON public.platform_screenshots
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to profile_edits" ON public.profile_edits
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to admin_actions" ON public.admin_actions
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to profiles" ON public.profiles
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ===============================================
-- 5. ДОПОЛНИТЕЛЬНЫЕ НАСТРОЙКИ
-- ===============================================

-- Разрешаем анонимный доступ к публичным данным
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.influencers TO anon;
GRANT SELECT ON public.platforms TO anon;
GRANT SELECT ON public.topics TO anon;
GRANT SELECT ON public.banned_topics TO anon;
GRANT SELECT ON public.influencer_topics TO anon;
GRANT SELECT ON public.influencer_banned_topics TO anon;
GRANT SELECT ON public.influencer_platform_stats TO anon;

-- Разрешаем аутентифицированным пользователям доступ к своим данным
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.influencer_profiles TO authenticated;
GRANT ALL ON public.platform_screenshots TO authenticated;
GRANT ALL ON public.profile_edits TO authenticated;

-- ===============================================
-- МИГРАЦИЯ ЗАВЕРШЕНА
-- ===============================================
