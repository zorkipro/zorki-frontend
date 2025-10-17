-- Создаем функцию для одобрения изменений из profile_edits
-- Эта функция будет использоваться администратором для применения изменений
CREATE OR REPLACE FUNCTION public.approve_profile_changes(
  p_profile_edit_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile_edit RECORD;
  v_influencer_profile RECORD;
  v_influencer RECORD;
  v_changes JSONB;
  v_platform_updates JSONB;
  v_result JSON;
BEGIN
  -- Получаем данные изменения
  SELECT * INTO v_profile_edit
  FROM profile_edits
  WHERE id = p_profile_edit_id
    AND status = 'new';
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Profile edit not found or already processed'
    );
  END IF;
  
  -- Получаем данные профиля
  SELECT * INTO v_influencer_profile
  FROM influencer_profiles
  WHERE id = v_profile_edit.influencer_profile_id;
  
  -- Получаем данные блогера
  SELECT * INTO v_influencer
  FROM influencers
  WHERE linked_user_id = v_influencer_profile.user_id;
  
  v_changes := v_profile_edit.changes_json;
  
  -- Обновляем данные в influencer_platform_stats
  -- Instagram pricing
  IF v_changes ? 'instagram_post_price' OR v_changes ? 'instagram_story_price' THEN
    UPDATE influencer_platform_stats
    SET 
      post_price = CASE 
        WHEN v_changes ? 'instagram_post_price' THEN (v_changes->>'instagram_post_price')::INTEGER
        ELSE post_price
      END,
      story_price = CASE 
        WHEN v_changes ? 'instagram_story_price' THEN (v_changes->>'instagram_story_price')::INTEGER
        ELSE story_price
      END,
      updated_at = NOW()
    WHERE influencer_id = v_influencer.id
      AND platform_id = (SELECT id FROM platforms WHERE title = 'instagram');
  END IF;
  
  -- TikTok pricing
  IF v_changes ? 'tiktok_post_price' THEN
    UPDATE influencer_platform_stats
    SET 
      post_price = (v_changes->>'tiktok_post_price')::INTEGER,
      updated_at = NOW()
    WHERE influencer_id = v_influencer.id
      AND platform_id = (SELECT id FROM platforms WHERE title = 'tiktok');
  END IF;
  
  -- YouTube pricing
  IF v_changes ? 'youtube_post_price' OR v_changes ? 'youtube_story_price' THEN
    UPDATE influencer_platform_stats
    SET 
      post_price = CASE 
        WHEN v_changes ? 'youtube_post_price' THEN (v_changes->>'youtube_post_price')::INTEGER
        ELSE post_price
      END,
      story_price = CASE 
        WHEN v_changes ? 'youtube_story_price' THEN (v_changes->>'youtube_story_price')::INTEGER
        ELSE story_price
      END,
      updated_at = NOW()
    WHERE influencer_id = v_influencer.id
      AND platform_id = (SELECT id FROM platforms WHERE title = 'youtube');
  END IF;
  
  -- Telegram pricing
  IF v_changes ? 'telegram_post_price' THEN
    UPDATE influencer_platform_stats
    SET 
      post_price = (v_changes->>'telegram_post_price')::INTEGER,
      updated_at = NOW()
    WHERE influencer_id = v_influencer.id
      AND platform_id = (SELECT id FROM platforms WHERE title = 'telegram');
  END IF;
  
  -- Обновляем статус изменения на 'approved'
  UPDATE profile_edits
  SET 
    status = 'approved',
    updated_at = NOW()
  WHERE id = p_profile_edit_id;
  
  -- Логируем действие администратора
  INSERT INTO admin_actions (admin_id, influencer_id, action, created_at)
  VALUES (
    auth.uid(),
    v_influencer.id,
    'approve_changes',
    NOW()
  );
  
  RETURN json_build_object(
    'success', true,
    'message', 'Changes approved and applied successfully',
    'influencer_id', v_influencer.id,
    'changes_applied', v_changes
  );
END;
$$;

-- Предоставляем права на выполнение функции
GRANT EXECUTE ON FUNCTION public.approve_profile_changes(UUID) TO authenticated;
