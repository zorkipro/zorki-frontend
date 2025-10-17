-- ===============================================
-- ПРИНУДИТЕЛЬНОЕ ОТКЛЮЧЕНИЕ RLS
-- ===============================================
-- Этот файл принудительно отключает RLS для всех таблиц

-- Отключаем RLS для всех таблиц
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

-- Удаляем все политики RLS
DROP POLICY IF EXISTS "Public can view visible influencers" ON public.influencers;
DROP POLICY IF EXISTS "Public can view platforms" ON public.platforms;
DROP POLICY IF EXISTS "Public can view topics" ON public.topics;
DROP POLICY IF EXISTS "Public can view banned topics" ON public.banned_topics;
DROP POLICY IF EXISTS "Public can view influencer topics" ON public.influencer_topics;
DROP POLICY IF EXISTS "Public can view influencer banned topics" ON public.influencer_banned_topics;
DROP POLICY IF EXISTS "Public can view influencer platform stats" ON public.influencer_platform_stats;
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
DROP POLICY IF EXISTS "Admins have full access to influencers" ON public.influencers;
DROP POLICY IF EXISTS "Admins have full access to influencer_profiles" ON public.influencer_profiles;
DROP POLICY IF EXISTS "Admins have full access to influencer_platform_stats" ON public.influencer_platform_stats;
DROP POLICY IF EXISTS "Admins have full access to platform_screenshots" ON public.platform_screenshots;
DROP POLICY IF EXISTS "Admins have full access to profile_edits" ON public.profile_edits;
DROP POLICY IF EXISTS "Admins have full access to admin_actions" ON public.admin_actions;
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;

-- Предоставляем полные права всем ролям
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- ===============================================
-- МИГРАЦИЯ ЗАВЕРШЕНА
-- ===============================================

