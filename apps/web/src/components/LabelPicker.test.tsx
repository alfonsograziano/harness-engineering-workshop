import { MAX_LABELS_PER_ISSUE } from '@tasklane/shared';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { bugLabel, designLabel, makeIssue, mockApi, renderWithProviders } from '../test/render';
import { LabelPicker } from './LabelPicker';

describe('LabelPicker', () => {
  it('checks the labels the issue already has', async () => {
    mockApi({ 'GET /api/projects/WEB/labels': () => [bugLabel, designLabel] });

    renderWithProviders(<LabelPicker issue={makeIssue({ labels: [bugLabel] })} />);

    expect(await screen.findByRole('checkbox', { name: /bug/ })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /design/ })).not.toBeChecked();
  });

  it('sends the whole new set of label ids when a label is toggled', async () => {
    const fetchMock = mockApi({
      'GET /api/projects/WEB/labels': () => [bugLabel, designLabel],
      'PUT /api/issues/WEB-1/labels': (init) => makeIssue({ labels: JSON.parse(String(init?.body)).labelIds }),
    });

    renderWithProviders(<LabelPicker issue={makeIssue({ labels: [bugLabel] })} />);
    await userEvent.click(await screen.findByRole('checkbox', { name: /design/ }));

    await waitFor(() => {
      const put = fetchMock.mock.calls.find(([, init]) => init?.method === 'PUT');
      expect(JSON.parse(String(put?.[1]?.body))).toEqual({ labelIds: [1, 2] });
    });
  });

  it(`disables unchecked labels once the issue has ${MAX_LABELS_PER_ISSUE}`, async () => {
    const labels = Array.from({ length: MAX_LABELS_PER_ISSUE + 1 }, (_, index) => ({
      ...bugLabel,
      id: index + 1,
      name: `label-${index + 1}`,
    }));
    mockApi({ 'GET /api/projects/WEB/labels': () => labels });

    renderWithProviders(<LabelPicker issue={makeIssue({ labels: labels.slice(0, MAX_LABELS_PER_ISSUE) })} />);

    expect(await screen.findByRole('checkbox', { name: /label-6/ })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: /label-1/ })).toBeEnabled();
  });
});
