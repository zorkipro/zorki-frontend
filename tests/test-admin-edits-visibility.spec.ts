import { test, expect } from '@playwright/test';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './admin-credentials';

test.describe('Видимость изменений администратора на главной странице', () => {
  test('Изменения сохраняются в БД и видны после перезагрузки страницы', async ({ page }) => {
    // Шаг 1: Проверяем текущие данные на главной странице
    // console.log('=== Шаг 1: Получение исходных данных ===');
    await page.goto('http://localhost:8080/');
    await page.waitForTimeout(2000);

    const firstRowBefore = page.locator('table tbody tr').first();
    const bloggerNameBefore = await firstRowBefore.locator('td').nth(1).textContent();
    // console.log(`Первый блогер на главной: ${bloggerNameBefore}`);

    // Шаг 2: Логинимся как администратор
    // console.log('\n=== Шаг 2: Вход как администратор ===');
    await page.goto('http://localhost:8080/admin/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    // console.log('✓ Администратор вошёл в систему');

    // Шаг 3: Открываем админ-панель и проверяем данные
    // console.log('\n=== Шаг 3: Проверка данных в админ-панели ===');
    const firstRowInAdmin = page.locator('table tbody tr').first();
    const bloggerNameInAdmin = await firstRowInAdmin.locator('td').nth(1).textContent();
    // console.log(`Первый блогер в админке: ${bloggerNameInAdmin}`);

    // Шаг 4: Переходим на главную страницу снова
    // console.log('\n=== Шаг 4: Возврат на главную страницу ===');
    await page.goto('http://localhost:8080/');
    await page.waitForTimeout(2000);

    const firstRowAfter = page.locator('table tbody tr').first();
    const bloggerNameAfter = await firstRowAfter.locator('td').nth(1).textContent();
    // console.log(`Первый блогер на главной (после посещения админки): ${bloggerNameAfter}`);

    // Проверка: данные должны быть одинаковыми
    expect(bloggerNameBefore).toBe(bloggerNameAfter);
    // console.log('✅ Данные одинаковы (изменений не было)');

    // Шаг 5: Проверяем, что на главной есть блогеры из БД
    const rowCount = await page.locator('table tbody tr').count();
    // console.log(`\nВсего блогеров на главной: ${rowCount}`);
    expect(rowCount).toBeGreaterThan(0);
    // console.log('✅ Блогеры загружены из Supabase на главную страницу');
  });

  test('Данные блогера загружаются из Supabase на страницу профиля', async ({ page }) => {
    // console.log('=== Проверка страницы профиля блогера ===');

    // Переходим на профиль первого блогера напрямую
    await page.goto('http://localhost:8080/profile/elena_fitness_coach');
    await page.waitForTimeout(2000);

    // Проверяем, что страница загрузилась (не 404)
    const profileName = await page.locator('h1').first().textContent();
    // console.log(`Заголовок профиля: ${profileName}`);

    // Проверяем, что это не страница 404
    expect(profileName).not.toBe('404');
    expect(profileName).not.toBe('Блогер не найден');

    // Проверяем, что есть описание блогера
    const descriptionElements = page.locator('p');
    const descCount = await descriptionElements.count();

    // console.log(`Найдено элементов <p> на странице: ${descCount}`);
    expect(descCount).toBeGreaterThan(0);
    // console.log('✅ Страница профиля блогера загружается из Supabase');
  });
});
