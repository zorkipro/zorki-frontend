-- Исправление битых аватарок блогеров
-- Заменяем недоступные URL на локальные изображения

UPDATE public.influencers 
SET avatar_url = 'https://example.com/blogger-anna.jpg'
WHERE id = '11111111-1111-1111-1111-111111111111' AND full_name = 'Анна Петрова';

UPDATE public.influencers 
SET avatar_url = 'https://example.com/blogger-dmitry.jpg'
WHERE id = '22222222-2222-2222-2222-222222222222' AND full_name = 'Дмитрий Козлов';

UPDATE public.influencers 
SET avatar_url = 'https://example.com/blogger-elena.jpg'
WHERE id = '33333333-3333-3333-3333-333333333333' AND full_name = 'Елена Смирнова';

UPDATE public.influencers 
SET avatar_url = 'https://example.com/blogger-igor.jpg'
WHERE id = '44444444-4444-4444-4444-444444444444' AND full_name = 'Игорь Волков';

UPDATE public.influencers 
SET avatar_url = 'https://example.com/blogger-olga.jpg'
WHERE id = '55555555-5555-5555-5555-555555555555' AND full_name = 'Ольга Новикова';

UPDATE public.influencers 
SET avatar_url = 'https://example.com/blogger-andrey.jpg'
WHERE id = '66666666-6666-6666-6666-666666666666' AND full_name = 'Андрей Морозов';

UPDATE public.influencers 
SET avatar_url = 'https://example.com/blogger-default.svg'
WHERE id = '77777777-7777-7777-7777-777777777777' AND full_name = 'Мария Соколова';

UPDATE public.influencers 
SET avatar_url = 'https://example.com/blogger-default.svg'
WHERE id = '88888888-8888-8888-8888-888888888888' AND full_name = 'Сергей Лебедев';

UPDATE public.influencers 
SET avatar_url = 'https://example.com/blogger-default.svg'
WHERE id = '99999999-9999-9999-9999-999999999999' AND full_name = 'Наталья Ковалева';

UPDATE public.influencers 
SET avatar_url = 'https://example.com/blogger-default.svg'
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' AND full_name = 'Алексей Романов';
