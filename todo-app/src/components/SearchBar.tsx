interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      data-testid="search-input"
      type="search"
      placeholder="Search todos..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
