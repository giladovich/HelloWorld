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
  const remaining = useMemo(() => todos.filter((t) => !t.completed).length, [todos]);

  return (
    <div className="app">
      <div className="app-header">
        <div className="app-header-title">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="var(--accent)" strokeWidth="2" />
            <path
              d="M7.5 12.5l3 3 6-6.5"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="app-title">Todo App</h1>
        </div>
        <span className="app-remaining">
          {remaining} of {todos.length} remaining
        </span>
      </div>
      {storageError && <StorageErrorBanner />}
      <AddTodoForm onAdd={addTodo} />
      <div className="toolbar">
        <FilterBar value={status} onChange={setStatus} />
        <CategoryFilter categories={categories} value={category} onChange={setCategory} />
        <SearchBar value={search} onChange={setSearch} />
      </div>
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
