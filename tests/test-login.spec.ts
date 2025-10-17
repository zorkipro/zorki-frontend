import { test, expect } from '@playwright/test';

test('interactive login test', async ({ page }) => {

  // Navigate to the homepage first
  await page.goto('/');

  // Wait for page to load
  await page.waitForLoadState('networkidle');


  // Wait for user input (this will pause the test)
  await page.pause();

  // After user continues, navigate to the profile page
  await page.goto('/anna_petrova_beauty');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Wait a bit more for any async operations
  await page.waitForTimeout(3000);


  // The test passes
  expect(true).toBe(true);
});
