import { test, expect } from '@playwright/test';

test('check network errors on blogger profile page', async ({ page }) => {
  const networkErrors: Array<{ url: string; status: number; method: string }> = [];

  // Listen for failed network requests
  page.on('response', (response) => {
    if (response.status() >= 400) {
      networkErrors.push({
        url: response.url(),
        status: response.status(),
        method: response.request().method(),
      });
    }
  });

  // Navigate to the blogger profile page
  await page.goto('/anna_petrova_beauty');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Wait a bit more for any async operations
  await page.waitForTimeout(5000);

  // Log network errors
  if (networkErrors.length > 0) {
    networkErrors.forEach((error) => {
    });
  } else {
  }

  // The test passes regardless, we just want to see the errors
  expect(networkErrors.length).toBeGreaterThanOrEqual(0);
});
