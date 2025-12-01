import { lazy } from "react";

export const createPathFromFile = (filePath: string) => {
    let routePath = filePath.replace(/^\/src\/pages\//, '').replace(/\.tsx$/, '');
    const segments = routePath.split('/');

    // Специальная обработка для home/index -> /
    if (segments[0] === 'home' && segments[1]?.toLowerCase() === 'index') {
        segments.pop(); // удаляем 'index'
        segments.pop(); // удаляем 'home', чтобы получить корневой путь
    } else {
        // Для остальных случаев удаляем последний сегмент, если это не папка
        // (т.е. если это имя файла, а не index и не динамический параметр)
        const last = segments[segments.length - 1];
        // Удаляем последний сегмент если:
        // 1. Это 'index' (уже обработано выше для home)
        // 2. Или это имя файла (не начинается с '[' и не является зарезервированным словом)
        if (last.toLowerCase() === 'index') {
            segments.pop();
        } else if (segments.length > 0 && !last.startsWith('[')) {
            // Если последний сегмент не является динамическим параметром, это имя файла - удаляем
            segments.pop();
        }
    }

    const pathSegments = segments.map(seg => seg.replace(/\[(.+?)\]/g, ':$1'));

    const finalPath = '/' + pathSegments.join('/');
    return finalPath === '' ? '/' : finalPath;
};

export const createDynamicRoutes = (
    pageFiles: Record<string, () => Promise<any>>,
    allowedFolders: string[] = []
) => {
    return Object.keys(pageFiles)
        .filter((filePath) => {
            const relativePath = filePath.replace(/^\/src\/pages\//, '');
            return allowedFolders.some(folder => folder === '' || relativePath.startsWith(folder));
        })
        .map((filePath) => {
            const Component = lazy(() =>
                pageFiles[filePath]().then(mod => ({ default: mod.default }))
            );
            return {
                pathName: createPathFromFile(filePath),
                Component,
            };
        })
        .sort((a, b) => {
            // Статические маршруты (без :) должны идти раньше динамических (с :)
            const aIsDynamic = a.pathName.includes(':');
            const bIsDynamic = b.pathName.includes(':');
            if (aIsDynamic && !bIsDynamic) return 1;  // динамические после статических
            if (!aIsDynamic && bIsDynamic) return -1; // статические перед динамическими
            return 0; // сохранить порядок для одинаковых типов
        });
};

const pageFiles = import.meta.glob('/src/pages/**/*.tsx', { eager: false });

// Отладка: проверяем, что файл proads/index.tsx включен
if (import.meta.env.DEV) {
    const proadsFile = '/src/pages/proads/index.tsx';
    console.log('🔍 Проверка glob для proads/index.tsx...');
    console.log('Всего файлов в glob:', Object.keys(pageFiles).length);
    console.log('Файлы с "proads":', Object.keys(pageFiles).filter(k => k.includes('proads')));
    if (pageFiles[proadsFile]) {
        console.log('✅ Файл proads/index.tsx найден в glob');
    } else {
        console.warn('⚠️ Файл proads/index.tsx НЕ найден в glob');
        console.warn('Доступные ключи (первые 10):', Object.keys(pageFiles).slice(0, 10));
    }
}

export const publicRoutes = createDynamicRoutes(pageFiles, [
    '',
    'auth',
    'login',
    'register',
    'forgot-password',
    'email-confirmation',
    'privacy',
    'terms',
    'dev-tools',
    'proads',
    '[username]',
    'auth/v1/callback',
]);

export const privateRoutes = createDynamicRoutes(pageFiles, [
    'dashboard',
    'profile',
    'profile-setup'
]);

export const adminRoutes = createDynamicRoutes(pageFiles, [
    'admin',
]);
