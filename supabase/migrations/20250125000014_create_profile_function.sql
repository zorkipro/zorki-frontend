-- Создаем функцию для создания профиля инстаграм
CREATE OR REPLACE FUNCTION public.create_instagram_profile(
  p_username TEXT,
  p_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile_id UUID;
  v_result JSON;
BEGIN
  -- Создаем профиль в influencer_profiles
  INSERT INTO public.influencer_profiles (
    platform,
    username,
    user_id,
    status,
    source,
    followers_count,
    avg_reels_views,
    public_visible
  ) VALUES (
    'instagram',
    p_username,
    p_user_id,
    'unverified',
    'manual',
    0,
    0,
    false
  ) RETURNING id INTO v_profile_id;

  -- Создаем или обновляем запись в profiles
  INSERT INTO public.profiles (
    user_id,
    email,
    primary_profile_id,
    instagram_username
  ) VALUES (
    p_user_id,
    '',
    v_profile_id,
    p_username
  ) ON CONFLICT (user_id) DO UPDATE SET
    primary_profile_id = v_profile_id,
    instagram_username = p_username;

  -- Возвращаем результат
  SELECT json_build_object(
    'success', true,
    'profile_id', v_profile_id,
    'username', p_username,
    'user_id', p_user_id
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- Предоставляем права на выполнение функции
GRANT EXECUTE ON FUNCTION public.create_instagram_profile(TEXT, UUID) TO anon, authenticated;







