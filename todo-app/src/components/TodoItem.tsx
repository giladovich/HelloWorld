import type { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li data-testid="todo-item">
      <input
        type="checkbox"
        data-testid="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span
        data-testid="todo-text"
        style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
      >
        {todo.text}
      </span>
      {todo.category && <span data-testid="todo-category"> #{todo.category}</span>}
      <span data-testid="todo-priority"> [{todo.priority}]</span>
      {todo.dueDate && <span data-testid="todo-due-date"> due {todo.dueDate}</span>}
      <button data-testid="todo-delete-button" onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </li>
  );
}
