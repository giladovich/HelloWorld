import { useRef } from 'react';
import type { Todo } from '../types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Pick<Todo, 'text' | 'category' | 'priority' | 'dueDate'>>) => void;
  onReorder: (orderedIds: string[]) => void;
}

export function TodoList({ todos, onToggle, onDelete, onUpdate, onReorder }: TodoListProps) {
  const draggedId = useRef<string | null>(null);

  const handleDrop = (targetId: string) => {
    const sourceId = draggedId.current;
    draggedId.current = null;
    if (!sourceId || sourceId === targetId) return;

    const ids = todos.map((t) => t.id);
    const sourceIndex = ids.indexOf(sourceId);
    const targetIndex = ids.indexOf(targetId);
    ids.splice(sourceIndex, 1);
    ids.splice(targetIndex, 0, sourceId);
    onReorder(ids);
  };

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onDragStart={(id) => {
            draggedId.current = id;
          }}
          onDrop={handleDrop}
        />
      ))}
    </ul>
  );
}
