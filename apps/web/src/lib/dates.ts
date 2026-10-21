const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000],
];

/** "3 days ago", "in 2 hours". The API sends UTC; the browser shows it in the viewer's time zone. */
export function formatRelative(isoDate: string, now = Date.now()): string {
  const diff = new Date(isoDate).getTime() - now;
  for (const [unit, size] of UNITS) {
    if (Math.abs(diff) >= size) {
      return relativeFormatter.format(Math.round(diff / size), unit);
    }
  }
  return 'just now';
}

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}
