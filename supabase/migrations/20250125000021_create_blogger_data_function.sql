-- Создаем функцию для получения данных блогеров с учетом изменений из profile_edits
-- Эта функция будет использоваться на главной странице для отображения актуальных цен
CREATE OR REPLACE FUNCTION public.get_blogger_data_with_edits()
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
  WITH verified_bloggers AS (
    -- Получаем верифицированных блогеров (связанных с profiles)
    SELECT 
      i.id,
      i.full_name,
      i.avatar_url,
      i.description,
      i.barter_available,
      i.mart_registry,
      i.contact_link,
      i.work_format,
      i.gender_type,
      i.verification_status,
      i.visibility_status,
      i.linked_user_id,
      i.created_at,
      i.updated_at,
      -- Получаем данные о подписчиках из основной платформы
      COALESCE(
        (SELECT ips.followers 
         FROM influencer_platform_stats ips 
         JOIN platforms p ON ips.platform_id = p.id 
         WHERE ips.influencer_id = i.id AND p.title = 'instagram'
         LIMIT 1),
        0
      ) as followers,
      -- Получаем статистику по платформам с учетом изменений из profile_edits
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'platform', p.title,
            'post_price', COALESCE(
              -- Если есть одобренные изменения в profile_edits, используем их
              CASE 
                WHEN pe.changes_json IS NOT NULL THEN
                  CASE p.title
                    WHEN 'instagram' THEN (pe.changes_json->>'instagram_post_price')::INTEGER
                    WHEN 'tiktok' THEN (pe.changes_json->>'tiktok_post_price')::INTEGER
                    WHEN 'youtube' THEN (pe.changes_json->>'youtube_post_price')::INTEGER
                    WHEN 'telegram' THEN (pe.changes_json->>'telegram_post_price')::INTEGER
                    ELSE ips.post_price
                  END
                ELSE ips.post_price
              END,
              ips.post_price
            ),
            'story_price', COALESCE(
              -- Если есть одобренные изменения в profile_edits, используем их
              CASE 
                WHEN pe.changes_json IS NOT NULL THEN
                  CASE p.title
                    WHEN 'instagram' THEN (pe.changes_json->>'instagram_story_price')::INTEGER
                    WHEN 'youtube' THEN (pe.changes_json->>'youtube_story_price')::INTEGER
                    ELSE ips.story_price
                  END
                ELSE ips.story_price
              END,
              ips.story_price
            ),
            'followers', ips.followers,
            'username', ips.username
          )
        )
        FROM influencer_platform_stats ips
        JOIN platforms p ON ips.platform_id = p.id
        LEFT JOIN (
          -- Получаем последние одобренные изменения для этого блогера
          SELECT DISTINCT ON (pe.influencer_profile_id) 
            pe.influencer_profile_id,
            pe.changes_json
          FROM profile_edits pe
          JOIN influencer_profiles ip ON pe.influencer_profile_id = ip.id
          WHERE pe.status = 'approved'
          ORDER BY pe.influencer_profile_id, pe.created_at DESC
        ) pe ON pe.influencer_profile_id = (
          SELECT ip.id 
          FROM influencer_profiles ip 
          WHERE ip.user_id = i.linked_user_id 
          LIMIT 1
        )
        WHERE ips.influencer_id = i.id
      ) as platform_stats
    FROM influencers i
    WHERE i.linked_user_id IS NOT NULL  -- Только верифицированные блогеры
      AND i.visibility_status = 'виден'
  ),
  unverified_bloggers AS (
    -- Получаем неверифицированных блогеров (только оригинальные данные)
    SELECT 
      i.id,
      i.full_name,
      i.avatar_url,
      i.description,
      i.barter_available,
      i.mart_registry,
      i.contact_link,
      i.work_format,
      i.gender_type,
      i.verification_status,
      i.visibility_status,
      i.linked_user_id,
      i.created_at,
      i.updated_at,
      -- Получаем данные о подписчиках из основной платформы
      COALESCE(
        (SELECT ips.followers 
         FROM influencer_platform_stats ips 
         JOIN platforms p ON ips.platform_id = p.id 
         WHERE ips.influencer_id = i.id AND p.title = 'instagram'
         LIMIT 1),
        0
      ) as followers,
      -- Получаем только оригинальную статистику по платформам
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'platform', p.title,
            'post_price', ips.post_price,
            'story_price', ips.story_price,
            'followers', ips.followers,
            'username', ips.username
          )
        )
        FROM influencer_platform_stats ips
        JOIN platforms p ON ips.platform_id = p.id
        WHERE ips.influencer_id = i.id
      ) as platform_stats
    FROM influencers i
    WHERE i.linked_user_id IS NULL  -- Только неверифицированные блогеры
      AND i.visibility_status = 'виден'
  )
  -- Объединяем верифицированных и неверифицированных блогеров
  SELECT * FROM verified_bloggers
  UNION ALL
  SELECT * FROM unverified_bloggers
  ORDER BY followers DESC;
END;
$$;

-- Предоставляем права на выполнение функции
GRANT EXECUTE ON FUNCTION public.get_blogger_data_with_edits() TO anon, authenticated;
