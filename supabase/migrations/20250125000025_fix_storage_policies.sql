-- ===============================================
-- ИСПРАВЛЕНИЕ ПОЛИТИК ДЛЯ STORAGE BUCKET
-- ===============================================
-- Этот файл настраивает политики для storage bucket profile-assets

-- ===============================================
-- 1. СОЗДАНИЕ BUCKET (если не существует)
-- ===============================================

-- Создаем bucket для файлов профилей
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-assets', 'profile-assets', false)
ON CONFLICT (id) DO NOTHING;

-- ===============================================
-- 2. НАСТРОЙКА ПОЛИТИК ДЛЯ STORAGE
-- ===============================================

-- Удаляем существующие политики (если есть)
DROP POLICY IF EXISTS "Users can upload own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view files" ON storage.objects;

-- Политика для загрузки файлов - пользователи могут загружать файлы в свою папку
CREATE POLICY "Users can upload own files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'profile-assets' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Политика для просмотра файлов - пользователи могут просматривать свои файлы
CREATE POLICY "Users can view own files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'profile-assets' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Политика для обновления файлов - пользователи могут обновлять свои файлы
CREATE POLICY "Users can update own files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'profile-assets' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Политика для удаления файлов - пользователи могут удалять свои файлы
CREATE POLICY "Users can delete own files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'profile-assets' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Публичная политика для просмотра файлов (для отображения скриншотов)
CREATE POLICY "Public can view files" ON storage.objects
    FOR SELECT USING (bucket_id = 'profile-assets');

-- ===============================================
-- 3. ПРОВЕРКА РЕЗУЛЬТАТА
-- ===============================================

-- Проверяем созданные политики
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%profile-assets%' OR policyname LIKE '%own files%' OR policyname LIKE '%view files%';
