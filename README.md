# theopalios.com — personal site

Portfolio + booking site for **Theo Palios** — advisor & speaker on AI in healthcare, founder of
Unicorn Labs / Noetika. A single long-scroll page: bold color-block design, scroll-driven
background morphing, a pinned horizontal work strip, and Google Calendar booking built in.

Built with [Astro](https://astro.build) 7, Tailwind CSS 4, GSAP ScrollTrigger and Lenis.
Ships as a static site in an nginx container on Google Cloud Run (see `DEPLOY.md`).

**Live**: <https://palios-site-671297868122.europe-west4.run.app> (Cloud Run service `palios-site`,
project `palios-site`, region `europe-west4`) · custom domain **palios.io** mapped, serving once
its DNS records point at Google (see `DEPLOY.md`).

## Commands

| Command           | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `npm install`     | Install dependencies                                                |
| `npm run dev`     | Dev server at `http://localhost:4321`                               |
| `npm run build`   | Production build into `dist/`                                       |
| `npm run preview` | Serve the production build locally                                  |
| `npm run shots`   | Visual verification: screenshots + motion/anchor/reduced-motion checks into `.shots/` |

## Editing content — no markup required

All copy lives in two places:

- **`src/config.ts`** — your name, meta description, email, booking URLs, social links.
- **`src/data/*.ts`** — services, work/portfolio cards, talk topics, venues, testimonials, stats.

Search the repo for **`TODO(theo)`** to find everything awaiting your confirmation:

- [ ] Bio wording & facts in `src/components/About.astro`
- [ ] Stats (all four numbers) in `src/data/stats.ts`
- [ ] Work cards 3 & 4 (real case studies) + Noetika outcome metric in `src/data/work.ts`
- [ ] Talk titles + "recently on stage at" venues in `src/data/talks.ts`
- [ ] Three real testimonials in `src/data/testimonials.ts`
- [ ] LinkedIn / X URLs in `src/config.ts` (empty links are hidden automatically)
- [ ] Portrait photo — replace the placeholder card in `src/components/About.astro`
- [ ] Final domain in `astro.config.mjs` (`site:`) once you map one

## Booking (Google Calendar)

The **Book time with me** section embeds your Google Calendar **appointment schedule**:

- Share link (button "Open in a new tab"): `BOOKING.shareUrl` in `src/config.ts`
- Embed (iframe): `BOOKING.embedUrl` — the canonical
  `https://calendar.google.com/calendar/appointments/schedules/…` URL your share link resolves to.

To change or add a schedule: Google Calendar → **Create → Appointment schedule** → set
availability → **Share** → copy the link. Paste the link into `shareUrl`; to refresh the embed
URL, open the short link in a browser and copy the long URL it redirects to into `embedUrl`.
The schedule must be public ("anyone with the link").

Set `embedUrl: ''` (or build with `PUBLIC_BOOKING_EMBED=off`) to hide the calendar and show the
email fallback card instead. Speaking inquiries always go through a pre-filled email.

## How the motion system works

- `src/scripts/main.ts` gates everything behind `prefers-reduced-motion` and viewport width via
  `gsap.matchMedia`. No JS or reduced motion → fully static, fully visible, still colorful
  (sections carry their colors inline; motion mode makes them transparent and morphs the body).
- `src/scripts/theme-morph.ts` — the background color morph between sections.
- `src/scripts/work-strip.ts` — pinned horizontal portfolio strip (desktop only; mobile uses
  native snap scroll).
- Reveals are attribute-driven: `data-reveal` (variants `slide`, `toss`, `wipe`),
  `data-reveal-group`, `data-counter`.

## Deploying

See **`DEPLOY.md`** for the full Google Cloud Run runbook (build container, deploy command,
custom domain).
