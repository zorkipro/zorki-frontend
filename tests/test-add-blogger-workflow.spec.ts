import { test, expect } from '@playwright/test';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './admin-credentials';

test.describe('Workflow добавления блогера через Instagram username', () => {
  test('Открытие диалога добавления блогера', async ({ page }) => {
    // Логин
    await page.goto('http://localhost:8080/admin/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });

    // Открываем диалог добавления
    await page.click('button:has-text("Добавить блогера")');

    // Проверяем, что диалог открылся
    await expect(page.locator('dialog, [role="dialog"]')).toBeVisible();

    // Проверяем заголовок
    await expect(page.locator('text=Добавить нового блогера')).toBeVisible();

    // Проверяем наличие поля для username
    const usernameInput = page.locator('input#instagram_username');
    await expect(usernameInput).toBeVisible();

    // Проверяем placeholder
    await expect(usernameInput).toHaveAttribute('placeholder', /elena_fitness_coach/i);

    // console.log('✅ Диалог добавления открылся корректно');
  });

  test('Проверка валидации пустого username', async ({ page }) => {
    // Логин
    await page.goto('http://localhost:8080/admin/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });

    // Открываем диалог
    await page.click('button:has-text("Добавить блогера")');

    // Проверяем, что кнопка "Продолжить" отключена без ввода username
    const continueButton = page.locator('button:has-text("Продолжить")');
    await expect(continueButton).toBeDisabled();

    // console.log('✅ Кнопка отключена при пустом поле');

    // Вводим username
    await page.fill('input#instagram_username', 'test_user');

    // Кнопка должна стать активной
    await expect(continueButton).toBeEnabled();

    // console.log('✅ Кнопка активируется при вводе username');
  });

  test('Добавление существующего блогера - редирект на редактирование', async ({ page }) => {
    // Логин
    await page.goto('http://localhost:8080/admin/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });

    // Открываем диалог
    await page.click('button:has-text("Добавить блогера")');

    // Вводим существующий username
    await page.fill('input#instagram_username', 'elena_fitness_coach');

    // Нажимаем "Продолжить"
    await page.click('button:has-text("Продолжить")');

    // Ждём уведомления о том, что блогер существует
    await page.waitForSelector('text=/Блогер найден/i', { timeout: 5000 });

    // console.log('✅ Получено уведомление о существующем блогере');

    // Должен произойти редирект на страницу редактирования
    await page.waitForURL('**/admin/blogger/elena_fitness_coach/edit', { timeout: 10000 });

    // console.log('✅ Редирект на страницу редактирования выполнен');

    // Проверяем, что страница загрузилась
    const url = page.url();
    expect(url).toContain('/admin/blogger/elena_fitness_coach/edit');
  });

  test('Добавление нового блогера - workflow с загрузкой', async ({ page }) => {
    // Логин
    await page.goto('http://localhost:8080/admin/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });

    // Открываем диалог
    await page.click('button:has-text("Добавить блогера")');

    // Генерируем уникальный username для теста
    const uniqueUsername = `test_blogger_${Date.now()}`;
    // console.log(`Тестовый username: ${uniqueUsername}`);

    // Вводим новый username
    await page.fill('input#instagram_username', uniqueUsername);

    // Нажимаем "Продолжить"
    await page.click('button:has-text("Продолжить")');

    // Должен появиться экран загрузки
    await expect(page.locator('text=/Проверка блогера/i')).toBeVisible({ timeout: 2000 });
    // console.log('✅ Экран загрузки появился');

    // Должен появиться спиннер
    const spinner = page.locator('.animate-spin');
    await expect(spinner).toBeVisible();
    // console.log('✅ Спиннер отображается');

    // Проверяем статусы загрузки
    await expect(page.locator('text=/Получение данных из Instagram/i')).toBeVisible({
      timeout: 3000,
    });
    // console.log('✅ Статус "Получение данных" отображается');

    // Ждём создания профиля
    await expect(page.locator('text=/Создание профиля/i')).toBeVisible({ timeout: 3000 });
    // console.log('✅ Статус "Создание профиля" отображается');

    // Должен произойти редирект на страницу редактирования
    await page.waitForURL(`**/admin/blogger/${uniqueUsername}/edit`, { timeout: 10000 });
    // console.log('✅ Редирект на страницу редактирования нового блогера выполнен');

    // Проверяем URL
    const url = page.url();
    expect(url).toContain(`/admin/blogger/${uniqueUsername}/edit`);

    // Проверяем, что страница загрузилась
    await page.waitForTimeout(2000);

    // Проверяем наличие формы редактирования
    const profileHeader = page.locator('h1').first();
    await expect(profileHeader).toBeVisible();

    // console.log('✅ Полный workflow добавления нового блогера работает корректно');
  });

  test('Закрытие диалога по кнопке "Отмена"', async ({ page }) => {
    // Логин
    await page.goto('http://localhost:8080/admin/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });

    // Открываем диалог
    await page.click('button:has-text("Добавить блогера")');

    // Вводим текст
    await page.fill('input#instagram_username', 'test_user');

    // Нажимаем "Отмена"
    await page.click('button:has-text("Отмена")');

    // Диалог должен закрыться
    await expect(page.locator('text=Добавить нового блогера')).not.toBeVisible();

    // console.log('✅ Диалог закрылся по кнопке "Отмена"');
  });
});
