import { ISSUE_STATUSES, type IssueStatus } from '@tasklane/shared';
import { STATUS_LABELS } from '../lib/labels';

interface StatusSelectProps {
  value: IssueStatus;
  onChange: (status: IssueStatus) => void;
  disabled?: boolean;
}

/** Status changes always go through this menu. There is no drag and drop on the board. */
export function StatusSelect({ value, onChange, disabled }: StatusSelectProps) {
  return (
    <select
      className={`status-select status-select--${value}`}
      aria-label="Status"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as IssueStatus)}
    >
      {ISSUE_STATUSES.map((status) => (
        <option key={status} value={status}>
          {STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}
