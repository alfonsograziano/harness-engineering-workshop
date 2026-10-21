import { useLabels } from '../api/labels';

interface LabelFilterProps {
  projectKey: string;
  value: number | undefined;
  onChange: (labelId: number | undefined) => void;
}

export function LabelFilter({ projectKey, value, onChange }: LabelFilterProps) {
  const { data: labels = [] } = useLabels(projectKey);

  return (
    <select
      className="label-filter"
      aria-label="Filter by label"
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value ? Number(event.target.value) : undefined)}
    >
      <option value="">All labels</option>
      {labels.map((label) => (
        <option key={label.id} value={label.id}>
          {label.name}
        </option>
      ))}
    </select>
  );
}
