import { type Issue, LABEL_COLORS, type LabelColor, MAX_LABELS_PER_ISSUE } from '@tasklane/shared';
import { type FormEvent, useState } from 'react';
import { useCreateLabel, useLabels, useSetIssueLabels } from '../api/labels';
import { ErrorMessage } from './ErrorMessage';

/** Checkboxes for the project's labels, plus a small form to create a new one and add it to the issue. */
export function LabelPicker({ issue }: { issue: Issue }) {
  const { data: labels = [] } = useLabels(issue.projectKey);
  const setIssueLabels = useSetIssueLabels();
  const createLabel = useCreateLabel(issue.projectKey);
  const [name, setName] = useState('');
  const [color, setColor] = useState<LabelColor>(LABEL_COLORS[0]);

  const selectedIds = issue.labels.map((label) => label.id);
  const isFull = selectedIds.length >= MAX_LABELS_PER_ISSUE;

  function save(labelIds: number[]) {
    setIssueLabels.mutate({ identifier: issue.identifier, input: { labelIds } });
  }

  function toggle(labelId: number) {
    save(selectedIds.includes(labelId) ? selectedIds.filter((id) => id !== labelId) : [...selectedIds, labelId]);
  }

  function handleCreate(event: FormEvent) {
    event.preventDefault();
    createLabel.mutate(
      { name, color },
      {
        onSuccess: (label) => {
          setName('');
          if (!isFull) {
            save([...selectedIds, label.id]);
          }
        },
      },
    );
  }

  return (
    <div className="label-picker">
      <ul className="label-picker__list">
        {labels.map((label) => {
          const checked = selectedIds.includes(label.id);
          return (
            <li key={label.id}>
              <label className="label-picker__option">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={setIssueLabels.isPending || (!checked && isFull)}
                  onChange={() => toggle(label.id)}
                />
                <span className="label-chip__dot" style={{ background: label.color }} />
                {label.name}
              </label>
            </li>
          );
        })}
      </ul>

      <form className="label-picker__new" onSubmit={handleCreate}>
        <input
          aria-label="New label name"
          placeholder="New label"
          value={name}
          maxLength={30}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <div className="label-picker__colors" role="radiogroup" aria-label="Label color">
          {LABEL_COLORS.map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={option === color}
              aria-label={option}
              className={option === color ? 'color-swatch color-swatch--active' : 'color-swatch'}
              style={{ background: option }}
              onClick={() => setColor(option)}
            />
          ))}
        </div>
        <button type="submit" className="button" disabled={createLabel.isPending}>
          Add
        </button>
      </form>

      {setIssueLabels.error && <ErrorMessage error={setIssueLabels.error} />}
      {createLabel.error && <ErrorMessage error={createLabel.error} />}
    </div>
  );
}
