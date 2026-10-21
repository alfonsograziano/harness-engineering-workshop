import type { Label } from '@tasklane/shared';

export function LabelChip({ label }: { label: Label }) {
  return (
    <span className="label-chip">
      <span className="label-chip__dot" style={{ background: label.color }} />
      {label.name}
    </span>
  );
}
