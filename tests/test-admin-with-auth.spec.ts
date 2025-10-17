import { test, expect } from '@playwright/test';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './admin-credentials';

test('admin pages with authentication', async ({ page }) => {
  const consoleMessages: any[] = [];
  const consoleErrors: any[] = [];

  // Collect all console messages
  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    consoleMessages.push({ type, text });

    if (type === 'error') {
      consoleErrors.push(text);
    }
  });

  // console.log('\n=== Step 1: Navigating to admin login page ===');
  await page.goto('http://localhost:8080/admin/login', {
    waitUntil: 'networkidle',
    timeout: 60000,
  });

  await page.waitForTimeout(2000);

  // console.log('\n=== Step 2: Logging in as admin ===');
  // Fill in email
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  // console.log(`Email entered: ${ADMIN_EMAIL}`);

  // Fill in password
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  // console.log('Password entered');

  // Click login button
  await page.click('button[type="submit"]');
  // console.log('Login button clicked');

  // Wait for navigation after login
  await page.waitForTimeout(3000);

  // console.log(`Current URL after login: ${page.url()}`);

  // console.log('\n=== Step 3: Navigating to admin dashboard ===');
  await page.goto('http://localhost:8080/admin', {
    waitUntil: 'networkidle',
    timeout: 60000,
  });

  await page.waitForTimeout(2000);
  // console.log(`Admin dashboard URL: ${page.url()}`);

  // console.log('\n=== Step 4: Navigating to blogger edit page with username ===');
  await page.goto('http://localhost:8080/admin/blogger/elena_fitness_coach/edit', {
    waitUntil: 'networkidle',
    timeout: 60000,
  });

  await page.waitForTimeout(3000);

  const currentUrl = page.url();
  // console.log(`Blogger edit page URL: ${currentUrl}`);

  // Check that URL contains username, not UUID
  // console.log('\n=== Step 5: Verifying URL uses username ===');

  if (currentUrl.includes('elena_fitness_coach')) {
    // console.log('✅ URL correctly contains username: elena_fitness_coach');
  } else {
    // console.log('❌ URL does not contain username');
  }

  // Check for UUID pattern
  const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const hasUuid = uuidPattern.test(currentUrl);

  if (!hasUuid) {
    // console.log('✅ URL does NOT contain UUID - using username instead!');
  } else {
    // console.log('❌ URL still contains UUID');
    const match = currentUrl.match(uuidPattern);
    if (match) {
      // console.log(`Found UUID in URL: ${match[0]}`);
    }
  }

  // Print all console messages
  // console.log('\n=== All Console Messages ===');
  consoleMessages.forEach((msg) => {
    // console.log(`[${msg.type.toUpperCase()}] ${msg.text}`);
  });

  // Print errors if any
  if (consoleErrors.length > 0) {
    // console.log('\n=== Console Errors Found ===');
    consoleErrors.forEach((error) => {
      // console.log(`[ERROR] ${error}`);
    });
  } else {
    // console.log('\n=== No Console Errors Found ===');
  }

  // Assertions
  expect(currentUrl).toContain('elena_fitness_coach');
  expect(currentUrl).not.toMatch(uuidPattern);

  // The test passes if there are no critical errors
  const criticalErrors = consoleErrors.filter(
    (error) =>
      !error.includes('GoTrueClient') && !error.includes('DevTools') && !error.includes('404')
  );

  expect(criticalErrors.length).toBe(0);

  // console.log('\n=== Test Passed! ===');
});
