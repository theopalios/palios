export interface Service {
  index: string;
  title: string;
  audience: string;
  points: string[];
  cta: { label: string; href: string };
  /** which booking path the CTA uses */
  kind: 'advisory' | 'speaking';
}

export const services: Service[] = [
  {
    index: '01',
    title: 'Advisory',
    audience:
      'For health-tech founders and clinical innovation teams who need AI to survive contact with the real world.',
    points: [
      'AI product strategy — from demo to deployment',
      'Clinical validation & evidence roadmaps',
      'Regulated-market entry, Europe ⇄ Asia',
      'Data governance that clinicians actually trust',
    ],
    cta: { label: 'Book an intro call', href: '#book' },
    kind: 'advisory',
  },
  {
    index: '02',
    title: 'Speaking',
    audience:
      'Keynotes, panels and workshops that make AI in healthcare concrete — for conferences, boards and teams.',
    points: [
      'AI in healthcare, beyond the hype',
      'Voice as a digital biomarker',
      'Founder lessons from the clinic',
      'Tailored formats: 20-min keynote to half-day workshop', // TODO(theo): confirm formats you offer
    ],
    cta: { label: 'Send a speaking inquiry', href: '#book' },
    kind: 'speaking',
  },
];
