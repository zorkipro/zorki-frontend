-- Создаем функцию для получения полных данных профиля с данными блогера
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
      'created_at', created_at,
      'updated_at', updated_at
    ) INTO v_influencer_profile
    FROM public.influencer_profiles
    WHERE id = (v_profile->>'primary_profile_id')::UUID;

    -- Получаем данные блогера из таблицы influencers
    SELECT json_build_object(
      'id', id,
      'full_name', full_name,
      'bio', bio,
      'avatar_url', avatar_url,
      'location', location,
      'website', website,
      'created_at', created_at,
      'updated_at', updated_at
    ) INTO v_influencer_data
    FROM public.influencers i
    JOIN public.influencer_platform_stats ips ON i.id = ips.influencer_id
    WHERE ips.username = (v_influencer_profile->>'username')
    LIMIT 1;

    -- Получаем статистику платформ
    SELECT json_agg(json_build_object(
      'platform', p.name,
      'username', ips.username,
      'followers_count', ips.followers_count,
      'engagement_rate', ips.engagement_rate,
      'avg_views', ips.avg_views,
      'verified', ips.verified
    )) INTO v_platform_stats
    FROM public.influencer_platform_stats ips
    JOIN public.platforms p ON ips.platform_id = p.id
    JOIN public.influencers i ON ips.influencer_id = i.id
    WHERE ips.username = (v_influencer_profile->>'username');

    -- Получаем последние изменения из profile_edits
    SELECT json_build_object(
      'changes_json', changes_json,
      'created_at', created_at,
      'status', status
    ) INTO v_profile_edits
    FROM public.profile_edits
    WHERE influencer_profile_id = (v_profile->>'primary_profile_id')::UUID
      AND status = 'approved'
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







