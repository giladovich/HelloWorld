import { test, expect, type Page } from '@playwright/test';

async function addTodo(
  page: Page,
  text: string,
  opts: { category?: string; priority?: 'low' | 'medium' | 'high'; dueDate?: string } = {}
) {
  await page.getByTestId('todo-text-input').fill(text);
  if (opts.category) {
    await page.getByTestId('todo-category-input').fill(opts.category);
  }
  if (opts.priority) {
    await page.getByTestId('todo-priority-select').selectOption(opts.priority);
  }
  if (opts.dueDate) {
    await page.getByTestId('todo-due-date-input').fill(opts.dueDate);
  }
  await page.getByTestId('add-todo-button').click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('sorts by due date, soonest first, no-date last', async ({ page }) => {
  await addTodo(page, 'No date task');
  await addTodo(page, 'Later task', { dueDate: '2026-12-01' });
  await addTodo(page, 'Sooner task', { dueDate: '2026-10-01' });

  await page.getByTestId('sort-select').selectOption('date');

  await expect(page.getByTestId('todo-text')).toHaveText(['Sooner task', 'Later task', 'No date task']);
});

test('sorts by priority, high to low', async ({ page }) => {
  await addTodo(page, 'Low one', { priority: 'low' });
  await addTodo(page, 'High one', { priority: 'high' });
  await addTodo(page, 'Medium one', { priority: 'medium' });

  await page.getByTestId('sort-select').selectOption('priority');

  await expect(page.getByTestId('todo-text')).toHaveText(['High one', 'Medium one', 'Low one']);
});

test('sorts by category alphabetically, uncategorized last', async ({ page }) => {
  await addTodo(page, 'No category task');
  await addTodo(page, 'Zebra task', { category: 'zebra' });
  await addTodo(page, 'Apple task', { category: 'apple' });

  await page.getByTestId('sort-select').selectOption('category');

  await expect(page.getByTestId('todo-text')).toHaveText(['Apple task', 'Zebra task', 'No category task']);
});

test('dragging while sorted resets the sort to manual and keeps the dragged order', async ({ page }) => {
  await addTodo(page, 'Alpha', { priority: 'low' });
  await addTodo(page, 'Beta', { priority: 'high' });
  await addTodo(page, 'Gamma', { priority: 'medium' });

  await page.getByTestId('sort-select').selectOption('priority');
  await expect(page.getByTestId('todo-text')).toHaveText(['Beta', 'Gamma', 'Alpha']);

  const source = page.locator('[data-todo-id]').filter({ hasText: 'Alpha' });
  const target = page.locator('[data-todo-id]').filter({ hasText: 'Beta' });
  await source.dragTo(target);

  await expect(page.getByTestId('sort-select')).toHaveValue('manual');
  await expect(page.getByTestId('todo-text')).toHaveText(['Alpha', 'Beta', 'Gamma']);
});
