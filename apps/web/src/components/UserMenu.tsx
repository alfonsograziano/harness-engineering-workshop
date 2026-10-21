import { useUsers } from '../api/users';
import { useCurrentUser } from '../lib/current-user';
import { Avatar } from './Avatar';

/** There is no login: whoever uses the app picks who they are from this menu. */
export function UserMenu() {
  const { data: users = [] } = useUsers();
  const { currentUser, setCurrentUserId } = useCurrentUser();

  return (
    <label className="user-menu">
      {currentUser && <Avatar user={currentUser} />}
      <select
        aria-label="Current user"
        value={currentUser?.id ?? ''}
        onChange={(event) => setCurrentUserId(Number(event.target.value))}
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </label>
  );
}
