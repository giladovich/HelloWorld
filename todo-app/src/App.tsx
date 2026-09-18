import { useEffect } from 'react';
import { useTodos } from './hooks/useTodos';
import { AddTodoForm } from './components/AddTodoForm';
import { TodoList } from './components/TodoList';
import { UndoToast } from './components/UndoToast';

export default function App() {
  const { todos, addTodo, toggleComplete, deleteTodo, undoDelete, dismissDeleteNotice, lastDeleted } =
    useTodos();

  useEffect(() => {
    if (!lastDeleted) return;
    const timer = setTimeout(() => dismissDeleteNotice(), 5000);
    return () => clearTimeout(timer);
  }, [lastDeleted, dismissDeleteNotice]);

  return (
    <div>
      <h1>Todo App</h1>
      <AddTodoForm onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleComplete} onDelete={deleteTodo} />
      {lastDeleted && <UndoToast deletedText={lastDeleted.todo.text} onUndo={undoDelete} />}
    </div>
  );
}
