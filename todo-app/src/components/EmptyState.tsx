interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <p className="empty-state" data-testid="empty-state">
      {message}
    </p>
  );
}
