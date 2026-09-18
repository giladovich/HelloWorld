import { useEffect, useMemo, useState } from 'react';
import { useTodos } from './hooks/useTodos';
import { AddTodoForm } from './components/AddTodoForm';
import { TodoList } from './components/TodoList';
import { UndoToast } from './components/UndoToast';
import { FilterBar } from './components/FilterBar';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { EmptyState } from './components/EmptyState';
import { StorageErrorBanner } from './components/StorageErrorBanner';
import { filterTodos, uniqueCategories, type StatusFilter } from './filterTodos';

export default function App() {
  const {
    todos,
    storageError,
    addTodo,
    toggleComplete,
    deleteTodo,
    undoDelete,
    dismissDeleteNotice,
    lastDeleted,
    updateTodo,
    reorderTodos,
  } = useTodos();
  const [status, setStatus] = useState<StatusFilter>('all');
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!lastDeleted) return;
    const timer = setTimeout(() => dismissDeleteNotice(), 5000);
    return () => clearTimeout(timer);
  }, [lastDeleted, dismissDeleteNotice]);

  const categories = useMemo(() => uniqueCategories(todos), [todos]);
  const filteredTodos = useMemo(
    () => filterTodos(todos, { status, category, search }),
    [todos, status, category, search]
  );

  return (
    <div>
      <h1>Todo App</h1>
      {storageError && <StorageErrorBanner />}
      <AddTodoForm onAdd={addTodo} />
      <FilterBar value={status} onChange={setStatus} />
      <CategoryFilter categories={categories} value={category} onChange={setCategory} />
      <SearchBar value={search} onChange={setSearch} />
      {filteredTodos.length === 0 ? (
        <EmptyState
          message={todos.length === 0 ? 'No todos yet — add one above!' : 'No todos match your filters.'}
        />
      ) : (
        <TodoList
          todos={filteredTodos}
          onToggle={toggleComplete}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
          onReorder={reorderTodos}
        />
      )}
      {lastDeleted && <UndoToast deletedText={lastDeleted.todo.text} onUndo={undoDelete} />}
    </div>
  );
}
