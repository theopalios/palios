export interface Topic {
  index: string;
  title: string;
  blurb: string;
  /** color of the hover sweep layer */
  rowColor: string;
}

/** The signature talk — the one with a real title and a real room behind it. */
export const featuredTalk = {
  title: 'How to build AI for highly regulated fields',
  blurb:
    'What changes when a model has to satisfy regulators, clinicians and procurement — not just a ' +
    'benchmark. Where the evidence bar actually sits, what slows a deployment down, and the ' +
    'decisions worth making early.',
  context: 'Latest talk · Google for Startups Accelerator',
};

/** Subjects Theo speaks and advises on, beyond the talk above. */
export const topics: Topic[] = [
  {
    index: '01',
    title: 'AI',
    blurb: 'Where it genuinely works, where it does not, and how to tell before you build.',
    rowColor: 'var(--color-lime)',
  },
  {
    index: '02',
    title: 'Startups',
    blurb: 'Building from zero — finding the buyer, earning the first pilot, surviving the middle.',
    rowColor: 'var(--color-sunflower)',
  },
  {
    index: '03',
    title: 'Innovation',
    blurb: 'Getting new technology past the pilot and into the way an organisation actually works.',
    rowColor: 'var(--color-paper)',
  },
];

/*
 * Only real, checkable appearances belong here — an empty list renders nothing
 * rather than something invented.
 * TODO(theo): add any conferences, panels and podcasts you want listed.
 */
export const spokenAt: string[] = [
  'Google for Startups Accelerator',
  'Startupbootcamp Impact Day — Amsterdam, 2024',
];
