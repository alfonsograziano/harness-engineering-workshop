export type IssueView = 'list' | 'board';

interface ViewToggleProps {
  value: IssueView;
  onChange: (view: IssueView) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <fieldset className="view-toggle" aria-label="View">
      {(['list', 'board'] as const).map((view) => (
        <button
          key={view}
          type="button"
          className={view === value ? 'view-toggle__button view-toggle__button--active' : 'view-toggle__button'}
          aria-pressed={view === value}
          onClick={() => onChange(view)}
        >
          {view === 'list' ? 'List' : 'Board'}
        </button>
      ))}
    </fieldset>
  );
}
