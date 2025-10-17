-- ===============================================
-- ИСПРАВЛЕНИЕ RLS ПОЛИТИК ДЛЯ ZORKI.PRO
-- ===============================================
-- Этот файл исправляет RLS политики для корректной работы

-- ===============================================
-- 1. УДАЛЕНИЕ СТАРЫХ ПОЛИТИК
-- ===============================================

-- Удаляем все существующие политики
DROP POLICY IF EXISTS "Public can view visible influencers" ON public.influencers;
DROP POLICY IF EXISTS "Public can view platforms" ON public.platforms;
DROP POLICY IF EXISTS "Public can view topics" ON public.topics;
DROP POLICY IF EXISTS "Public can view banned topics" ON public.banned_topics;
DROP POLICY IF EXISTS "Public can view influencer topics" ON public.influencer_topics;
DROP POLICY IF EXISTS "Public can view influencer banned topics" ON public.influencer_banned_topics;
DROP POLICY IF EXISTS "Public can view influencer platform stats" ON public.influencer_platform_stats;

-- Удаляем политики для аутентифицированных пользователей
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own influencer profiles" ON public.influencer_profiles;
DROP POLICY IF EXISTS "Users can insert own influencer profiles" ON public.influencer_profiles;
DROP POLICY IF EXISTS "Users can update own influencer profiles" ON public.influencer_profiles;
DROP POLICY IF EXISTS "Users can delete own influencer profiles" ON public.influencer_profiles;
DROP POLICY IF EXISTS "Users can view own screenshots" ON public.platform_screenshots;
DROP POLICY IF EXISTS "Users can insert own screenshots" ON public.platform_screenshots;
DROP POLICY IF EXISTS "Users can update own screenshots" ON public.platform_screenshots;
DROP POLICY IF EXISTS "Users can delete own screenshots" ON public.platform_screenshots;
DROP POLICY IF EXISTS "Users can view own profile edits" ON public.profile_edits;
DROP POLICY IF EXISTS "Users can insert own profile edits" ON public.profile_edits;
DROP POLICY IF EXISTS "Users can update own profile edits" ON public.profile_edits;
DROP POLICY IF EXISTS "Users can delete own profile edits" ON public.profile_edits;

-- Удаляем политики для администраторов
DROP POLICY IF EXISTS "Admins have full access to influencers" ON public.influencers;
DROP POLICY IF EXISTS "Admins have full access to influencer_profiles" ON public.influencer_profiles;
DROP POLICY IF EXISTS "Admins have full access to influencer_platform_stats" ON public.influencer_platform_stats;
DROP POLICY IF EXISTS "Admins have full access to platform_screenshots" ON public.platform_screenshots;
DROP POLICY IF EXISTS "Admins have full access to profile_edits" ON public.profile_edits;
DROP POLICY IF EXISTS "Admins have full access to admin_actions" ON public.admin_actions;
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;

-- ===============================================
-- 2. ВРЕМЕННОЕ ОТКЛЮЧЕНИЕ RLS ДЛЯ РАЗРАБОТКИ
-- ===============================================

-- Отключаем RLS для всех таблиц (временно для разработки)
ALTER TABLE public.influencers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_platform_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_screenshots DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_edits DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.banned_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.platforms DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_banned_topics DISABLE ROW LEVEL SECURITY;

-- ===============================================
-- 3. НАСТРОЙКА ПРАВ ДОСТУПА
-- ===============================================

-- Предоставляем полный доступ анонимным пользователям для разработки
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- Предоставляем полный доступ аутентифицированным пользователям
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ===============================================
-- 4. КОММЕНТАРИИ
-- ===============================================

COMMENT ON TABLE public.influencers IS 'Основная таблица блогеров - RLS отключен для разработки';
COMMENT ON TABLE public.topics IS 'Тематики блогов - RLS отключен для разработки';
COMMENT ON TABLE public.influencer_topics IS 'Связь блогеров с тематиками - RLS отключен для разработки';
COMMENT ON TABLE public.banned_topics IS 'Запрещенные тематики - RLS отключен для разработки';
COMMENT ON TABLE public.influencer_banned_topics IS 'Связь блогеров с запрещенными тематиками - RLS отключен для разработки';
COMMENT ON TABLE public.platforms IS 'Социальные платформы - RLS отключен для разработки';
COMMENT ON TABLE public.influencer_platform_stats IS 'Статистика блогеров по платформам - RLS отключен для разработки';
COMMENT ON TABLE public.profiles IS 'Профили пользователей - RLS отключен для разработки';
COMMENT ON TABLE public.influencer_profiles IS 'Профили блогеров по платформам - RLS отключен для разработки';
COMMENT ON TABLE public.platform_screenshots IS 'Скриншоты профилей - RLS отключен для разработки';
COMMENT ON TABLE public.profile_edits IS 'Черновики изменений профилей - RLS отключен для разработки';
COMMENT ON TABLE public.admin_actions IS 'Действия администраторов - RLS отключен для разработки';

-- ===============================================
-- МИГРАЦИЯ ЗАВЕРШЕНА
-- ===============================================
