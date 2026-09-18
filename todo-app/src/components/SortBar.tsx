import type { SortOption } from '../sortTodos';

interface SortBarProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortBar({ value, onChange }: SortBarProps) {
  return (
    <select
      className="field field-sm"
      data-testid="sort-select"
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
    >
      <option value="manual">Manual order</option>
      <option value="date">Sort by date</option>
      <option value="priority">Sort by priority</option>
      <option value="category">Sort by category</option>
    </select>
  );
}
