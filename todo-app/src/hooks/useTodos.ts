import { useCallback, useEffect, useState } from 'react';
import type { NewTodoInput, Todo } from '../types';
import { loadTodos, saveTodos } from '../storage';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const { todos: loaded, error } = loadTodos();
    setTodos([...loaded].sort((a, b) => a.order - b.order));
    setStorageError(error);
  }, []);

  const persist = useCallback((next: Todo[]) => {
    const sorted = [...next].sort((a, b) => a.order - b.order);
    setTodos(sorted);
    const ok = saveTodos(sorted);
    if (!ok) setStorageError(true);
  }, []);

  const addTodo = useCallback(
    (input: NewTodoInput) => {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        text: input.text,
        completed: false,
        category: input.category,
        priority: input.priority,
        dueDate: input.dueDate,
        order: todos.length,
        createdAt: new Date().toISOString(),
      };
      persist([...todos, newTodo]);
    },
    [todos, persist]
  );

  return { todos, storageError, addTodo };
}
