interface UndoToastProps {
  deletedText: string;
  onUndo: () => void;
}

export function UndoToast({ deletedText, onUndo }: UndoToastProps) {
  return (
    <div data-testid="undo-toast" role="status">
      <span>Deleted "{deletedText}"</span>
      <button data-testid="undo-button" onClick={onUndo}>
        Undo
      </button>
    </div>
  );
}
