-- Предоставляем полные права на все таблицы
-- Это временное решение для разработки

-- Отключаем RLS для всех таблиц
ALTER TABLE public.influencers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_platform_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.banned_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_banned_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.platforms DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_screenshots DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_edits DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions DISABLE ROW LEVEL SECURITY;

-- Предоставляем полные права для service_role
GRANT ALL ON public.influencers TO service_role;
GRANT ALL ON public.influencer_profiles TO service_role;
GRANT ALL ON public.influencer_platform_stats TO service_role;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.topics TO service_role;
GRANT ALL ON public.banned_topics TO service_role;
GRANT ALL ON public.influencer_topics TO service_role;
GRANT ALL ON public.influencer_banned_topics TO service_role;
GRANT ALL ON public.platforms TO service_role;
GRANT ALL ON public.platform_screenshots TO service_role;
GRANT ALL ON public.profile_edits TO service_role;
GRANT ALL ON public.admin_actions TO service_role;

-- Предоставляем права на последовательности
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Предоставляем права anon для чтения
GRANT SELECT ON public.influencers TO anon;
GRANT SELECT ON public.influencer_profiles TO anon;
GRANT SELECT ON public.influencer_platform_stats TO anon;
GRANT SELECT ON public.topics TO anon;
GRANT SELECT ON public.banned_topics TO anon;
GRANT SELECT ON public.influencer_topics TO anon;
GRANT SELECT ON public.influencer_banned_topics TO anon;
GRANT SELECT ON public.platforms TO anon;

-- Предоставляем права authenticated для чтения и записи
GRANT ALL ON public.influencers TO authenticated;
GRANT ALL ON public.influencer_profiles TO authenticated;
GRANT ALL ON public.influencer_platform_stats TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.topics TO authenticated;
GRANT ALL ON public.banned_topics TO authenticated;
GRANT ALL ON public.influencer_topics TO authenticated;
GRANT ALL ON public.influencer_banned_topics TO authenticated;
GRANT ALL ON public.platforms TO authenticated;
GRANT ALL ON public.platform_screenshots TO authenticated;
GRANT ALL ON public.profile_edits TO authenticated;
GRANT ALL ON public.admin_actions TO authenticated;







