import type { StatusFilter } from '../filterTodos';

interface FilterBarProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}

export function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <div role="group" aria-label="Status filter">
      <button data-testid="filter-all" aria-pressed={value === 'all'} onClick={() => onChange('all')}>
        All
      </button>
      <button
        data-testid="filter-active"
        aria-pressed={value === 'active'}
        onClick={() => onChange('active')}
      >
        Active
      </button>
      <button
        data-testid="filter-completed"
        aria-pressed={value === 'completed'}
        onClick={() => onChange('completed')}
      >
        Completed
      </button>
    </div>
  );
}
