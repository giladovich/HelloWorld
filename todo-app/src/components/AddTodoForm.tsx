import { useState, type FormEvent } from 'react';
import type { NewTodoInput, Priority } from '../types';

interface AddTodoFormProps {
  onAdd: (input: NewTodoInput) => void;
}

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd({
      text: trimmed,
      category: category.trim() || null,
      priority,
      dueDate: dueDate || null,
    });
    setText('');
    setCategory('');
    setPriority('medium');
    setDueDate('');
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="add-form-row">
        <input
          className="field field-grow"
          data-testid="todo-text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs doing?"
        />
        <button className="btn btn-primary" type="submit" data-testid="add-todo-button">
          Add
        </button>
      </div>
      <div className="add-form-row">
        <input
          className="field field-sm"
          data-testid="todo-category-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (optional)"
        />
        <select
          className="field field-sm"
          data-testid="todo-priority-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          className="field field-sm"
          data-testid="todo-due-date-input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
    </form>
  );
}
