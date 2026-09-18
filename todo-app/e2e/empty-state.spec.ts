import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('shows an empty state message when there are no todos', async ({ page }) => {
  await expect(page.getByTestId('empty-state')).toHaveText('No todos yet — add one above!');
});

test('shows a different empty state message when filters exclude everything', async ({ page }) => {
  await page.getByTestId('todo-text-input').fill('Only todo');
  await page.getByTestId('add-todo-button').click();

  await page.getByTestId('search-input').fill('nonexistent');

  await expect(page.getByTestId('empty-state')).toHaveText('No todos match your filters.');
});
