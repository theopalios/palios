export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

/* TODO(theo): confirm every number before launch — these are placeholders in a plausible shape */
export const stats: Stat[] = [
  { value: 10, suffix: '+', label: 'clinical partners' },
  { value: 25, suffix: '+', label: 'stages & panels' },
  { value: 2, suffix: '', label: 'continents, one product' },
  { value: 30, suffix: 'min', label: 'to get on my calendar' },
];
