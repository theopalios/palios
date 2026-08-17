export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  cardClass: string;
}

/*
 * TODO(theo): replace all three with real quotes (name, role, organization —
 * with their permission). Until then these are clearly marked placeholders.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      'Placeholder — ask a founder you advised for two sentences about what changed after working with you.',
    name: 'A founder you advised',
    role: 'TODO — name, role, company',
    cardClass: 'bg-lime text-ink',
  },
  {
    quote:
      'Placeholder — ask an event organizer for a line about how your talk landed with their audience.',
    name: 'An event organizer',
    role: 'TODO — name, event',
    cardClass: 'bg-cobalt text-paper',
  },
  {
    quote:
      'Placeholder — ask a clinical partner what made the collaboration work from their side.',
    name: 'A clinical partner',
    role: 'TODO — name, role, institution',
    cardClass: 'bg-sunflower text-ink',
  },
];
