import type { Todo } from './types';

const STORAGE_KEY = 'todo-app:todos';

export function loadTodos(): { todos: Todo[]; error: boolean } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return { todos: raw ? (JSON.parse(raw) as Todo[]) : [], error: false };
  } catch {
    return { todos: [], error: true };
  }
}

export function saveTodos(todos: Todo[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    return true;
  } catch {
    return false;
  }
}
