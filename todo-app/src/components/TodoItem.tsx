import type { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  return (
    <li data-testid="todo-item">
      <span data-testid="todo-text">{todo.text}</span>
      {todo.category && <span data-testid="todo-category"> #{todo.category}</span>}
      <span data-testid="todo-priority"> [{todo.priority}]</span>
      {todo.dueDate && <span data-testid="todo-due-date"> due {todo.dueDate}</span>}
    </li>
  );
}
