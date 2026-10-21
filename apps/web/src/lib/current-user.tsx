import type { User } from '@tasklane/shared';
import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';
import { useUsers } from '../api/users';

const STORAGE_KEY = 'tasklane.currentUserId';

interface CurrentUserContextValue {
  currentUser: User | null;
  setCurrentUserId: (userId: number) => void;
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

function readStoredUserId(): number | null {
  const stored = Number(window.localStorage.getItem(STORAGE_KEY));
  return Number.isInteger(stored) && stored > 0 ? stored : null;
}

/**
 * Tasklane has no login. The current user is picked from the user menu and remembered in localStorage.
 * Until someone picks, the first user in the list is used.
 */
export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const { data: users = [] } = useUsers();
  const [userId, setUserId] = useState<number | null>(readStoredUserId);

  const value = useMemo<CurrentUserContextValue>(() => {
    const currentUser = users.find((user) => user.id === userId) ?? users[0] ?? null;
    return {
      currentUser,
      setCurrentUserId: (nextUserId) => {
        window.localStorage.setItem(STORAGE_KEY, String(nextUserId));
        setUserId(nextUserId);
      },
    };
  }, [users, userId]);

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUser(): CurrentUserContextValue {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error('useCurrentUser must be used inside <CurrentUserProvider>');
  }
  return context;
}
