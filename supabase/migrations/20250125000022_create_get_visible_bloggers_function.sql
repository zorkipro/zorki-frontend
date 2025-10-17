-- Создаем функцию get_visible_bloggers как алиас для get_blogger_data_with_edits
-- Эта функция будет использоваться на главной странице для получения видимых блогеров
CREATE OR REPLACE FUNCTION public.get_visible_bloggers()
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  avatar_url TEXT,
  description TEXT,
  barter_available BOOLEAN,
  mart_registry BOOLEAN,
  contact_link TEXT,
  work_format TEXT,
  gender_type TEXT,
  verification_status TEXT,
  visibility_status TEXT,
  linked_user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  followers BIGINT,
  platform_stats JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.get_blogger_data_with_edits();
END;
$$;

-- Предоставляем права на выполнение функции
GRANT EXECUTE ON FUNCTION public.get_visible_bloggers() TO anon, authenticated;




