import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByTestId('todo-text-input').fill('Read a book');
  await page.getByTestId('add-todo-button').click();
});

test('toggles a todo complete', async ({ page }) => {
  const item = page.getByTestId('todo-item').filter({ hasText: 'Read a book' });
  await item.getByTestId('todo-checkbox').check();
  await expect(item.getByTestId('todo-checkbox')).toBeChecked();
});

test('deletes a todo and can undo it', async ({ page }) => {
  const item = page.getByTestId('todo-item').filter({ hasText: 'Read a book' });
  await item.getByTestId('todo-delete-button').click();

  await expect(page.getByTestId('todo-item')).toHaveCount(0);
  await expect(page.getByTestId('undo-toast')).toBeVisible();

  await page.getByTestId('undo-button').click();

  await expect(
    page.getByTestId('todo-item').filter({ hasText: 'Read a book' })
  ).toBeVisible();
  await expect(page.getByTestId('undo-toast')).not.toBeVisible();
});
