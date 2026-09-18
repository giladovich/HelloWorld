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
      <li className="todo-item" data-testid="todo-item">
        <span style={{ display: 'none' }}>{todo.text}</span>
        <div className="edit-row">
          <input
            className="field field-sm field-grow"
            data-testid="edit-text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            className="field field-sm"
            data-testid="edit-category-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <select
            className="field field-sm"
            data-testid="edit-priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            className="field field-sm"
            data-testid="edit-due-date-input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button className="btn btn-primary" data-testid="save-edit-button" onClick={saveEdit}>
            Save
          </button>
          <button className="btn" data-testid="cancel-edit-button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li
      className="todo-item"
      data-testid="todo-item"
      data-todo-id={todo.id}
      draggable
      onDragStart={() => onDragStart(todo.id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(todo.id)}
    >
      <svg className="drag-handle" width="10" height="16" viewBox="0 0 10 16" fill="currentColor" aria-hidden="true">
        <circle cx="2" cy="2" r="1.4" />
        <circle cx="8" cy="2" r="1.4" />
        <circle cx="2" cy="8" r="1.4" />
        <circle cx="8" cy="8" r="1.4" />
        <circle cx="2" cy="14" r="1.4" />
        <circle cx="8" cy="14" r="1.4" />
      </svg>
      <input
        className="todo-checkbox"
        type="checkbox"
        data-testid="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.text}" complete`}
      />
      <div className="todo-main">
        <span
          className={todo.completed ? 'todo-text completed' : 'todo-text'}
          data-testid="todo-text"
        >
          {todo.text}
        </span>
        <div className="todo-meta">
          {todo.category && (
            <span className="chip" data-testid="todo-category">
              #{todo.category}
            </span>
          )}
          <span className={`chip chip-priority-${todo.priority}`} data-testid="todo-priority">
            {todo.priority}
          </span>
          {todo.dueDate && (
            <span className="chip" data-testid="todo-due-date">
              due {todo.dueDate}
            </span>
          )}
        </div>
      </div>
      <button className="btn-icon" data-testid="edit-button" onClick={startEdit} aria-label={`Edit "${todo.text}"`}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 20l4-1 11-11-3-3L5 16l-1 4z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        className="btn-icon btn-icon-danger"
        data-testid="todo-delete-button"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.text}"`}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </li>
  );
}
