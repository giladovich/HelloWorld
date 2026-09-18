import { test, expect } from '@playwright/test';

test('shows a banner when localStorage is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('blocked');
      },
    });
  });
  await page.goto('/');

  await expect(page.getByTestId('storage-error-banner')).toBeVisible();
});
