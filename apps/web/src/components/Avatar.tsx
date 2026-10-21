import type { User } from '@tasklane/shared';

const COLORS = ['#5e6ad2', '#26b5ce', '#f2994a', '#4cb782', '#eb5757', '#bb87fc'];

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({ user, size = 22 }: { user: User | null; size?: number }) {
  if (!user) {
    return (
      <span className="avatar avatar--empty" style={{ width: size, height: size }} title="Unassigned">
        ?
      </span>
    );
  }

  return (
    <span
      className="avatar"
      style={{ width: size, height: size, background: COLORS[user.id % COLORS.length] }}
      title={user.name}
    >
      {initials(user.name)}
    </span>
  );
}
