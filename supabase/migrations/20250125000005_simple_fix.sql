-- Простое исправление данных блогеров
-- Удаляем все неправильные записи и создаем правильные

-- Удаляем все записи из influencer_topics
DELETE FROM public.influencer_topics;

-- Удаляем все записи из influencers
DELETE FROM public.influencers;

-- Создаем правильные записи в influencers
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
('11111111-1111-1111-1111-111111111111', 'Анна Петрова', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face', 'Бьюти-блогер с 5-летним опытом. Специализируюсь на макияже, уходе за кожей и модных трендах. Работаю с брендами косметики и одежды.', 'женщина', 'ИП', true, true, 'https://t.me/anna_petrova_beauty', 'одобрен', 'виден', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Дмитрий Козлов', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 'IT-эксперт и обозреватель гаджетов. Анализирую новинки технологий, тестирую смартфоны и ноутбуки. Помогаю выбрать лучшую технику.', 'мужчина', 'профдоход', false, false, 'https://t.me/dmitry_tech_review', 'одобрен', 'виден', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Елена Смирнова', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', 'Фитнес-тренер и нутрициолог. Помогаю достичь здоровых целей через правильное питание и тренировки. Сертифицированный специалист.', 'женщина', 'ИП', true, true, 'https://t.me/elena_fitness_coach', 'одобрен', 'виден', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'Игорь Волков', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', 'Путешественник и фотограф. Побывал в 50+ странах, делюсь лайфхаками для бюджетных поездок и красивыми местами.', 'мужчина', 'договор подряда', true, false, 'https://t.me/igor_travel_guide', 'одобрен', 'виден', NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'Ольга Новикова', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face', 'Шеф-повар и кулинарный блогер. Готовлю простые и вкусные блюда, делюсь рецептами и секретами кулинарии. Работаю с продуктовыми брендами.', 'женщина', 'ИП', true, true, 'https://t.me/olga_cooking_master', 'одобрен', 'виден', NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', 'Андрей Морозов', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', 'Профессиональный тренер по бодибилдингу. Помогаю набрать мышечную массу и сбросить лишний вес. 10 лет в спорте.', 'мужчина', 'ООО', false, false, 'https://t.me/andrey_bodybuilding', 'одобрен', 'виден', NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', 'Мария Соколова', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face', 'Мама троих детей и семейный психолог. Делюсь опытом воспитания, лайфхаками для родителей и семейными традициями.', 'женщина', 'ИП', true, true, 'https://t.me/maria_family_blog', 'одобрен', 'виден', NOW(), NOW()),
('88888888-8888-8888-8888-888888888888', 'Сергей Лебедев', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face', 'Предприниматель и бизнес-консультант. Помогаю запускать и развивать бизнес, делюсь опытом управления и инвестиций.', 'мужчина', 'ООО', false, false, 'https://t.me/sergey_business_guru', 'одобрен', 'виден', NOW(), NOW()),
('99999999-9999-9999-9999-999999999999', 'Наталья Ковалева', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face', 'Практикующий психолог и коуч. Помогаю решать личные проблемы, развивать эмоциональный интеллект и строить здоровые отношения.', 'женщина', 'ИП', true, true, 'https://t.me/natalia_psychologist', 'одобрен', 'виден', NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Алексей Романов', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 'Автомобильный эксперт и тест-драйвер. Обозреваю новые модели, тестирую технику и делюсь советами по выбору автомобиля.', 'мужчина', 'договор подряда', true, false, 'https://t.me/alexey_car_review', 'одобрен', 'виден', NOW(), NOW());

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

