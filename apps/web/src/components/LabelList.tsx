import type { Label } from '@tasklane/shared';
import { LabelChip } from './LabelChip';

/** The chips of one issue, in the order the API sends them (by name). */
export function LabelList({ labels }: { labels: Label[] }) {
  if (labels.length === 0) {
    return null;
  }
  return (
    <span className="label-list">
      {labels.map((label) => (
        <LabelChip key={label.id} label={label} />
      ))}
    </span>
  );
}
