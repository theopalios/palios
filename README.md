# theopalios.com — personal site

Portfolio + booking site for **Theo Palios** — advisor & speaker on AI in healthcare, founder of
Unicorn Labs / Noetika. A single long-scroll page: bold color-block design, scroll-driven
background morphing, a pinned horizontal work strip, and Google Calendar booking built in.

Built with [Astro](https://astro.build) 7, Tailwind CSS 4, GSAP ScrollTrigger and Lenis.
Ships as a static site in an nginx container on Google Cloud Run (see `DEPLOY.md`).

**Live at [palios.io](https://palios.io)** — Cloud Run service `palios-site`, project
`palios-site`, region `europe-west4`. The service URL
<https://palios-site-671297868122.europe-west4.run.app> also works. See `DEPLOY.md` to redeploy.

## Commands

| Command           | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `npm install`     | Install dependencies                                                |
| `npm run dev`     | Dev server at `http://localhost:4321`                               |
| `npm run build`   | Production build into `dist/`                                       |
| `npm run preview` | Serve the production build locally                                  |
| `npm run shots`   | Visual verification: screenshots + motion/anchor/reduced-motion checks into `.shots/` |
| `npm run themes`  | Renders the site in all four themes and writes comparison sheets to `.shots/` |

## Editing content — no markup required

All copy lives in two places:

- **`src/config.ts`** — your name, meta description, email, booking URLs, social links, theme.
- **`src/data/*.ts`** — services, work/portfolio cards, talk topics, venues, testimonials, stats.

Search the repo for **`TODO(theo)`** to find everything awaiting your confirmation:

- [ ] First bio line in `src/components/About.astro` — finish the Alzheimer's sentence in your words
- [ ] Stats in `src/data/stats.ts` (sourced from noetika.ai — confirm each)
- [ ] Noetika founding year in `src/data/work.ts` (noetika.ai says 2024, LinkedIn says 2023)
- [ ] Talk titles and the "Recent rooms" list in `src/data/talks.ts`
- [ ] Three real testimonials in `src/data/testimonials.ts`
- [ ] `NEWSLETTER.linkedinUrl` in `src/config.ts` — enables the Subscribe buttons
- [ ] X URL in `src/config.ts` (empty links are hidden automatically)
- [ ] Portrait photo — see below

## Your photo

Drop a portrait at **`public/theo.jpg`** (`.png` and `.webp` also work) and it replaces the
"TP" placeholder in the About section automatically — no code change. Portrait crop, ideally
around 800×1000 or larger; the card is 4:5 and the image is centre-cropped to fill it.

## Weak Signals — the weekly newsletter

Every issue is a markdown file in **`src/content/blog/`**. The filename becomes the URL, so
`src/content/blog/signal-vs-noise.md` publishes at `/blog/signal-vs-noise`.

**Weekly workflow** — after publishing on LinkedIn:

1. Copy `src/content/blog/_example-issue.md` to a new file named after the issue.
2. Fill in the frontmatter (`title`, `description`, `pubDate`, optional `linkedin` link to the
   LinkedIn issue, optional `tags`, optional `color`), and remove `draft: true`.
3. Paste the issue body underneath as markdown.
4. Commit and push, then redeploy (`DEPLOY.md`).

The archive lives at `/blog`, the three newest issues appear on the homepage, and `/rss.xml`
is generated automatically. Files starting with `_` or marked `draft: true` never publish.
Images go in `public/blog/` and are referenced as `/blog/name.jpg`.

## Themes

`THEME` in `src/config.ts` restyles the whole site — palettes are defined in
`src/styles/global.css` under `:root[data-theme='…']`:

| Theme | Look |
| ----- | ---- |
| `colorblock` | Saturated blocks on warm paper (current) |
| `editorial` | Restrained and type-led: one accent, two dramatic full-bleed sections |
| `terracotta` | Warm retro-print — clay, teal and mustard on cream |
| `nocturne` | Dark canvas with luminous color blocks |

Run `npm run themes` to regenerate the side-by-side comparison sheets. Sections pick their
colors from `--sec-*` custom properties, so a theme only has to remap those and the palette;
Tailwind utilities (`bg-lime`, `text-ink`, borders, shadows) follow automatically.

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
