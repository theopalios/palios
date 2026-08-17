export interface WorkItem {
  index: string;
  title: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
  href?: string;
  /** card background utility class + matching text color */
  cardClass: string;
  todo?: string;
}

export const work: WorkItem[] = [
  {
    index: '01',
    title: 'Noetika',
    role: 'Founder',
    period: '2023 — now', // TODO(theo): confirm start year
    description:
      'Speech-based cognitive assessment. AI that listens to how people speak to help clinicians ' +
      'screen for Alzheimer’s, Parkinson’s and cognitive decline earlier — from first screening to ' +
      'longitudinal monitoring, integrated into clinical workflows.',
    tags: ['AI', 'Healthcare', 'Voice'],
    href: 'https://noetika.ai',
    cardClass: 'bg-lime text-ink',
    todo: 'TODO(theo): add one concrete outcome metric and named partners (with permission)',
  },
  {
    index: '02',
    title: 'Unicorn Labs',
    role: 'Founder',
    period: '—', // TODO(theo): year
    description:
      'The venture vehicle behind Noetika. Building AI products for healthcare from the Netherlands, ' +
      'deploying them with partners across Europe and Asia.',
    tags: ['Venture', 'AI'],
    href: 'https://unicornlabs.nl',
    cardClass: 'bg-sunflower text-ink',
    todo: 'TODO(theo): sharpen the one-liner — what is Unicorn Labs to you?',
  },
  {
    index: '03',
    title: 'Your next case study',
    role: 'Advisor',
    period: 'TODO',
    description:
      'TODO(theo): a project or advisory engagement you can talk about — the team, what you did, ' +
      'and the outcome in one number if you have it.',
    tags: ['Placeholder'],
    cardClass: 'bg-magenta text-paper',
  },
  {
    index: '04',
    title: 'On stage',
    role: 'Speaker',
    period: 'TODO',
    description:
      'TODO(theo): a talk or keynote that landed well — event, audience, and the one idea people ' +
      'quoted back at you afterwards.',
    tags: ['Placeholder'],
    cardClass: 'bg-paper text-ink',
  },
];
