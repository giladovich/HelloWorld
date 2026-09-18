import { useTodos } from './hooks/useTodos';
import { AddTodoForm } from './components/AddTodoForm';
import { TodoList } from './components/TodoList';

export default function App() {
  const { todos, addTodo } = useTodos();

  return (
    <div>
      <h1>Todo App</h1>
      <AddTodoForm onAdd={addTodo} />
      <TodoList todos={todos} />
    </div>
  );
}
