-- ===============================================
-- ОТКЛЮЧЕНИЕ RLS ДЛЯ РАЗРАБОТКИ
-- ===============================================
-- Этот файл отключает RLS для упрощения разработки
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

-- Предоставляем полные права service_role для обхода RLS
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- ===============================================
-- МИГРАЦИЯ ЗАВЕРШЕНА
-- ===============================================

