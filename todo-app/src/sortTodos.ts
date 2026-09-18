import type { Priority, Todo } from './types';

export type SortOption = 'manual' | 'date' | 'priority' | 'category';

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

function compareNullableLast(a: string | null, b: string | null): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a.localeCompare(b);
}

export function sortTodos(todos: Todo[], sortBy: SortOption): Todo[] {
  if (sortBy === 'manual') return todos;

  const withIndex = todos.map((todo, index) => ({ todo, index }));

  withIndex.sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'date') {
      cmp = compareNullableLast(a.todo.dueDate, b.todo.dueDate);
    } else if (sortBy === 'priority') {
      cmp = PRIORITY_RANK[a.todo.priority] - PRIORITY_RANK[b.todo.priority];
    } else if (sortBy === 'category') {
      cmp = compareNullableLast(a.todo.category, b.todo.category);
    }
    return cmp !== 0 ? cmp : a.index - b.index;
  });

  return withIndex.map((entry) => entry.todo);
}
