export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

/*
 * Sourced from noetika.ai and Theo's own history — confirm before launch.
 * 0.96 is shown as a percentage-style figure because count-ups animate integers.
 */
export const stats: Stat[] = [
  { value: 8, suffix: ' yrs', label: 'shipping software before founding' },
  { value: 7, suffix: '', label: 'research & clinical partners' },
  { value: 5, suffix: '', label: 'languages supported' },
  { value: 30, suffix: ' min', label: 'to get on my calendar' },
];
