import { useCallback, useEffect, useState } from 'react';
import type { NewTodoInput, Todo } from '../types';
import { loadTodos, saveTodos } from '../storage';

interface DeletedEntry {
  todo: Todo;
  index: number;
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [storageError, setStorageError] = useState(false);
  const [lastDeleted, setLastDeleted] = useState<DeletedEntry | null>(null);

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

  const toggleComplete = useCallback(
    (id: string) => {
      persist(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    },
    [todos, persist]
  );

  const deleteTodo = useCallback(
    (id: string) => {
      const index = todos.findIndex((t) => t.id === id);
      if (index === -1) return;
      setLastDeleted({ todo: todos[index], index });
      persist(todos.filter((t) => t.id !== id));
    },
    [todos, persist]
  );

  const undoDelete = useCallback(() => {
    if (!lastDeleted) return;
    const next = [...todos];
    next.splice(lastDeleted.index, 0, lastDeleted.todo);
    persist(next);
    setLastDeleted(null);
  }, [todos, lastDeleted, persist]);

  const dismissDeleteNotice = useCallback(() => {
    setLastDeleted(null);
  }, []);

  return {
    todos,
    storageError,
    addTodo,
    toggleComplete,
    deleteTodo,
    undoDelete,
    dismissDeleteNotice,
    lastDeleted,
  };
}
