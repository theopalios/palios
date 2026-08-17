/**
 * Site-wide constants. This is the file to edit when details change —
 * no need to touch any component markup.
 */

export const SITE = {
  name: 'Theo Palios',
  title: 'Theo Palios — AI × Healthcare · Advisor & Speaker',
  description:
    'Founder of Unicorn Labs, building Noetika — speech-based cognitive assessment. ' +
    'Advisor to health-tech teams shipping AI into regulated care, and speaker on AI in healthcare.',
  email: 'theo@unicornlabs.nl',
  location: 'Netherlands ⇄ Singapore',
};

export const BOOKING = {
  /**
   * Public share link of the Google Calendar appointment schedule
   * (Google Calendar → your schedule → Share → "Use a link").
   * Used for the "open in a new tab" button.
   */
  shareUrl: 'https://calendar.app.google/tqy6EUPcEaYPzmNq6',
  /**
   * Canonical appointment-schedule URL (the short link above resolves here).
   * Used to build the iframe embed. Set to '' to disable the embed and show
   * the email fallback instead.
   */
  embedUrl:
    'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3QXetDtqN8JEchIBLgl6z3AmSoXFdgC0wKVN2k_2tiUhjI5A25d-vqpkg6rQkcXZ52whLIP3-a',
};

/** Pre-filled email for speaking inquiries (also the booking fallback). */
export const MAILTO = {
  advisory:
    `mailto:${SITE.email}` +
    '?subject=' +
    encodeURIComponent('Advisory intro call') +
    '&body=' +
    encodeURIComponent(
      'Hi Theo,\n\n' +
        "I'd like to book a 30-minute intro call.\n\n" +
        "What I'm working on:\n\n" +
        'My availability (with timezone):\n',
    ),
  speaking:
    `mailto:${SITE.email}` +
    '?subject=' +
    encodeURIComponent('Speaking inquiry') +
    '&body=' +
    encodeURIComponent(
      'Hi Theo,\n\n' +
        "We'd love to have you speak.\n\n" +
        'Event:\nDate:\nLocation (or remote):\nAudience & size:\nTopic you have in mind:\n',
    ),
};

/** Socials with an empty href are not rendered — fill them in to show them. */
export const SOCIALS: { label: string; href: string }[] = [
  { label: 'GitHub', href: 'https://github.com/theopalios' },
  { label: 'LinkedIn', href: '' }, // TODO(theo): add your LinkedIn profile URL
  { label: 'X', href: '' }, // TODO(theo): add your X/Twitter URL, or leave empty
];
