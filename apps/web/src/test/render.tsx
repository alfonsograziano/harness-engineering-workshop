import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Issue, Label } from '@tasklane/shared';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';

/** Renders with a fresh QueryClient (no retries) and an in-memory router. */
export function renderWithProviders(ui: ReactNode) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

type Handler = (init: RequestInit | undefined) => unknown;

/** Replaces fetch. Keys are "METHOD /api/path"; unknown requests fail the test with a 500. */
export function mockApi(routes: Record<string, Handler>) {
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    const handler = routes[`${init?.method ?? 'GET'} ${url}`];
    if (!handler) {
      return new Response(JSON.stringify({ error: { code: 'UNMOCKED', message: url } }), { status: 500 });
    }
    return new Response(JSON.stringify(handler(init)), { status: 200 });
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

export const bugLabel: Label = { id: 1, name: 'bug', color: '#eb5757' };
export const designLabel: Label = { id: 2, name: 'design', color: '#bb87fc' };

export function makeIssue(overrides: Partial<Issue> = {}): Issue {
  return {
    id: 1,
    identifier: 'WEB-1',
    projectKey: 'WEB',
    number: 1,
    title: 'First issue',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignee: null,
    creator: { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' },
    labels: [],
    createdAt: '2026-11-01T09:00:00.000Z',
    updatedAt: '2026-11-01T09:00:00.000Z',
    ...overrides,
  };
}
