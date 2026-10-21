import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { bugLabel, designLabel, makeIssue, renderWithProviders } from '../test/render';
import { IssueList } from './IssueList';

describe('IssueList', () => {
  it('groups issues by status, in workflow order, and skips empty groups', () => {
    renderWithProviders(
      <IssueList
        issues={[
          makeIssue({ id: 1, identifier: 'WEB-1', status: 'done' }),
          makeIssue({ id: 2, identifier: 'WEB-2', status: 'todo' }),
          makeIssue({ id: 3, identifier: 'WEB-3', status: 'todo' }),
        ]}
      />,
    );

    const headings = screen.getAllByRole('heading').map((heading) => heading.textContent);
    expect(headings).toEqual(['Todo 2', 'Done 1']);
  });

  it('shows the labels of each issue as chips', () => {
    renderWithProviders(<IssueList issues={[makeIssue({ labels: [bugLabel, designLabel] })]} />);

    const row = screen.getByRole('link', { name: /WEB-1/ }).closest('.issue-row') as HTMLElement;
    expect(within(row).getByText('bug')).toBeInTheDocument();
    expect(within(row).getByText('design')).toBeInTheDocument();
  });

  it('links each issue to its detail panel', () => {
    renderWithProviders(<IssueList issues={[makeIssue()]} />);

    expect(screen.getByRole('link', { name: /First issue/ })).toHaveAttribute('href', '/issues/WEB-1');
  });
});
