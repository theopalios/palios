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
    role: 'Founder & CEO',
    period: '2024 — now', // TODO(theo): noetika.ai says founded 2024, LinkedIn/Tracxn say 2023 — which is right?
    description:
      'Speech-based cognitive assessment. AI that listens to how people speak to help clinicians ' +
      'screen for Alzheimer’s and cognitive decline earlier — 0.96 detection AUC, five languages, ' +
      'MMSE and MoCA supported, with a clinician always making the final call.',
    tags: ['AI', 'Healthcare', 'Voice'],
    href: 'https://noetika.ai',
    cardClass: 'bg-lime text-ink',
  },
  {
    index: '02',
    title: 'Unicorn Labs',
    role: 'Founder & CEO',
    period: '2023 — now',
    description:
      'The deep-tech company behind Noetika. Startupbootcamp DeepTech & Robotics cohort, Google for ' +
      'Startups Accelerator, and pilots with partners including A*STAR, NTU Singapore, University of ' +
      'Groningen and VinUniversity.',
    tags: ['Deep tech', 'Venture'],
    href: 'https://unicornlabs.nl',
    cardClass: 'bg-sunflower text-ink',
  },
  {
    index: '03',
    title: 'Google for Startups',
    role: 'Mentor',
    period: '2026 — now',
    description:
      'Mentoring founders in the Google for Startups Accelerator — AI product strategy, getting from ' +
      'a working model to something a customer will actually deploy.',
    tags: ['Mentoring', 'AI'],
    cardClass: 'bg-magenta text-paper',
  },
  {
    index: '04',
    title: 'Startupbootcamp',
    role: 'Mentor',
    period: '2025 — now',
    description:
      'Mentor to deep-tech and health-tech teams, after going through the DeepTech & Robotics ' +
      'programme with Unicorn Labs and pitching at Impact Day in Amsterdam.',
    tags: ['Mentoring', 'Deep tech'],
    cardClass: 'bg-paper text-ink',
  },
];
