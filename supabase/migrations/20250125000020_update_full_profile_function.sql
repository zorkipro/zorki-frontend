-- Обновляем функцию для получения полных данных профиля с данными связанного блогера
CREATE OR REPLACE FUNCTION public.get_full_profile_data(
  p_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile JSON;
  v_influencer_profile JSON;
  v_influencer_data JSON;
  v_platform_stats JSON;
  v_profile_edits JSON;
  v_result JSON;
  v_linked_influencer_id UUID;
BEGIN
  -- Получаем данные из таблицы profiles
  SELECT json_build_object(
    'id', id,
    'user_id', user_id,
    'email', email,
    'primary_profile_id', primary_profile_id,
    'instagram_username', instagram_username,
    'created_at', created_at,
    'updated_at', updated_at
  ) INTO v_profile
  FROM public.profiles
  WHERE user_id = p_user_id;

  -- Если профиль найден, получаем данные influencer_profiles
  IF v_profile IS NOT NULL AND (v_profile->>'primary_profile_id') IS NOT NULL THEN
    SELECT json_build_object(
      'id', id,
      'platform', platform,
      'username', username,
      'user_id', user_id,
      'status', status,
      'source', source,
      'followers_count', followers_count,
      'avg_reels_views', avg_reels_views,
      'public_visible', public_visible,
      'linked_influencer_id', linked_influencer_id,
      'created_at', created_at,
      'updated_at', updated_at
    ) INTO v_influencer_profile
    FROM public.influencer_profiles
    WHERE id = (v_profile->>'primary_profile_id')::UUID;

    -- Получаем ID связанного блогера
    v_linked_influencer_id := (v_influencer_profile->>'linked_influencer_id')::UUID;

    -- Если есть связанный блогер, получаем его данные
    IF v_linked_influencer_id IS NOT NULL THEN
      SELECT json_build_object(
        'id', id,
        'full_name', full_name,
        'bio', description,
        'avatar_url', avatar_url,
        'gender_type', gender_type,
        'work_format', work_format,
        'barter_available', barter_available,
        'mart_registry', mart_registry,
        'contact_link', contact_link,
        'verification_status', verification_status,
        'visibility_status', visibility_status,
        'created_at', created_at,
        'updated_at', updated_at
      ) INTO v_influencer_data
      FROM public.influencers
      WHERE id = v_linked_influencer_id;

      -- Получаем статистику платформ для связанного блогера
      SELECT json_agg(json_build_object(
        'platform', p.title,
        'username', ips.username,
        'followers', ips.followers,
        'engagement_rate', ips.engagement_rate,
        'post_reach', ips.post_reach,
        'story_reach', ips.story_reach,
        'post_price', ips.post_price,
        'story_price', ips.story_price,
        'profile_url', ips.profile_url
      )) INTO v_platform_stats
      FROM public.influencer_platform_stats ips
      JOIN public.platforms p ON ips.platform_id = p.id
      WHERE ips.influencer_id = v_linked_influencer_id;
    ELSE
      -- Если нет связанного блогера, пытаемся найти по username (старый способ)
      SELECT json_build_object(
        'id', id,
        'full_name', full_name,
        'bio', description,
        'avatar_url', avatar_url,
        'gender_type', gender_type,
        'work_format', work_format,
        'barter_available', barter_available,
        'mart_registry', mart_registry,
        'contact_link', contact_link,
        'verification_status', verification_status,
        'visibility_status', visibility_status,
        'created_at', created_at,
        'updated_at', updated_at
      ) INTO v_influencer_data
      FROM public.influencers i
      JOIN public.influencer_platform_stats ips ON i.id = ips.influencer_id
      WHERE ips.username = (v_influencer_profile->>'username')
      LIMIT 1;

      -- Получаем статистику платформ по username
      SELECT json_agg(json_build_object(
        'platform', p.title,
        'username', ips.username,
        'followers', ips.followers,
        'engagement_rate', ips.engagement_rate,
        'post_reach', ips.post_reach,
        'story_reach', ips.story_reach,
        'post_price', ips.post_price,
        'story_price', ips.story_price,
        'profile_url', ips.profile_url
      )) INTO v_platform_stats
      FROM public.influencer_platform_stats ips
      JOIN public.platforms p ON ips.platform_id = p.id
      JOIN public.influencers i ON ips.influencer_id = i.id
      WHERE ips.username = (v_influencer_profile->>'username');
    END IF;

    -- Получаем последние изменения из profile_edits (ВСЕ изменения для страницы редактирования)
    SELECT json_build_object(
      'changes_json', changes_json,
      'created_at', created_at,
      'status', status
    ) INTO v_profile_edits
    FROM public.profile_edits
    WHERE influencer_profile_id = (v_profile->>'primary_profile_id')::UUID
    ORDER BY created_at DESC
    LIMIT 1;

    -- Собираем все данные в один объект
    v_result := json_build_object(
      'profile', v_profile,
      'influencer_profile', v_influencer_profile,
      'influencer_data', v_influencer_data,
      'platform_stats', v_platform_stats,
      'profile_edits', v_profile_edits
    );
  ELSE
    v_result := json_build_object(
      'profile', v_profile,
      'influencer_profile', null,
      'influencer_data', null,
      'platform_stats', null,
      'profile_edits', null
    );
  END IF;

  RETURN v_result;
END;
$$;

-- Предоставляем права на выполнение функции
GRANT EXECUTE ON FUNCTION public.get_full_profile_data(UUID) TO anon, authenticated;
