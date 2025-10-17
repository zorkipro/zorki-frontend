import { test, expect } from '@playwright/test';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './admin-credentials';

test.describe('Проверка работы с Supabase БД', () => {
  test('Админ-панель загружает данные из Supabase', async ({ page }) => {
    // Переходим на страницу входа администратора
    await page.goto('http://localhost:8080/admin/login');

    // Вводим учётные данные
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);

    // Нажимаем кнопку входа
    await page.click('button[type="submit"]');

    // Ждём перехода на дашборд админа
    await page.waitForURL('**/admin', { timeout: 10000 });

    // Проверяем, что страница загрузилась
    await expect(page.locator('h1')).toContainText('Админ панель');

    // Ждём загрузки данных (должна исчезнуть надпись "Загрузка...")
    await page.waitForTimeout(2000);

    // Проверяем, что таблица с блогерами загрузилась (не пустая)
    const tableRows = page.locator('table tbody tr');
    const rowCount = await tableRows.count();


    // Должно быть больше 0 блогеров
    expect(rowCount).toBeGreaterThan(0);

    // Проверяем, что есть реальные данные (имя блогера)
    const firstBloggerName = await tableRows.first().locator('td').nth(1).textContent();

    // Имя не должно быть пустым
    expect(firstBloggerName).toBeTruthy();
    expect(firstBloggerName?.length).toBeGreaterThan(0);

    // Проверяем, что есть цифры подписчиков (не моковые)
    const followersText = await tableRows.first().locator('td').nth(2).textContent();

    // Должны быть циферки
    expect(followersText).toMatch(/[0-9KM]/);
  });

  test('Страница редактирования блогера загружает данные из Supabase', async ({ page }) => {
    // Переходим на страницу входа администратора
    await page.goto('http://localhost:8080/admin/login');

    // Вводим учётные данные
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);

    // Нажимаем кнопку входа
    await page.click('button[type="submit"]');

    // Ждём перехода на дашборд админа
    await page.waitForURL('**/admin', { timeout: 10000 });

    // Нажимаем на первую кнопку "Редактировать"
    await page.locator('button:has-text("Редактировать")').first().click();

    // Ждём перехода на страницу редактирования
    await page.waitForURL('**/admin/blogger/*/edit', { timeout: 10000 });

    // Проверяем, что URL содержит username, а не UUID
    const url = page.url();

    // URL должен содержать username (буквы и подчёркивания), а не UUID (только цифры и дефисы)
    expect(url).toMatch(/\/admin\/blogger\/[a-z_]+\/edit/);
    expect(url).not.toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);

    // Ждём загрузки данных профиля
    await page.waitForTimeout(2000);

    // Проверяем, что есть заголовок с именем блогера
    const profileHeader = page.locator('h1').first();
    const headerText = await profileHeader.textContent();


    // Заголовок не должен быть пустым
    expect(headerText).toBeTruthy();
    expect(headerText!.length).toBeGreaterThan(0);

    // Проверяем, что есть вкладки платформ
    const instagramTab = page.locator('button:has-text("Instagram")');
    await expect(instagramTab).toBeVisible();
  });
});
