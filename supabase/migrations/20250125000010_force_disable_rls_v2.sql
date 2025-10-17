-- Принудительное отключение RLS через SQL
-- Проверяем и отключаем RLS для каждой таблицы

-- Проверяем статус RLS для каждой таблицы
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'influencers', 
  'influencer_profiles', 
  'influencer_platform_stats', 
  'profiles', 
  'topics', 
  'banned_topics', 
  'influencer_topics', 
  'influencer_banned_topics', 
  'platforms', 
  'platform_screenshots', 
  'profile_edits', 
  'admin_actions'
);

-- Принудительно отключаем RLS для всех таблиц
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

-- Проверяем результат
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'influencers', 
  'influencer_profiles', 
  'influencer_platform_stats', 
  'profiles', 
  'topics', 
  'banned_topics', 
  'influencer_topics', 
  'influencer_banned_topics', 
  'platforms', 
  'platform_screenshots', 
  'profile_edits', 
  'admin_actions'
);

