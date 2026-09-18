import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('adds a todo and shows it in the list', async ({ page }) => {
  await page.getByTestId('todo-text-input').fill('Buy milk');
  await page.getByTestId('todo-category-input').fill('errands');
  await page.getByTestId('todo-priority-select').selectOption('high');
  await page.getByTestId('add-todo-button').click();

  const item = page.getByTestId('todo-item').first();
  await expect(item.getByTestId('todo-text')).toHaveText('Buy milk');
  await expect(item.getByTestId('todo-category')).toContainText('errands');
  await expect(item.getByTestId('todo-priority')).toContainText('high');
});

test('persists the todo after a reload', async ({ page }) => {
  await page.getByTestId('todo-text-input').fill('Walk the dog');
  await page.getByTestId('add-todo-button').click();

  await page.reload();

  await expect(
    page.getByTestId('todo-item').filter({ hasText: 'Walk the dog' })
  ).toBeVisible();
});
