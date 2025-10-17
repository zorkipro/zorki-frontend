-- Добавляем поле для связи influencer_profiles с существующими данными блогеров
ALTER TABLE public.influencer_profiles 
ADD COLUMN linked_influencer_id UUID REFERENCES public.influencers(id);

-- Создаем индекс для быстрого поиска
CREATE INDEX idx_influencer_profiles_linked_influencer_id ON public.influencer_profiles(linked_influencer_id);

-- Обновляем функцию связывания профиля с блогером
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
      status = 'verified',
      public_visible = true,
      linked_influencer_id = v_influencer_id,
      -- Копируем данные из существующего блогера
      followers_count = (
        SELECT followers FROM public.influencer_platform_stats 
        WHERE influencer_id = v_influencer_id AND username = p_username LIMIT 1
      ),
      engagement_rate = (
        SELECT engagement_rate FROM public.influencer_platform_stats 
        WHERE influencer_id = v_influencer_id AND username = p_username LIMIT 1
      )
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
