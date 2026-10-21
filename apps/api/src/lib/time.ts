/** The current time as an ISO 8601 string in UTC. Every timestamp we store goes through here. */
export function nowIso(): string {
  return new Date().toISOString();
}

/** Normalises any date input to an ISO 8601 string in UTC. */
export function toIso(date: Date | string | number): string {
  return new Date(date).toISOString();
}
