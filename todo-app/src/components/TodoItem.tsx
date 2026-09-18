import { useState } from 'react';
import type { Priority, Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Pick<Todo, 'text' | 'category' | 'priority' | 'dueDate'>>) => void;
  onDragStart: (id: string) => void;
  onDrop: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate, onDragStart, onDrop }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(todo.text);
  const [category, setCategory] = useState(todo.category ?? '');
  const [priority, setPriority] = useState<Priority>(todo.priority);
  const [dueDate, setDueDate] = useState(todo.dueDate ?? '');

  const startEdit = () => {
    setText(todo.text);
    setCategory(todo.category ?? '');
    setPriority(todo.priority);
    setDueDate(todo.dueDate ?? '');
    setIsEditing(true);
  };

  const saveEdit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onUpdate(todo.id, {
      text: trimmed,
      category: category.trim() || null,
      priority,
      dueDate: dueDate || null,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li data-testid="todo-item">
        <span style={{ display: 'none' }}>{todo.text}</span>
        <input
          data-testid="edit-text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          data-testid="edit-category-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <select
          data-testid="edit-priority-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          data-testid="edit-due-date-input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button data-testid="save-edit-button" onClick={saveEdit}>
          Save
        </button>
        <button data-testid="cancel-edit-button" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </li>
    );
  }

  return (
    <li
      data-testid="todo-item"
      data-todo-id={todo.id}
      draggable
      onDragStart={() => onDragStart(todo.id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(todo.id)}
    >
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
      <button data-testid="edit-button" onClick={startEdit}>
        Edit
      </button>
      <button data-testid="todo-delete-button" onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </li>
  );
}
