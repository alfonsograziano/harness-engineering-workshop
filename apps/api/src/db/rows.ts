/**
 * The one row an INSERT ... RETURNING or UPDATE ... RETURNING must give back.
 * Throws instead of returning undefined, because a missing row there is a bug, not a 404.
 */
export function singleRow<T>(rows: T[]): T {
  const [row] = rows;
  if (row === undefined) {
    throw new Error('Expected the query to return one row, but it returned none');
  }
  return row;
}
