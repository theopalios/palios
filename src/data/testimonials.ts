export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  cardClass: string;
}

/*
 * Real quotes only. While this array is empty the whole "What people say"
 * section is omitted from the page — better a shorter site than invented praise.
 *
 * To add one, ask the person for two sentences and their permission, then:
 *   { quote: '…', name: 'Jane Doe', role: 'CEO, Somewhere', cardClass: 'bg-lime text-ink' }
 * Card colors available: bg-lime/bg-sunflower text-ink · bg-cobalt/bg-magenta/bg-violet text-paper
 */
export const testimonials: Testimonial[] = [];
