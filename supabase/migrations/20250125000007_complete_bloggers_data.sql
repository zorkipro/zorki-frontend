-- Полное восстановление блогеров с множественными платформами
-- Основано на bloggers_data.json

-- Удаляем все существующие данные
DELETE FROM public.influencer_platform_stats;
DELETE FROM public.influencer_topics;
DELETE FROM public.influencer_profiles;
DELETE FROM public.influencers;

-- Создаем блогеров
INSERT INTO public.influencers (
    id, 
    full_name, 
    avatar_url, 
    description, 
    gender_type, 
    work_format, 
    barter_available, 
    mart_registry, 
    contact_link, 
    verification_status, 
    visibility_status, 
    created_at, 
    updated_at
) VALUES 
-- Анна Петрова
('11111111-1111-1111-1111-111111111111', 'Анна Петрова', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face', 'Бьюти-блогер с 5-летним опытом. Специализируюсь на макияже, уходе за кожей и модных трендах. Работаю с брендами косметики и одежды.', 'женщина', 'ИП', true, true, 'https://t.me/anna_petrova_beauty', 'одобрен', 'виден', NOW(), NOW()),

-- Дмитрий Козлов  
('22222222-2222-2222-2222-222222222222', 'Дмитрий Козлов', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 'IT-эксперт и обозреватель гаджетов. Анализирую новинки технологий, тестирую смартфоны и ноутбуки. Помогаю выбрать лучшую технику.', 'мужчина', 'профдоход', false, false, 'https://t.me/dmitry_tech_review', 'одобрен', 'виден', NOW(), NOW()),

-- Елена Смирнова
('33333333-3333-3333-3333-333333333333', 'Елена Смирнова', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', 'Фитнес-тренер и нутрициолог. Помогаю достичь здоровых целей через правильное питание и тренировки. Сертифицированный специалист.', 'женщина', 'ИП', true, true, 'https://t.me/elena_fitness_coach', 'одобрен', 'виден', NOW(), NOW()),

-- Игорь Волков
('44444444-4444-4444-4444-444444444444', 'Игорь Волков', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', 'Путешественник и фотограф. Побывал в 50+ странах, делюсь лайфхаками для бюджетных поездок и красивыми местами.', 'мужчина', 'договор подряда', true, false, 'https://t.me/igor_travel_guide', 'одобрен', 'виден', NOW(), NOW()),

-- Ольга Новикова
('55555555-5555-5555-5555-555555555555', 'Ольга Новикова', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face', 'Шеф-повар и кулинарный блогер. Готовлю простые и вкусные блюда, делюсь рецептами и секретами кулинарии. Работаю с продуктовыми брендами.', 'женщина', 'ИП', true, true, 'https://t.me/olga_cooking_master', 'одобрен', 'виден', NOW(), NOW()),

-- Андрей Морозов
('66666666-6666-6666-6666-666666666666', 'Андрей Морозов', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', 'Профессиональный тренер по бодибилдингу. Помогаю набрать мышечную массу и сбросить лишний вес. 10 лет в спорте.', 'мужчина', 'ООО', false, false, 'https://t.me/andrey_bodybuilding', 'одобрен', 'виден', NOW(), NOW()),

-- Мария Соколова
('77777777-7777-7777-7777-777777777777', 'Мария Соколова', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face', 'Мама троих детей и семейный психолог. Делюсь опытом воспитания, лайфхаками для родителей и семейными традициями.', 'женщина', 'ИП', true, true, 'https://t.me/maria_family_blog', 'одобрен', 'виден', NOW(), NOW()),

-- Сергей Лебедев
('88888888-8888-8888-8888-888888888888', 'Сергей Лебедев', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face', 'Предприниматель и бизнес-консультант. Помогаю запускать и развивать бизнес, делюсь опытом управления и инвестиций.', 'мужчина', 'ООО', false, false, 'https://t.me/sergey_business_guru', 'одобрен', 'виден', NOW(), NOW()),

-- Наталья Ковалева
('99999999-9999-9999-9999-999999999999', 'Наталья Ковалева', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face', 'Практикующий психолог и коуч. Помогаю решать личные проблемы, развивать эмоциональный интеллект и строить здоровые отношения.', 'женщина', 'ИП', true, true, 'https://t.me/natalia_psychologist', 'одобрен', 'виден', NOW(), NOW()),

-- Алексей Романов
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Алексей Романов', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 'Автомобильный эксперт и тест-драйвер. Обозреваю новые модели, тестирую технику и делюсь советами по выбору автомобиля.', 'мужчина', 'договор подряда', true, false, 'https://t.me/alexey_car_review', 'одобрен', 'виден', NOW(), NOW());

-- Примечание: influencer_profiles создаются автоматически при регистрации пользователей
-- Здесь мы не создаем записи в influencer_profiles, так как user_id должен ссылаться на auth.users

-- Добавляем полную статистику платформ для всех блогеров
-- Анна Петрова - Instagram
INSERT INTO public.influencer_platform_stats (
    influencer_id, platform_id, username, followers, engagement_rate, post_reach, story_reach, post_price, story_price, profile_url
) VALUES 
('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'anna_petrova_beauty', 45000, 4.2, 38000, 25000, 150, 80, 'https://instagram.com/anna_petrova_beauty'),

-- Анна Петрова - TikTok
('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.platforms WHERE title = 'tiktok' LIMIT 1), 'anna_petrova_beauty', 32000, 6.8, 28000, 18000, 120, 60, 'https://tiktok.com/@anna_petrova_beauty'),

-- Анна Петрова - YouTube
('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.platforms WHERE title = 'youtube' LIMIT 1), 'Anna Petrova Beauty', 15000, 3.5, 12000, 8000, 200, 100, 'https://youtube.com/@annapetrova'),

-- Анна Петрова - Telegram
('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.platforms WHERE title = 'telegram' LIMIT 1), 'anna_petrova_beauty', 8500, 2.1, 7000, 4500, 50, 25, 'https://t.me/anna_petrova_beauty'),

-- Дмитрий Козлов - Instagram
('22222222-2222-2222-2222-222222222222', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'dmitry_tech_review', 28000, 3.8, 22000, 15000, 120, 60, 'https://instagram.com/dmitry_tech_review'),

-- Дмитрий Козлов - TikTok
('22222222-2222-2222-2222-222222222222', (SELECT id FROM public.platforms WHERE title = 'tiktok' LIMIT 1), 'dmitry_tech_review', 45000, 5.2, 38000, 25000, 180, 90, 'https://tiktok.com/@dmitry_tech_review'),

-- Дмитрий Козлов - YouTube
('22222222-2222-2222-2222-222222222222', (SELECT id FROM public.platforms WHERE title = 'youtube' LIMIT 1), 'Dmitry Tech Review', 22000, 4.1, 18000, 12000, 250, 125, 'https://youtube.com/@dmitrytech'),

-- Дмитрий Козлов - Telegram
('22222222-2222-2222-2222-222222222222', (SELECT id FROM public.platforms WHERE title = 'telegram' LIMIT 1), 'dmitry_tech_review', 12000, 1.8, 10000, 6500, 80, 40, 'https://t.me/dmitry_tech_review'),

-- Елена Смирнова - Instagram
('33333333-3333-3333-3333-333333333333', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'elena_fitness_coach', 52000, 4.5, 45000, 30000, 180, 90, 'https://instagram.com/elena_fitness_coach'),

-- Елена Смирнова - TikTok
('33333333-3333-3333-3333-333333333333', (SELECT id FROM public.platforms WHERE title = 'tiktok' LIMIT 1), 'elena_fitness_coach', 38000, 7.2, 32000, 21000, 150, 75, 'https://tiktok.com/@elena_fitness_coach'),

-- Елена Смирнова - YouTube
('33333333-3333-3333-3333-333333333333', (SELECT id FROM public.platforms WHERE title = 'youtube' LIMIT 1), 'Elena Fitness Coach', 18000, 3.8, 15000, 10000, 220, 110, 'https://youtube.com/@elenafitness'),

-- Елена Смирнова - Telegram
('33333333-3333-3333-3333-333333333333', (SELECT id FROM public.platforms WHERE title = 'telegram' LIMIT 1), 'elena_fitness_coach', 9500, 2.3, 8000, 5200, 60, 30, 'https://t.me/elena_fitness_coach'),

-- Игорь Волков - Instagram
('44444444-4444-4444-4444-444444444444', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'igor_travel_guide', 35000, 4.0, 30000, 20000, 130, 70, 'https://instagram.com/igor_travel_guide'),

-- Игорь Волков - TikTok
('44444444-4444-4444-4444-444444444444', (SELECT id FROM public.platforms WHERE title = 'tiktok' LIMIT 1), 'igor_travel_guide', 28000, 6.5, 24000, 16000, 110, 55, 'https://tiktok.com/@igor_travel_guide'),

-- Игорь Волков - YouTube
('44444444-4444-4444-4444-444444444444', (SELECT id FROM public.platforms WHERE title = 'youtube' LIMIT 1), 'Igor Travel Guide', 12000, 3.2, 10000, 7000, 180, 90, 'https://youtube.com/@igortravel'),

-- Игорь Волков - Telegram
('44444444-4444-4444-4444-444444444444', (SELECT id FROM public.platforms WHERE title = 'telegram' LIMIT 1), 'igor_travel_guide', 6800, 1.9, 5800, 3800, 45, 22, 'https://t.me/igor_travel_guide'),

-- Ольга Новикова - Instagram
('55555555-5555-5555-5555-555555555555', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'olga_cooking_master', 41000, 4.3, 35000, 23000, 160, 85, 'https://instagram.com/olga_cooking_master'),

-- Ольга Новикова - TikTok
('55555555-5555-5555-5555-555555555555', (SELECT id FROM public.platforms WHERE title = 'tiktok' LIMIT 1), 'olga_cooking_master', 35000, 7.8, 30000, 20000, 140, 70, 'https://tiktok.com/@olga_cooking_master'),

-- Ольга Новикова - YouTube
('55555555-5555-5555-5555-555555555555', (SELECT id FROM public.platforms WHERE title = 'youtube' LIMIT 1), 'Olga Cooking Master', 16000, 3.6, 13000, 9000, 200, 100, 'https://youtube.com/@olgacooking'),

-- Ольга Новикова - Telegram
('55555555-5555-5555-5555-555555555555', (SELECT id FROM public.platforms WHERE title = 'telegram' LIMIT 1), 'olga_cooking_master', 7800, 2.0, 6500, 4300, 50, 25, 'https://t.me/olga_cooking_master'),

-- Андрей Морозов - Instagram
('66666666-6666-6666-6666-666666666666', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'andrey_bodybuilding', 38000, 3.9, 32000, 21000, 140, 75, 'https://instagram.com/andrey_bodybuilding'),

-- Андрей Морозов - TikTok
('66666666-6666-6666-6666-666666666666', (SELECT id FROM public.platforms WHERE title = 'tiktok' LIMIT 1), 'andrey_bodybuilding', 42000, 6.2, 36000, 24000, 160, 80, 'https://tiktok.com/@andrey_bodybuilding'),

-- Андрей Морозов - YouTube
('66666666-6666-6666-6666-666666666666', (SELECT id FROM public.platforms WHERE title = 'youtube' LIMIT 1), 'Andrey Bodybuilding', 19000, 4.3, 16000, 11000, 240, 120, 'https://youtube.com/@andreybodybuilding'),

-- Андрей Морозов - Telegram
('66666666-6666-6666-6666-666666666666', (SELECT id FROM public.platforms WHERE title = 'telegram' LIMIT 1), 'andrey_bodybuilding', 9200, 2.2, 7800, 5200, 65, 32, 'https://t.me/andrey_bodybuilding'),

-- Мария Соколова - Instagram
('77777777-7777-7777-7777-777777777777', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'maria_family_blog', 29000, 4.1, 25000, 17000, 110, 55, 'https://instagram.com/maria_family_blog'),

-- Мария Соколова - TikTok
('77777777-7777-7777-7777-777777777777', (SELECT id FROM public.platforms WHERE title = 'tiktok' LIMIT 1), 'maria_family_blog', 25000, 5.8, 21000, 14000, 100, 50, 'https://tiktok.com/@maria_family_blog'),

-- Мария Соколова - YouTube
('77777777-7777-7777-7777-777777777777', (SELECT id FROM public.platforms WHERE title = 'youtube' LIMIT 1), 'Maria Family Blog', 14000, 3.4, 12000, 8000, 180, 90, 'https://youtube.com/@mariafamily'),

-- Мария Соколова - Telegram
('77777777-7777-7777-7777-777777777777', (SELECT id FROM public.platforms WHERE title = 'telegram' LIMIT 1), 'maria_family_blog', 6800, 1.7, 5800, 3800, 40, 20, 'https://t.me/maria_family_blog'),

-- Сергей Лебедев - Instagram
('88888888-8888-8888-8888-888888888888', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'sergey_business_guru', 33000, 3.7, 28000, 19000, 125, 65, 'https://instagram.com/sergey_business_guru'),

-- Сергей Лебедев - TikTok
('88888888-8888-8888-8888-888888888888', (SELECT id FROM public.platforms WHERE title = 'tiktok' LIMIT 1), 'sergey_business_guru', 22000, 4.9, 18000, 12000, 90, 45, 'https://tiktok.com/@sergey_business_guru'),

-- Сергей Лебедев - YouTube
('88888888-8888-8888-8888-888888888888', (SELECT id FROM public.platforms WHERE title = 'youtube' LIMIT 1), 'Sergey Business Guru', 25000, 4.5, 21000, 14000, 300, 150, 'https://youtube.com/@sergeybusiness'),

-- Сергей Лебедев - Telegram
('88888888-8888-8888-8888-888888888888', (SELECT id FROM public.platforms WHERE title = 'telegram' LIMIT 1), 'sergey_business_guru', 15000, 2.8, 13000, 8500, 100, 50, 'https://t.me/sergey_business_guru'),

-- Наталья Ковалева - Instagram
('99999999-9999-9999-9999-999999999999', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'natalia_psychologist', 26000, 4.4, 22000, 15000, 100, 50, 'https://instagram.com/natalia_psychologist'),

-- Наталья Ковалева - TikTok
('99999999-9999-9999-9999-999999999999', (SELECT id FROM public.platforms WHERE title = 'tiktok' LIMIT 1), 'natalia_psychologist', 18000, 6.1, 15000, 10000, 80, 40, 'https://tiktok.com/@natalia_psychologist'),

-- Наталья Ковалева - YouTube
('99999999-9999-9999-9999-999999999999', (SELECT id FROM public.platforms WHERE title = 'youtube' LIMIT 1), 'Natalia Psychologist', 12000, 3.7, 10000, 7000, 160, 80, 'https://youtube.com/@nataliapsychologist'),

-- Наталья Ковалева - Telegram
('99999999-9999-9999-9999-999999999999', (SELECT id FROM public.platforms WHERE title = 'telegram' LIMIT 1), 'natalia_psychologist', 5500, 1.6, 4700, 3100, 35, 17, 'https://t.me/natalia_psychologist'),

-- Алексей Романов - Instagram
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'alexey_car_review', 31000, 3.6, 26000, 18000, 115, 60, 'https://instagram.com/alexey_car_review'),

-- Алексей Романов - TikTok
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.platforms WHERE title = 'tiktok' LIMIT 1), 'alexey_car_review', 35000, 5.4, 30000, 20000, 130, 65, 'https://tiktok.com/@alexey_car_review'),

-- Алексей Романов - YouTube
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.platforms WHERE title = 'youtube' LIMIT 1), 'Alexey Car Review', 28000, 4.8, 24000, 16000, 280, 140, 'https://youtube.com/@alexeycarreview'),

-- Алексей Романов - Telegram
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.platforms WHERE title = 'telegram' LIMIT 1), 'alexey_car_review', 12000, 2.5, 10000, 6700, 85, 42, 'https://t.me/alexey_car_review');

-- Добавляем темы для блогеров
INSERT INTO public.influencer_topics (influencer_id, topic_id) VALUES 
('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.topics WHERE title = 'Красота и мода' LIMIT 1)),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM public.topics WHERE title = 'Технологии' LIMIT 1)),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM public.topics WHERE title = 'Здоровье и фитнес' LIMIT 1)),
('44444444-4444-4444-4444-444444444444', (SELECT id FROM public.topics WHERE title = 'Путешествия' LIMIT 1)),
('55555555-5555-5555-5555-555555555555', (SELECT id FROM public.topics WHERE title = 'Еда и рецепты' LIMIT 1)),
('66666666-6666-6666-6666-666666666666', (SELECT id FROM public.topics WHERE title = 'Спорт' LIMIT 1)),
('77777777-7777-7777-7777-777777777777', (SELECT id FROM public.topics WHERE title = 'Дети и семья' LIMIT 1)),
('88888888-8888-8888-8888-888888888888', (SELECT id FROM public.topics WHERE title = 'Бизнес' LIMIT 1)),
('99999999-9999-9999-9999-999999999999', (SELECT id FROM public.topics WHERE title = 'Психология' LIMIT 1)),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.topics WHERE title = 'Автомобили' LIMIT 1));
