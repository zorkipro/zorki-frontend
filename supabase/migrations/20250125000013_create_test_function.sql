-- Создаем простую функцию для тестирования подключения
CREATE OR REPLACE FUNCTION test_connection()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN 'Connection successful';
END;
$$;







