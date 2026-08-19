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
    blurb: 'Founder lessons from taking a health-AI product from Europe into Asia.',
    rowColor: 'var(--color-paper)',
  },
];

/*
 * Only real, checkable appearances belong here — an empty list renders nothing
 * rather than something invented.
 * TODO(theo): add the conferences, panels and podcasts you've done. Worth adding:
 * SUSS Geronpreneurship Innovation Festival 2026 (Suntec Singapore, 26 Aug 2026)
 * if you're on a stage there and not only exhibiting.
 */
export const spokenAt: string[] = [
  'Startupbootcamp Impact Day — Amsterdam, 2024',
  'Google for Startups Accelerator — mentor',
];
