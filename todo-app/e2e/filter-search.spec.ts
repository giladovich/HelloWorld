import { test, expect, type Page } from '@playwright/test';

async function addTodo(page: Page, text: string, category = '') {
  await page.getByTestId('todo-text-input').fill(text);
  if (category) {
    await page.getByTestId('todo-category-input').fill(category);
  }
  await page.getByTestId('add-todo-button').click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await addTodo(page, 'Buy milk', 'errands');
  await addTodo(page, 'Write report', 'work');
  await addTodo(page, 'Buy stamps', 'errands');
});

test('filters by status', async ({ page }) => {
  await page
    .getByTestId('todo-item')
    .filter({ hasText: 'Write report' })
    .getByTestId('todo-checkbox')
    .check();

  await page.getByTestId('filter-active').click();
  await expect(page.getByTestId('todo-item')).toHaveCount(2);

  await page.getByTestId('filter-completed').click();
  await expect(page.getByTestId('todo-item')).toHaveCount(1);

  await page.getByTestId('filter-all').click();
  await expect(page.getByTestId('todo-item')).toHaveCount(3);
});

test('filters by category', async ({ page }) => {
  await page.getByTestId('category-filter').selectOption('errands');
  await expect(page.getByTestId('todo-item')).toHaveCount(2);
});

test('filters by search text', async ({ page }) => {
  await page.getByTestId('search-input').fill('stamps');
  await expect(page.getByTestId('todo-item')).toHaveCount(1);
  await expect(page.getByTestId('todo-item').first().getByTestId('todo-text')).toHaveText(
    'Buy stamps'
  );
});
