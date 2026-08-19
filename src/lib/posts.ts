/** Shared helpers for the Weak Signals archive. */

const CARD_COLORS = [
  'bg-lime text-ink',
  'bg-sunflower text-ink',
  'bg-magenta text-paper',
  'bg-cobalt text-paper',
  'bg-tangerine text-paper',
  'bg-violet text-paper',
] as const;

const NAMED: Record<string, string> = {
  lime: 'bg-lime text-ink',
  sunflower: 'bg-sunflower text-ink',
  magenta: 'bg-magenta text-paper',
  cobalt: 'bg-cobalt text-paper',
  tangerine: 'bg-tangerine text-paper',
  violet: 'bg-violet text-paper',
};

/** Explicit frontmatter color, else cycle the palette by position. */
export function cardColor(color: string | undefined, index: number): string {
  return (color && NAMED[color]) || CARD_COLORS[index % CARD_COLORS.length];
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function readingTime(body: string | undefined): number {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
