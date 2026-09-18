import type { Todo } from './types';

export type StatusFilter = 'all' | 'active' | 'completed';

export interface FilterCriteria {
  status: StatusFilter;
  category: string | null;
  search: string;
}

export function filterTodos(todos: Todo[], criteria: FilterCriteria): Todo[] {
  return todos.filter((todo) => {
    if (criteria.status === 'active' && todo.completed) return false;
    if (criteria.status === 'completed' && !todo.completed) return false;
    if (criteria.category && todo.category !== criteria.category) return false;
    if (criteria.search && !todo.text.toLowerCase().includes(criteria.search.toLowerCase())) {
      return false;
    }
    return true;
  });
}

export function uniqueCategories(todos: Todo[]): string[] {
  const set = new Set<string>();
  for (const todo of todos) {
    if (todo.category) set.add(todo.category);
  }
  return Array.from(set).sort();
}
