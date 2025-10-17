-- Финальное отключение RLS для всех таблиц
-- Эта миграция гарантированно отключает RLS

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
ALTER TABLE public.influencer_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_banned_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.platforms DISABLE ROW LEVEL SECURITY;

-- Удаляем все существующие политики RLS
DROP POLICY IF EXISTS "Enable read access for all users" ON public.influencers;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.influencers;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.influencers;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.influencers;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.influencer_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.influencer_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.influencer_profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.influencer_profiles;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.influencer_platform_stats;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.influencer_platform_stats;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.influencer_platform_stats;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.influencer_platform_stats;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.profiles;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.topics;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.banned_topics;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.influencer_topics;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.influencer_banned_topics;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.platforms;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.platform_screenshots;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profile_edits;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.admin_actions;

