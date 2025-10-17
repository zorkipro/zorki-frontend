-- ===============================================
-- ДОБАВЛЕНИЕ 10 БЛОГЕРОВ В УДАЛЕННУЮ БАЗУ ДАННЫХ
-- ===============================================
-- Этот скрипт можно выполнить в Supabase SQL Editor

-- ===============================================
-- 1. СНАЧАЛА ИСПРАВЛЯЕМ ОГРАНИЧЕНИЯ URL
-- ===============================================

-- Временно отключаем ограничения URL
ALTER TABLE public.influencers 
DROP CONSTRAINT IF EXISTS influencers_avatar_url_check;

ALTER TABLE public.influencer_profiles 
DROP CONSTRAINT IF EXISTS influencer_profiles_profile_picture_url_check;

ALTER TABLE public.influencer_profiles 
DROP CONSTRAINT IF EXISTS influencer_profiles_external_url_check;

-- Добавляем новые ограничения (поддерживают локальные пути)
ALTER TABLE public.influencers 
ADD CONSTRAINT influencers_avatar_url_check 
CHECK (avatar_url IS NULL OR avatar_url ~ '^(https?://|/)');

ALTER TABLE public.influencer_profiles 
ADD CONSTRAINT influencer_profiles_profile_picture_url_check 
CHECK (profile_picture_url IS NULL OR profile_picture_url ~ '^(https?://|/)');

ALTER TABLE public.influencer_profiles 
ADD CONSTRAINT influencer_profiles_external_url_check 
CHECK (external_url IS NULL OR external_url ~ '^(https?://|/)');

-- ===============================================
-- 2. ДОБАВЛЯЕМ 10 БЛОГЕРОВ
-- ===============================================

DO $$
DECLARE
    instagram_id UUID;
    tiktok_id UUID;
    youtube_id UUID;
    telegram_id UUID;
    
    -- ID тематик
    beauty_id UUID;
    tech_id UUID;
    fitness_id UUID;
    travel_id UUID;
    food_id UUID;
    sport_id UUID;
    family_id UUID;
    business_id UUID;
    psychology_id UUID;
    cars_id UUID;
    
    -- ID блогеров
    anna_id UUID;
    dmitry_id UUID;
    elena_id UUID;
    igor_id UUID;
    olga_id UUID;
    andrey_id UUID;
    maria_id UUID;
    sergey_id UUID;
    natalia_id UUID;
    alexey_id UUID;
BEGIN
    -- Получаем ID платформ
    SELECT id INTO instagram_id FROM platforms WHERE title = 'instagram';
    SELECT id INTO tiktok_id FROM platforms WHERE title = 'tiktok';
    SELECT id INTO youtube_id FROM platforms WHERE title = 'youtube';
    SELECT id INTO telegram_id FROM platforms WHERE title = 'telegram';
    
    -- Получаем ID тематик
    SELECT id INTO beauty_id FROM topics WHERE title = 'Красота и мода';
    SELECT id INTO tech_id FROM topics WHERE title = 'Технологии';
    SELECT id INTO fitness_id FROM topics WHERE title = 'Здоровье и фитнес';
    SELECT id INTO travel_id FROM topics WHERE title = 'Путешествия';
    SELECT id INTO food_id FROM topics WHERE title = 'Еда и рецепты';
    SELECT id INTO sport_id FROM topics WHERE title = 'Спорт';
    SELECT id INTO family_id FROM topics WHERE title = 'Дети и семья';
    SELECT id INTO business_id FROM topics WHERE title = 'Бизнес';
    SELECT id INTO psychology_id FROM topics WHERE title = 'Психология';
    SELECT id INTO cars_id FROM topics WHERE title = 'Автомобили';

    -- ===============================================
    -- 1. АННА ПЕТРОВА - Красота и мода (все платформы)
    -- ===============================================
    INSERT INTO influencers (
        full_name, avatar_url, description, barter_available, mart_registry,
        contact_link, work_format, gender_type, verification_status, visibility_status
    ) VALUES (
        'Анна Петрова',
        '/blogger-anna.jpg',
        'Бьюти-блогер с 5-летним опытом. Специализируюсь на макияже, уходе за кожей и модных трендах. Работаю с брендами косметики и одежды. Помогаю девушкам найти свой стиль и подчеркнуть красоту.',
        true, true,
        'https://t.me/anna_petrova_beauty',
        'ИП', 'женщина', 'одобрен', 'виден'
    ) RETURNING id INTO anna_id;

    -- Создаем профили по платформам для Анны (БЕЗ привязки к пользователям)
    INSERT INTO influencer_profiles (platform, username, full_name, bio, followers_count, following_count, posts_count, is_verified, is_private, is_business, profile_picture_url, external_url, public_visible, source, status, avg_reels_views) VALUES
    ('instagram', 'anna_petrova_beauty', 'Анна Петрова', '💄 Бьюти-блогер | Макияж и уход | Коллаборации: @anna_petrova_beauty | Минск', 45000, 2500, 850, true, false, true, '/blogger-anna.jpg', 'https://instagram.com/anna_petrova_beauty', true, 'manual', 'verified', 12000),
    ('tiktok', 'anna_petrova_beauty', 'Анна Петрова', '💄 Beauty & Lifestyle | Минск | Коллаборации в профиле', 32000, 800, 1200, true, false, true, '/blogger-anna.jpg', 'https://tiktok.com/@anna_petrova_beauty', true, 'manual', 'verified', 0),
    ('youtube', 'Anna Petrova Beauty', 'Анна Петрова', 'Бьюти-блогер из Минска. Обзоры косметики, туториалы по макияжу, лайфхаки красоты. Коллаборации: anna.petrova.beauty@gmail.com', 15000, 400, 180, true, false, true, '/blogger-anna.jpg', 'https://youtube.com/@annapetrova', true, 'manual', 'verified', 0),
    ('telegram', 'anna_petrova_beauty', 'Анна Петрова', '💄 Бьюти-блог | Новости красоты | Коллаборации', 8500, 200, 0, false, false, true, '/blogger-anna.jpg', 'https://t.me/anna_petrova_beauty', true, 'manual', 'verified', 0);

    -- Статистика по платформам для Анны (цены кратны 10)
    INSERT INTO influencer_platform_stats (influencer_id, platform_id, username, profile_url, followers, engagement_rate, post_reach, story_reach, post_price, story_price) VALUES
    (anna_id, instagram_id, 'anna_petrova_beauty', 'https://instagram.com/anna_petrova_beauty', 45000, 4.2, 38000, 25000, 150, 80),
    (anna_id, tiktok_id, 'anna_petrova_beauty', 'https://tiktok.com/@anna_petrova_beauty', 32000, 6.8, 28000, 18000, 120, 60),
    (anna_id, youtube_id, 'Anna Petrova Beauty', 'https://youtube.com/@annapetrova', 15000, 3.5, 12000, 8000, 200, 100),
    (anna_id, telegram_id, 'anna_petrova_beauty', 'https://t.me/anna_petrova_beauty', 8500, 5.1, 7000, 4500, 80, 40);

    -- Тематики для Анны
    INSERT INTO influencer_topics (influencer_id, topic_id) VALUES (anna_id, beauty_id);

    -- ===============================================
    -- 2. ДМИТРИЙ КОЗЛОВ - Технологии (Instagram + YouTube)
    -- ===============================================
    INSERT INTO influencers (
        full_name, avatar_url, description, barter_available, mart_registry,
        contact_link, work_format, gender_type, verification_status, visibility_status
    ) VALUES (
        'Дмитрий Козлов',
        '/blogger-dmitry.jpg',
        'IT-эксперт и обозреватель гаджетов. Анализирую новинки технологий, тестирую смартфоны и ноутбуки. Помогаю выбрать лучшую технику. 8 лет в IT-сфере.',
        false, false,
        'https://t.me/dmitry_tech_review',
        'профдоход', 'мужчина', 'одобрен', 'виден'
    ) RETURNING id INTO dmitry_id;

    INSERT INTO influencer_profiles (platform, username, full_name, bio, followers_count, following_count, posts_count, is_verified, is_private, is_business, profile_picture_url, external_url, public_visible, source, status, avg_reels_views) VALUES
    ('instagram', 'dmitry_tech_review', 'Дмитрий Козлов', '📱 Обзоры гаджетов | IT-новости | Минск | Коллаборации: dmitry.tech@gmail.com', 28000, 1200, 420, true, false, true, '/blogger-dmitry.jpg', 'https://instagram.com/dmitry_tech_review', true, 'manual', 'verified', 8000),
    ('youtube', 'Dmitry Tech Review', 'Дмитрий Козлов', 'Обзоры смартфонов, ноутбуков и гаджетов. Честные тесты и рекомендации. Коллаборации: dmitry.tech@gmail.com', 45000, 600, 95, true, false, true, '/blogger-dmitry.jpg', 'https://youtube.com/@dmitrytech', true, 'manual', 'verified', 0);

    INSERT INTO influencer_platform_stats (influencer_id, platform_id, username, profile_url, followers, engagement_rate, post_reach, story_reach, post_price, story_price) VALUES
    (dmitry_id, instagram_id, 'dmitry_tech_review', 'https://instagram.com/dmitry_tech_review', 28000, 3.8, 22000, 15000, 200, 100),
    (dmitry_id, youtube_id, 'Dmitry Tech Review', 'https://youtube.com/@dmitrytech', 45000, 4.5, 38000, 25000, 300, 150);

    INSERT INTO influencer_topics (influencer_id, topic_id) VALUES (dmitry_id, tech_id);

    -- ===============================================
    -- 3. ЕЛЕНА СМИРНОВА - Фитнес (Instagram + TikTok)
    -- ===============================================
    INSERT INTO influencers (
        full_name, avatar_url, description, barter_available, mart_registry,
        contact_link, work_format, gender_type, verification_status, visibility_status
    ) VALUES (
        'Елена Смирнова',
        '/blogger-elena.jpg',
        'Фитнес-тренер и нутрициолог. Помогаю достичь здоровых целей через правильное питание и тренировки. Сертифицированный специалист с 6-летним опытом.',
        true, true,
        'https://t.me/elena_fitness_coach',
        'ИП', 'женщина', 'одобрен', 'виден'
    ) RETURNING id INTO elena_id;

    INSERT INTO influencer_profiles (platform, username, full_name, bio, followers_count, following_count, posts_count, is_verified, is_private, is_business, profile_picture_url, external_url, public_visible, source, status, avg_reels_views) VALUES
    ('instagram', 'elena_fitness_coach', 'Елена Смирнова', '💪 Фитнес-тренер | Нутрициолог | ЗОЖ | Минск | Коллаборации: elena.fitness@gmail.com', 32000, 1800, 650, true, false, true, '/blogger-elena.jpg', 'https://instagram.com/elena_fitness_coach', true, 'manual', 'verified', 15000),
    ('tiktok', 'elena_fitness_coach', 'Елена Смирнова', '💪 Fitness & Nutrition | Минск | Коллаборации в профиле', 28000, 600, 1800, true, false, true, '/blogger-elena.jpg', 'https://tiktok.com/@elena_fitness_coach', true, 'manual', 'verified', 0);

    INSERT INTO influencer_platform_stats (influencer_id, platform_id, username, profile_url, followers, engagement_rate, post_reach, story_reach, post_price, story_price) VALUES
    (elena_id, instagram_id, 'elena_fitness_coach', 'https://instagram.com/elena_fitness_coach', 32000, 5.2, 28000, 18000, 120, 60),
    (elena_id, tiktok_id, 'elena_fitness_coach', 'https://tiktok.com/@elena_fitness_coach', 28000, 7.1, 24000, 16000, 100, 50);

    INSERT INTO influencer_topics (influencer_id, topic_id) VALUES (elena_id, fitness_id);

    -- ===============================================
    -- 4. ИГОРЬ ВОЛКОВ - Путешествия (Instagram + YouTube + Telegram)
    -- ===============================================
    INSERT INTO influencers (
        full_name, avatar_url, description, barter_available, mart_registry,
        contact_link, work_format, gender_type, verification_status, visibility_status
    ) VALUES (
        'Игорь Волков',
        '/blogger-igor.jpg',
        'Путешественник и фотограф. Побывал в 50+ странах, делюсь лайфхаками для бюджетных поездок и красивыми местами. 7 лет в путешествиях.',
        true, false,
        'https://t.me/igor_travel_guide',
        'договор подряда', 'мужчина', 'одобрен', 'виден'
    ) RETURNING id INTO igor_id;

    INSERT INTO influencer_profiles (platform, username, full_name, bio, followers_count, following_count, posts_count, is_verified, is_private, is_business, profile_picture_url, external_url, public_visible, source, status, avg_reels_views) VALUES
    ('instagram', 'igor_travel_guide', 'Игорь Волков', '✈️ Путешественник | Фотограф | 50+ стран | Минск | Коллаборации: igor.travel@gmail.com', 38000, 2200, 1200, true, false, true, '/blogger-igor.jpg', 'https://instagram.com/igor_travel_guide', true, 'manual', 'verified', 18000),
    ('youtube', 'Igor Travel Guide', 'Игорь Волков', 'Путешествия по миру, лайфхаки для бюджетных поездок, красивые места планеты. Коллаборации: igor.travel@gmail.com', 22000, 500, 85, true, false, true, '/blogger-igor.jpg', 'https://youtube.com/@igortravel', true, 'manual', 'verified', 0),
    ('telegram', 'igor_travel_guide', 'Игорь Волков', '✈️ Путешествия | Лайфхаки | Фото', 12000, 300, 0, false, false, true, '/blogger-igor.jpg', 'https://t.me/igor_travel_guide', true, 'manual', 'verified', 0);

    INSERT INTO influencer_platform_stats (influencer_id, platform_id, username, profile_url, followers, engagement_rate, post_reach, story_reach, post_price, story_price) VALUES
    (igor_id, instagram_id, 'igor_travel_guide', 'https://instagram.com/igor_travel_guide', 38000, 4.8, 32000, 20000, 180, 90),
    (igor_id, youtube_id, 'Igor Travel Guide', 'https://youtube.com/@igortravel', 22000, 3.9, 18000, 12000, 250, 130),
    (igor_id, telegram_id, 'igor_travel_guide', 'https://t.me/igor_travel_guide', 12000, 6.2, 10000, 6500, 90, 50);

    INSERT INTO influencer_topics (influencer_id, topic_id) VALUES (igor_id, travel_id);

    -- ===============================================
    -- 5. ОЛЬГА НОВИКОВА - Кулинария (Instagram + TikTok + YouTube)
    -- ===============================================
    INSERT INTO influencers (
        full_name, avatar_url, description, barter_available, mart_registry,
        contact_link, work_format, gender_type, verification_status, visibility_status
    ) VALUES (
        'Ольга Новикова',
        '/blogger-olga.jpg',
        'Шеф-повар и кулинарный блогер. Готовлю простые и вкусные блюда, делюсь рецептами и секретами кулинарии. Работаю с продуктовыми брендами. 4 года в кулинарии.',
        true, true,
        'https://t.me/olga_cooking_master',
        'ИП', 'женщина', 'одобрен', 'виден'
    ) RETURNING id INTO olga_id;

    INSERT INTO influencer_profiles (platform, username, full_name, bio, followers_count, following_count, posts_count, is_verified, is_private, is_business, profile_picture_url, external_url, public_visible, source, status, avg_reels_views) VALUES
    ('instagram', 'olga_cooking_master', 'Ольга Новикова', '👩‍🍳 Шеф-повар | Рецепты | Кулинария | Минск | Коллаборации: olga.cooking@gmail.com', 25000, 1200, 580, true, false, true, '/blogger-olga.jpg', 'https://instagram.com/olga_cooking_master', true, 'manual', 'verified', 10000),
    ('tiktok', 'olga_cooking_master', 'Ольга Новикова', '👩‍🍳 Cooking & Recipes | Минск | Коллаборации в профиле', 35000, 800, 2200, true, false, true, '/blogger-olga.jpg', 'https://tiktok.com/@olga_cooking_master', true, 'manual', 'verified', 0),
    ('youtube', 'Olga Cooking Master', 'Ольга Новикова', 'Кулинарные рецепты, секреты приготовления, обзоры кухонной техники. Коллаборации: olga.cooking@gmail.com', 18000, 400, 120, true, false, true, '/blogger-olga.jpg', 'https://youtube.com/@olgacooking', true, 'manual', 'verified', 0);

    INSERT INTO influencer_platform_stats (influencer_id, platform_id, username, profile_url, followers, engagement_rate, post_reach, story_reach, post_price, story_price) VALUES
    (olga_id, instagram_id, 'olga_cooking_master', 'https://instagram.com/olga_cooking_master', 25000, 5.5, 21000, 14000, 100, 50),
    (olga_id, tiktok_id, 'olga_cooking_master', 'https://tiktok.com/@olga_cooking_master', 35000, 8.2, 30000, 20000, 80, 40),
    (olga_id, youtube_id, 'Olga Cooking Master', 'https://youtube.com/@olgacooking', 18000, 4.1, 15000, 10000, 150, 80);

    INSERT INTO influencer_topics (influencer_id, topic_id) VALUES (olga_id, food_id);

    -- ===============================================
    -- 6. АНДРЕЙ МОРОЗОВ - Спорт (Instagram + YouTube)
    -- ===============================================
    INSERT INTO influencers (
        full_name, avatar_url, description, barter_available, mart_registry,
        contact_link, work_format, gender_type, verification_status, visibility_status
    ) VALUES (
        'Андрей Морозов',
        '/blogger-andrey.jpg',
        'Профессиональный тренер по бодибилдингу. Помогаю набрать мышечную массу и сбросить лишний вес. 10 лет в спорте, сертифицированный тренер.',
        false, false,
        'https://t.me/andrey_bodybuilding',
        'ООО', 'мужчина', 'одобрен', 'виден'
    ) RETURNING id INTO andrey_id;

    INSERT INTO influencer_profiles (platform, username, full_name, bio, followers_count, following_count, posts_count, is_verified, is_private, is_business, profile_picture_url, external_url, public_visible, source, status, avg_reels_views) VALUES
    ('instagram', 'andrey_bodybuilding', 'Андрей Морозов', '💪 Тренер по бодибилдингу | Фитнес | Минск | Коллаборации: andrey.fitness@gmail.com', 22000, 1000, 380, true, false, true, '/blogger-andrey.jpg', 'https://instagram.com/andrey_bodybuilding', true, 'manual', 'verified', 12000),
    ('youtube', 'Andrey Bodybuilding', 'Андрей Морозов', 'Тренировки, питание, добавки. Помогаю достичь спортивных целей. Коллаборации: andrey.fitness@gmail.com', 35000, 500, 75, true, false, true, '/blogger-andrey.jpg', 'https://youtube.com/@andreybodybuilding', true, 'manual', 'verified', 0);

    INSERT INTO influencer_platform_stats (influencer_id, platform_id, username, profile_url, followers, engagement_rate, post_reach, story_reach, post_price, story_price) VALUES
    (andrey_id, instagram_id, 'andrey_bodybuilding', 'https://instagram.com/andrey_bodybuilding', 22000, 4.3, 18000, 12000, 130, 70),
    (andrey_id, youtube_id, 'Andrey Bodybuilding', 'https://youtube.com/@andreybodybuilding', 35000, 5.7, 30000, 20000, 200, 100);

    INSERT INTO influencer_topics (influencer_id, topic_id) VALUES (andrey_id, sport_id);

    -- ===============================================
    -- 7. МАРИЯ СОКОЛОВА - Семья (Instagram + TikTok)
    -- ===============================================
    INSERT INTO influencers (
        full_name, avatar_url, description, barter_available, mart_registry,
        contact_link, work_format, gender_type, verification_status, visibility_status
    ) VALUES (
        'Мария Соколова',
        '/blogger-couple.jpg',
        'Мама троих детей и семейный психолог. Делюсь опытом воспитания, лайфхаками для родителей и семейными традициями. 8 лет в психологии.',
        true, true,
        'https://t.me/maria_family_blog',
        'ИП', 'женщина', 'одобрен', 'виден'
    ) RETURNING id INTO maria_id;

    INSERT INTO influencer_profiles (platform, username, full_name, bio, followers_count, following_count, posts_count, is_verified, is_private, is_business, profile_picture_url, external_url, public_visible, source, status, avg_reels_views) VALUES
    ('instagram', 'maria_family_blog', 'Мария Соколова', '👨‍👩‍👧‍👦 Мама 3 детей | Семейный психолог | Минск | Коллаборации: maria.family@gmail.com', 35000, 1500, 720, true, false, true, '/blogger-couple.jpg', 'https://instagram.com/maria_family_blog', true, 'manual', 'verified', 16000),
    ('tiktok', 'maria_family_blog', 'Мария Соколова', '👨‍👩‍👧‍👦 Family Life | Parenting | Минск | Коллаборации в профиле', 42000, 1000, 1900, true, false, true, '/blogger-couple.jpg', 'https://tiktok.com/@maria_family_blog', true, 'manual', 'verified', 0);

    INSERT INTO influencer_platform_stats (influencer_id, platform_id, username, profile_url, followers, engagement_rate, post_reach, story_reach, post_price, story_price) VALUES
    (maria_id, instagram_id, 'maria_family_blog', 'https://instagram.com/maria_family_blog', 35000, 6.1, 30000, 20000, 140, 70),
    (maria_id, tiktok_id, 'maria_family_blog', 'https://tiktok.com/@maria_family_blog', 42000, 7.8, 36000, 24000, 120, 60);

    INSERT INTO influencer_topics (influencer_id, topic_id) VALUES (maria_id, family_id);

    -- ===============================================
    -- 8. СЕРГЕЙ ЛЕБЕДЕВ - Бизнес (Instagram + YouTube + Telegram)
    -- ===============================================
    INSERT INTO influencers (
        full_name, avatar_url, description, barter_available, mart_registry,
        contact_link, work_format, gender_type, verification_status, visibility_status
    ) VALUES (
        'Сергей Лебедев',
        '/blogger-default.svg',
        'Предприниматель и бизнес-консультант. Помогаю запускать и развивать бизнес, делюсь опытом управления и инвестиций. 12 лет в бизнесе.',
        false, false,
        'https://t.me/sergey_business_guru',
        'ООО', 'мужчина', 'одобрен', 'виден'
    ) RETURNING id INTO sergey_id;

    INSERT INTO influencer_profiles (platform, username, full_name, bio, followers_count, following_count, posts_count, is_verified, is_private, is_business, profile_picture_url, external_url, public_visible, source, status, avg_reels_views) VALUES
    ('instagram', 'sergey_business_guru', 'Сергей Лебедев', '💼 Бизнес-консультант | Предприниматель | Минск | Коллаборации: sergey.business@gmail.com', 18000, 800, 280, true, false, true, '/blogger-default.svg', 'https://instagram.com/sergey_business_guru', true, 'manual', 'verified', 6000),
    ('youtube', 'Sergey Business Guru', 'Сергей Лебедев', 'Бизнес-консультации, управление, инвестиции, развитие компаний. Коллаборации: sergey.business@gmail.com', 28000, 400, 65, true, false, true, '/blogger-default.svg', 'https://youtube.com/@sergeybusiness', true, 'manual', 'verified', 0),
    ('telegram', 'sergey_business_guru', 'Сергей Лебедев', '💼 Бизнес | Инвестиции | Управление', 15000, 200, 0, false, false, true, '/blogger-default.svg', 'https://t.me/sergey_business_guru', true, 'manual', 'verified', 0);

    INSERT INTO influencer_platform_stats (influencer_id, platform_id, username, profile_url, followers, engagement_rate, post_reach, story_reach, post_price, story_price) VALUES
    (sergey_id, instagram_id, 'sergey_business_guru', 'https://instagram.com/sergey_business_guru', 18000, 3.2, 15000, 10000, 250, 130),
    (sergey_id, youtube_id, 'Sergey Business Guru', 'https://youtube.com/@sergeybusiness', 28000, 4.8, 24000, 16000, 350, 180),
    (sergey_id, telegram_id, 'sergey_business_guru', 'https://t.me/sergey_business_guru', 15000, 5.5, 13000, 8500, 200, 100);

    INSERT INTO influencer_topics (influencer_id, topic_id) VALUES (sergey_id, business_id);

    -- ===============================================
    -- 9. НАТАЛЬЯ КОВАЛЕВА - Психология (Instagram + Telegram)
    -- ===============================================
    INSERT INTO influencers (
        full_name, avatar_url, description, barter_available, mart_registry,
        contact_link, work_format, gender_type, verification_status, visibility_status
    ) VALUES (
        'Наталья Ковалева',
        '/blogger-fashion.jpg',
        'Практикующий психолог и коуч. Помогаю решать личные проблемы, развивать эмоциональный интеллект и строить здоровые отношения. 9 лет практики.',
        true, true,
        'https://t.me/natalia_psychologist',
        'ИП', 'женщина', 'одобрен', 'виден'
    ) RETURNING id INTO natalia_id;

    INSERT INTO influencer_profiles (platform, username, full_name, bio, followers_count, following_count, posts_count, is_verified, is_private, is_business, profile_picture_url, external_url, public_visible, source, status, avg_reels_views) VALUES
    ('instagram', 'natalia_psychologist', 'Наталья Ковалева', '🧠 Психолог | Коуч | Саморазвитие | Минск | Коллаборации: natalia.psychology@gmail.com', 30000, 1400, 520, true, false, true, '/blogger-fashion.jpg', 'https://instagram.com/natalia_psychologist', true, 'manual', 'verified', 11000),
    ('telegram', 'natalia_psychologist', 'Наталья Ковалева', '🧠 Психология | Коучинг | Саморазвитие', 22000, 300, 0, false, false, true, '/blogger-fashion.jpg', 'https://t.me/natalia_psychologist', true, 'manual', 'verified', 0);

    INSERT INTO influencer_platform_stats (influencer_id, platform_id, username, profile_url, followers, engagement_rate, post_reach, story_reach, post_price, story_price) VALUES
    (natalia_id, instagram_id, 'natalia_psychologist', 'https://instagram.com/natalia_psychologist', 30000, 4.7, 25000, 16000, 160, 80),
    (natalia_id, telegram_id, 'natalia_psychologist', 'https://t.me/natalia_psychologist', 22000, 6.3, 19000, 12500, 120, 60);

    INSERT INTO influencer_topics (influencer_id, topic_id) VALUES (natalia_id, psychology_id);

    -- ===============================================
    -- 10. АЛЕКСЕЙ РОМАНОВ - Автомобили (Instagram + YouTube + TikTok)
    -- ===============================================
    INSERT INTO influencers (
        full_name, avatar_url, description, barter_available, mart_registry,
        contact_link, work_format, gender_type, verification_status, visibility_status
    ) VALUES (
        'Алексей Романов',
        '/blogger-default.svg',
        'Автомобильный эксперт и тест-драйвер. Обозреваю новые модели, тестирую технику и делюсь советами по выбору автомобиля. 6 лет в автосфере.',
        true, false,
        'https://t.me/alexey_car_review',
        'договор подряда', 'мужчина', 'одобрен', 'виден'
    ) RETURNING id INTO alexey_id;

    INSERT INTO influencer_profiles (platform, username, full_name, bio, followers_count, following_count, posts_count, is_verified, is_private, is_business, profile_picture_url, external_url, public_visible, source, status, avg_reels_views) VALUES
    ('instagram', 'alexey_car_review', 'Алексей Романов', '🚗 Автоэксперт | Тест-драйвы | Минск | Коллаборации: alexey.cars@gmail.com', 42000, 2000, 680, true, false, true, '/blogger-default.svg', 'https://instagram.com/alexey_car_review', true, 'manual', 'verified', 20000),
    ('youtube', 'Alexey Car Review', 'Алексей Романов', 'Обзоры автомобилей, тест-драйвы, советы по выбору машины. Коллаборации: alexey.cars@gmail.com', 55000, 800, 110, true, false, true, '/blogger-default.svg', 'https://youtube.com/@alexeycar', true, 'manual', 'verified', 0),
    ('tiktok', 'alexey_car_review', 'Алексей Романов', '🚗 Car Reviews | Test Drives | Минск | Коллаборации в профиле', 38000, 600, 2100, true, false, true, '/blogger-default.svg', 'https://tiktok.com/@alexey_car_review', true, 'manual', 'verified', 0);

    INSERT INTO influencer_platform_stats (influencer_id, platform_id, username, profile_url, followers, engagement_rate, post_reach, story_reach, post_price, story_price) VALUES
    (alexey_id, instagram_id, 'alexey_car_review', 'https://instagram.com/alexey_car_review', 42000, 4.1, 35000, 23000, 220, 110),
    (alexey_id, youtube_id, 'Alexey Car Review', 'https://youtube.com/@alexeycar', 55000, 5.3, 47000, 31000, 300, 150),
    (alexey_id, tiktok_id, 'alexey_car_review', 'https://tiktok.com/@alexey_car_review', 38000, 6.9, 32000, 21000, 180, 90);

    INSERT INTO influencer_topics (influencer_id, topic_id) VALUES (alexey_id, cars_id);

    RAISE NOTICE '✅ Все 10 блогеров успешно добавлены в базу данных!';
    RAISE NOTICE '📊 Статистика: 10 блогеров, 28 профилей, 28 записей статистики';

END $$;

-- ===============================================
-- ПРОВЕРКА РЕЗУЛЬТАТОВ
-- ===============================================
SELECT 
    i.full_name,
    i.gender_type,
    i.barter_available,
    i.mart_registry,
    i.verification_status,
    COUNT(ips.id) as platforms_count,
    COUNT(ip.id) as profile_count
FROM influencers i
LEFT JOIN influencer_platform_stats ips ON i.id = ips.influencer_id
LEFT JOIN influencer_profiles ip ON i.id = ip.user_id
WHERE i.full_name IN (
    'Анна Петрова', 'Дмитрий Козлов', 'Елена Смирнова', 'Игорь Волков', 'Ольга Новикова',
    'Андрей Морозов', 'Мария Соколова', 'Сергей Лебедев', 'Наталья Ковалева', 'Алексей Романов'
)
GROUP BY i.id, i.full_name, i.gender_type, i.barter_available, i.mart_registry, i.verification_status
ORDER BY i.full_name;


