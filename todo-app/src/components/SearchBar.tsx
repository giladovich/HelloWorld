interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-wrap">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="2" />
        <path d="M19 19l-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        className="field"
        data-testid="search-input"
        type="search"
        placeholder="Search todos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
