-- Добавление статистики платформ для блогеров
-- Эта миграция добавляет данные в influencer_platform_stats

-- Добавляем статистику для Instagram для всех блогеров
INSERT INTO public.influencer_platform_stats (
    influencer_id,
    platform_id,
    username,
    followers,
    engagement_rate,
    post_reach,
    story_reach,
    post_price,
    story_price,
    profile_url
) VALUES 
-- Анна Петрова - Instagram
('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'anna_petrova_beauty', 45000, 4.2, 38000, 25000, 150, 80, 'https://instagram.com/anna_petrova_beauty'),

-- Дмитрий Козлов - Instagram  
('22222222-2222-2222-2222-222222222222', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'dmitry_tech_review', 28000, 3.8, 22000, 15000, 120, 60, 'https://instagram.com/dmitry_tech_review'),

-- Елена Смирнова - Instagram
('33333333-3333-3333-3333-333333333333', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'elena_fitness_coach', 52000, 4.5, 45000, 30000, 180, 90, 'https://instagram.com/elena_fitness_coach'),

-- Игорь Волков - Instagram
('44444444-4444-4444-4444-444444444444', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'igor_travel_guide', 35000, 4.0, 30000, 20000, 130, 70, 'https://instagram.com/igor_travel_guide'),

-- Ольга Новикова - Instagram
('55555555-5555-5555-5555-555555555555', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'olga_cooking_master', 41000, 4.3, 35000, 23000, 160, 85, 'https://instagram.com/olga_cooking_master'),

-- Андрей Морозов - Instagram
('66666666-6666-6666-6666-666666666666', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'andrey_bodybuilding', 38000, 3.9, 32000, 21000, 140, 75, 'https://instagram.com/andrey_bodybuilding'),

-- Мария Соколова - Instagram
('77777777-7777-7777-7777-777777777777', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'maria_family_blog', 29000, 4.1, 25000, 17000, 110, 55, 'https://instagram.com/maria_family_blog'),

-- Сергей Лебедев - Instagram
('88888888-8888-8888-8888-888888888888', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'sergey_business_guru', 33000, 3.7, 28000, 19000, 125, 65, 'https://instagram.com/sergey_business_guru'),

-- Наталья Ковалева - Instagram
('99999999-9999-9999-9999-999999999999', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'natalia_psychologist', 26000, 4.4, 22000, 15000, 100, 50, 'https://instagram.com/natalia_psychologist'),

-- Алексей Романов - Instagram
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.platforms WHERE title = 'instagram' LIMIT 1), 'alexey_car_review', 31000, 3.6, 26000, 18000, 115, 60, 'https://instagram.com/alexey_car_review');

