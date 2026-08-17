export interface Topic {
  index: string;
  title: string;
  blurb: string;
  /** color of the hover sweep layer */
  rowColor: string;
}

/* TODO(theo): confirm or replace these draft talk titles */
export const topics: Topic[] = [
  {
    index: '01',
    title: 'What speech reveals about the brain',
    blurb: 'Voice as a digital biomarker — the science, the product, and the pitfalls.',
    rowColor: 'var(--color-lime)',
  },
  {
    index: '02',
    title: 'Shipping AI into clinical reality',
    blurb: 'From a promising demo to a deployed tool clinicians actually use.',
    rowColor: 'var(--color-sunflower)',
  },
  {
    index: '03',
    title: 'Digital biomarkers, demystified',
    blurb: 'What actually works for early detection — and what is still hype.',
    rowColor: 'var(--color-magenta)',
  },
  {
    index: '04',
    title: 'Building deep-tech between Europe and Asia',
    blurb: 'Founder lessons from taking a Dutch health-AI product to Singapore.',
    rowColor: 'var(--color-paper)',
  },
];

/* TODO(theo): replace with real events/podcasts you have spoken at */
export const spokenAt: string[] = [
  'Your conference here',
  'That podcast',
  'A university guest lecture',
  'An industry panel',
];
