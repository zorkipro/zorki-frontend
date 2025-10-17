-- Создаем функцию для отклонения изменений из profile_edits
CREATE OR REPLACE FUNCTION public.reject_profile_changes(
  p_profile_edit_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile_edit RECORD;
  v_influencer_profile RECORD;
  v_influencer RECORD;
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
  
  -- Обновляем статус изменения на 'rejected'
  UPDATE profile_edits
  SET 
    status = 'rejected',
    updated_at = NOW()
  WHERE id = p_profile_edit_id;
  
  -- Логируем действие администратора
  INSERT INTO admin_actions (admin_id, influencer_id, action, created_at)
  VALUES (
    auth.uid(),
    v_influencer.id,
    'reject_changes',
    NOW()
  );
  
  RETURN json_build_object(
    'success', true,
    'message', 'Changes rejected successfully',
    'influencer_id', v_influencer.id,
    'reason', p_reason
  );
END;
$$;

-- Предоставляем права на выполнение функции
GRANT EXECUTE ON FUNCTION public.reject_profile_changes(UUID, TEXT) TO authenticated;
