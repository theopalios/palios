/**
 * Visual verification harness (`npm run shots`).
 *
 * Builds are NOT run here — run `npm run build` first. The script:
 *  1. serves dist/ via `astro preview`
 *  2. captures full-page + per-section screenshots at 1440×900 and 390×844
 *  3. steps through the pinned Work strip (3 frames) and the page bottom
 *  4. verifies anchor navigation actually reaches each section
 *  5. checks a reduced-motion context renders everything visible and colored
 * Fails (exit 1) on any page error or console error from our own origin.
 */
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync, existsSync } from 'node:fs';

const PORT = 4321;
const BASE = `http://localhost:${PORT}`;
const OUT = '.shots';
const SECTIONS = [
  'top',
  'about',
  'services',
  'work',
  'speaking',
  'writing',
  'testimonials',
  'book',
  'contact',
];

const browsersDir = process.env.PLAYWRIGHT_BROWSERS_PATH ?? '/opt/pw-browsers';
const chromeDir = existsSync(browsersDir)
  ? readdirSync(browsersDir).find((d) => d.startsWith('chromium-'))
  : undefined;
const chromePath = chromeDir ? `${browsersDir}/${chromeDir}/chrome-linux/chrome` : undefined;
if (!chromePath || !existsSync(chromePath)) {
  console.error('No preinstalled Chromium found under /opt/pw-browsers');
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

const problems = [];
const note = (msg) => console.log(`  ${msg}`);

function watchPage(page, label) {
  page.on('pageerror', (err) => problems.push(`[${label}] pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const url = msg.location().url ?? '';
    // Only our own code fails the run; third-party iframe noise is reported.
    if (url === '' || url.includes('localhost')) {
      problems.push(`[${label}] console.error: ${msg.text()}`);
    } else {
      note(`(third-party console.error ignored: ${url.slice(0, 80)})`);
    }
  });
}

async function settled(page, ms = 450) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(ms);
}

async function fullAndSections(page, tag) {
  await page.screenshot({ path: `${OUT}/${tag}-full.png`, fullPage: true });
  for (const id of SECTIONS) {
    const el = page.locator(`#${id}`);
    if ((await el.count()) === 0) {
      problems.push(`[${tag}] missing section #${id}`);
      continue;
    }
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    await el.screenshot({ path: `${OUT}/${tag}-${id}.png` }).catch((e) => {
      problems.push(`[${tag}] screenshot of #${id} failed: ${e.message}`);
    });
  }
}

async function workScrollFrames(page, tag) {
  // approach the pin from above, like a real scroll-through
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const info = await page.evaluate(() => {
    const section = document.querySelector('[data-work]');
    const track = document.querySelector('[data-work-track]');
    const viewport = document.querySelector('[data-work-viewport]');
    if (!section || !track || !viewport) return null;
    const rect = section.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      distance: Math.max(0, track.scrollWidth - viewport.clientWidth),
    };
  });
  if (!info) {
    problems.push(`[${tag}] work strip elements not found`);
    return;
  }
  for (const f of [0.15, 0.5, 0.95]) {
    await page.evaluate((y) => window.scrollTo(0, y), info.top + info.distance * f);
    await page.waitForTimeout(650);
    await page.screenshot({ path: `${OUT}/${tag}-work-scroll-${Math.round(f * 100)}.png` });
  }
}

async function bottomFrame(page, tag) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/${tag}-bottom.png` });
}

async function waitForScrollSettle(page) {
  await page
    .waitForFunction(
      () =>
        new Promise((res) => {
          const y1 = window.scrollY;
          setTimeout(() => res(Math.abs(window.scrollY - y1) < 0.5), 250);
        }),
      { polling: 300, timeout: 8000 },
    )
    .catch(() => {});
}

/** Scroll back to top the way a user would (wheel), so Lenis + nav logic run. */
async function wheelToTop(page) {
  await page.mouse.move(720, 450);
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel(0, -3500);
    await page.waitForTimeout(70);
    if ((await page.evaluate(() => window.scrollY)) < 2) break;
  }
}

async function anchorNav(page, tag) {
  for (const [link, target] of [
    ['a[href="/#about"]', '#about'],
    ['a[href="/#work"]', '#work'],
    ['a[href="/#speaking"]', '#speaking'],
    ['a[href="/#book"]', '#book'],
  ]) {
    await waitForScrollSettle(page);
    await wheelToTop(page);
    await waitForScrollSettle(page);
    await page.waitForTimeout(500); // nav reveal transition
    try {
      await page.locator(`nav ${link}, header ${link}`).first().click({ timeout: 5000 });
    } catch (e) {
      problems.push(`[${tag}] could not click ${link}: ${String(e).split('\n')[0]}`);
      continue;
    }
    const reached = await page
      .waitForFunction(
        (sel) => {
          const r = document.querySelector(sel)?.getBoundingClientRect();
          return r && r.top < window.innerHeight * 0.9 && r.bottom > 0;
        },
        target,
        { timeout: 5000 },
      )
      .then(() => true)
      .catch(() => false);
    if (!reached) problems.push(`[${tag}] anchor ${target} did not reach the viewport`);
    await waitForScrollSettle(page);
  }
}

async function reducedMotionAudit(page, tag) {
  const audit = await page.evaluate(() => {
    const out = { hiddenCount: 0, aboutBg: '', heroVisible: false };
    document.querySelectorAll('[data-reveal], .hero-line-inner, [data-hero-sub]').forEach((el) => {
      const cs = getComputedStyle(el);
      // deliberate opacity-XX utilities are fine; reveal-hidden means ~0
      if (Number(cs.opacity) < 0.1 || cs.visibility === 'hidden') out.hiddenCount++;
    });
    // Without motion, sections must paint their own themed background rather
    // than relying on the body morph — compare against the active theme's token.
    const about = document.querySelector('#about');
    if (about) {
      out.aboutBg = getComputedStyle(about).backgroundColor;
      const probe = document.createElement('div');
      probe.style.backgroundColor = 'var(--sec-about-bg)';
      document.body.appendChild(probe);
      out.expectedBg = getComputedStyle(probe).backgroundColor;
      probe.remove();
    }
    const h1 = document.querySelector('h1');
    if (h1) out.heroVisible = h1.getBoundingClientRect().height > 0;
    return out;
  });
  if (audit.hiddenCount > 0) problems.push(`[${tag}] ${audit.hiddenCount} elements hidden without motion`);
  if (audit.aboutBg !== audit.expectedBg) {
    problems.push(`[${tag}] #about static background is ${audit.aboutBg}, expected ${audit.expectedBg}`);
  }
  if (!audit.heroVisible) problems.push(`[${tag}] hero headline not visible`);
  await page.screenshot({ path: `${OUT}/${tag}-full.png`, fullPage: true });
}

// --- boot preview server -----------------------------------------------------
const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
  stdio: 'ignore',
  detached: false,
});
process.on('exit', () => server.kill());

let up = false;
for (let i = 0; i < 60 && !up; i++) {
  up = await fetch(BASE)
    .then((r) => r.ok)
    .catch(() => false);
  if (!up) await new Promise((r) => setTimeout(r, 500));
}
if (!up) {
  console.error('astro preview did not come up on :4321');
  process.exit(1);
}

const browser = await chromium.launch({ executablePath: chromePath });

// Desktop
console.log('desktop 1440×900');
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  watchPage(page, 'desktop');
  await page.goto(BASE, { waitUntil: 'load' });
  await settled(page);
  await fullAndSections(page, 'desktop');
  await workScrollFrames(page, 'desktop');
  await bottomFrame(page, 'desktop');
  await anchorNav(page, 'desktop');
  await ctx.close();
}

// Mobile
console.log('mobile 390×844');
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  watchPage(page, 'mobile');
  await page.goto(BASE, { waitUntil: 'load' });
  await settled(page);
  await fullAndSections(page, 'mobile');
  await bottomFrame(page, 'mobile');
  await ctx.close();
}

// Reduced motion
console.log('reduced motion 1440×900');
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  watchPage(page, 'reduced');
  await page.goto(BASE, { waitUntil: 'load' });
  await settled(page);
  await reducedMotionAudit(page, 'reduced');
  await ctx.close();
}

await browser.close();
server.kill();

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(' - ' + p);
  process.exit(1);
}
console.log('\nAll checks passed. Screenshots in ' + OUT + '/');
