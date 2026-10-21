import type { IssuePriority } from '@tasklane/shared';
import { PRIORITY_LABELS } from '../lib/labels';

const BARS: Record<IssuePriority, number> = { none: 0, low: 1, medium: 2, high: 3, urgent: 3 };

export function PriorityIcon({ priority }: { priority: IssuePriority }) {
  const label = PRIORITY_LABELS[priority];

  if (priority === 'urgent') {
    return (
      <span className="priority priority--urgent" title={label} role="img" aria-label={label}>
        !
      </span>
    );
  }

  return (
    <span className="priority" title={label} role="img" aria-label={label}>
      {[1, 2, 3].map((bar) => (
        <span key={bar} className={bar <= BARS[priority] ? 'priority__bar priority__bar--on' : 'priority__bar'} />
      ))}
    </span>
  );
}
