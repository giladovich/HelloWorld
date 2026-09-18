import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  for (const text of ['First', 'Second', 'Third']) {
    await page.getByTestId('todo-text-input').fill(text);
    await page.getByTestId('add-todo-button').click();
  }
});

test('reorders todos via drag and drop, and it persists', async ({ page }) => {
  await expect(page.getByTestId('todo-text')).toHaveText(['First', 'Second', 'Third']);

  const source = page.locator('[data-todo-id]').filter({ hasText: 'First' });
  const target = page.locator('[data-todo-id]').filter({ hasText: 'Third' });
  await source.dragTo(target);

  await expect(page.getByTestId('todo-text')).toHaveText(['Second', 'Third', 'First']);

  await page.reload();
  await expect(page.getByTestId('todo-text')).toHaveText(['Second', 'Third', 'First']);
});
