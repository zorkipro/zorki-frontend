-- Создаем функцию для связывания профиля с существующими данными блогера
CREATE OR REPLACE FUNCTION public.link_profile_to_blogger(
  p_user_id UUID,
  p_username TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_influencer_id UUID;
  v_profile_id UUID;
  v_result JSON;
BEGIN
  -- Ищем существующего блогера по username в influencer_platform_stats
  SELECT DISTINCT i.id INTO v_influencer_id
  FROM public.influencers i
  JOIN public.influencer_platform_stats ips ON i.id = ips.influencer_id
  WHERE ips.username = p_username
  LIMIT 1;

  -- Если блогер найден, обновляем influencer_profiles
  IF v_influencer_id IS NOT NULL THEN
    -- Получаем ID профиля пользователя
    SELECT primary_profile_id INTO v_profile_id
    FROM public.profiles
    WHERE user_id = p_user_id;

    -- Обновляем influencer_profiles, связывая с существующим блогером
    UPDATE public.influencer_profiles
    SET 
      username = p_username,
      status = 'unverified',
      public_visible = false
    WHERE id = v_profile_id;

    -- Обновляем profiles, добавляя связь с блогером
    UPDATE public.profiles
    SET 
      instagram_username = p_username
    WHERE user_id = p_user_id;

    -- Возвращаем информацию о связанном блогере
    SELECT json_build_object(
      'success', true,
      'influencer_id', v_influencer_id,
      'profile_id', v_profile_id,
      'username', p_username,
      'message', 'Profile linked to existing blogger successfully'
    ) INTO v_result;
  ELSE
    -- Блогер не найден
    SELECT json_build_object(
      'success', false,
      'message', 'Blogger not found with username: ' || p_username
    ) INTO v_result;
  END IF;

  RETURN v_result;
END;
$$;

-- Предоставляем права на выполнение функции
GRANT EXECUTE ON FUNCTION public.link_profile_to_blogger(UUID, TEXT) TO anon, authenticated;



