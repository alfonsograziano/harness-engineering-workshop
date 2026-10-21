/** The only colors a label can have. Each one stays readable as a chip on the light UI. */
export const LABEL_COLORS = [
  '#95a2b3',
  '#eb5757',
  '#f2994a',
  '#f2c94c',
  '#4cb782',
  '#26b5ce',
  '#5e6ad2',
  '#bb87fc',
] as const;
export type LabelColor = (typeof LABEL_COLORS)[number];

export const MAX_LABELS_PER_ISSUE = 5;
export const MAX_LABEL_NAME_LENGTH = 30;
