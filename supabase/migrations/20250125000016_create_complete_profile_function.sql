-- Создаем полную функцию для получения всех данных профиля
CREATE OR REPLACE FUNCTION public.get_complete_user_profile(
  p_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile JSON;
  v_influencer_profile JSON;
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
      'profile_edits', v_profile_edits
    );
  ELSE
    v_result := json_build_object(
      'profile', v_profile,
      'influencer_profile', null,
      'profile_edits', null
    );
  END IF;

  RETURN v_result;
END;
$$;

-- Предоставляем права на выполнение функции
GRANT EXECUTE ON FUNCTION public.get_complete_user_profile(UUID) TO anon, authenticated;







