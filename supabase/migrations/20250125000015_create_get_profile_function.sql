-- Создаем функцию для получения данных профиля
CREATE OR REPLACE FUNCTION public.get_user_profile(
  p_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile JSON;
  v_influencer_profile JSON;
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

    -- Добавляем данные influencer_profiles к основному профилю
    v_profile := jsonb_set(v_profile::jsonb, '{influencer_profile}', v_influencer_profile::jsonb)::json;
  END IF;

  RETURN v_profile;
END;
$$;

-- Предоставляем права на выполнение функции
GRANT EXECUTE ON FUNCTION public.get_user_profile(UUID) TO anon, authenticated;







