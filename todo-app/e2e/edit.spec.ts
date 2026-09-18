import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByTestId('todo-text-input').fill('Draft report');
  await page.getByTestId('add-todo-button').click();
});

test("edits a todo's text and priority", async ({ page }) => {
  const item = page.getByTestId('todo-item').filter({ hasText: 'Draft report' });
  await item.getByTestId('edit-button').click();

  await item.getByTestId('edit-text-input').fill('Draft final report');
  await item.getByTestId('edit-priority-select').selectOption('high');
  await item.getByTestId('save-edit-button').click();

  const updated = page.getByTestId('todo-item').filter({ hasText: 'Draft final report' });
  await expect(updated.getByTestId('todo-text')).toHaveText('Draft final report');
  await expect(updated.getByTestId('todo-priority')).toContainText('high');
});

test('cancels an edit without saving changes', async ({ page }) => {
  const item = page.getByTestId('todo-item').filter({ hasText: 'Draft report' });
  await item.getByTestId('edit-button').click();
  await item.getByTestId('edit-text-input').fill('Should not save');
  await item.getByTestId('cancel-edit-button').click();

  await expect(page.getByTestId('todo-item').filter({ hasText: 'Draft report' })).toBeVisible();
  await expect(page.getByTestId('todo-item').filter({ hasText: 'Should not save' })).toHaveCount(0);
});
