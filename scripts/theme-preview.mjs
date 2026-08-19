/**
 * Design-option contact sheets (`npm run themes`).
 * Renders the site under each theme in src/styles/global.css and stitches the
 * results into labelled 2×2 comparison images in .shots/.
 * Run `npm run build` first.
 */
import { chromium } from 'playwright-core';
import { spawn, execSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';

const CONFIG = 'src/config.ts';
const originalConfig = readFileSync(CONFIG, 'utf8');
/** Rebuild the real site with a theme baked in — scripts read palette colors at
 *  init, so a runtime attribute swap would not reproduce the true render. */
function buildWithTheme(id) {
  writeFileSync(
    CONFIG,
    originalConfig.replace(
      /export const THEME: [^=]+= '[^']*';/,
      (m) => m.replace(/= '[^']*';/, `= '${id}';`),
    ),
  );
  execSync('npx astro build', { stdio: 'ignore' });
}
process.on('exit', () => writeFileSync(CONFIG, originalConfig));

const PORT = 4321;
const BASE = `http://localhost:${PORT}`;
const OUT = '.shots';

const THEMES = [
  { id: 'colorblock', label: 'A · Color Block', note: 'current — saturated blocks on warm paper' },
  { id: 'editorial', label: 'B · Editorial', note: 'restrained, type-led, one accent' },
  { id: 'terracotta', label: 'C · Terracotta', note: 'warm retro-print, earthy blocks' },
  { id: 'nocturne', label: 'D · Nocturne', note: 'dark canvas, luminous blocks' },
];

const browsersDir = process.env.PLAYWRIGHT_BROWSERS_PATH ?? '/opt/pw-browsers';
const chromeDir = existsSync(browsersDir)
  ? readdirSync(browsersDir).find((d) => d.startsWith('chromium-'))
  : undefined;
const chromePath = chromeDir ? `${browsersDir}/${chromeDir}/chrome-linux/chrome` : undefined;
if (!chromePath || !existsSync(chromePath)) {
  console.error('No preinstalled Chromium found under ' + browsersDir);
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
process.on('exit', () => server.kill());
let up = false;
for (let i = 0; i < 60 && !up; i++) {
  up = await fetch(BASE)
    .then((r) => r.ok)
    .catch(() => false);
  if (!up) await new Promise((r) => setTimeout(r, 500));
}
if (!up) {
  console.error('astro preview did not start');
  process.exit(1);
}

const browser = await chromium.launch({ executablePath: chromePath });

async function shoot(theme, what) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);

  const path = `${OUT}/theme-${theme.id}-${what}.png`;
  if (what === 'hero') {
    await page.waitForTimeout(900); // let the hero intro timeline settle
    await page.screenshot({ path });
  } else {
    const el = page.locator(`#${what}`);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1100);
    await el.screenshot({ path });
  }
  await ctx.close();
  return path;
}

/** Stitch four labelled panels into one comparison image. */
async function contactSheet(paths, title, outFile) {
  const panels = THEMES.map((t, i) => {
    const b64 = readFileSync(paths[i]).toString('base64');
    return `<figure>
        <img src="data:image/png;base64,${b64}" alt="${t.label}" />
        <figcaption><strong>${t.label}</strong><span>${t.note}</span></figcaption>
      </figure>`;
  }).join('');

  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#e9e6e0;font-family:ui-sans-serif,system-ui,sans-serif;padding:28px}
    h1{font-size:26px;margin-bottom:6px;color:#16141a}
    p.sub{font-size:15px;color:#5a564f;margin-bottom:22px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:22px}
    figure{background:#fff;border:2px solid #16141a;border-radius:14px;overflow:hidden;box-shadow:5px 5px 0 #16141a}
    img{display:block;width:100%;height:auto}
    figcaption{padding:10px 14px;border-top:2px solid #16141a;display:flex;gap:10px;align-items:baseline;font-size:15px;color:#16141a}
    figcaption span{font-size:13px;color:#5a564f}
  </style></head><body>
    <h1>${title}</h1>
    <p class="sub">Same site, same content — four palettes. Switch with one line: <code>THEME</code> in src/config.ts</p>
    <div class="grid">${panels}</div>
  </body></html>`;

  const ctx = await browser.newContext({ viewport: { width: 1500, height: 1200 } });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(300);
  await page.screenshot({ path: outFile, fullPage: true });
  await ctx.close();
}

const targets = process.argv[2] ? [process.argv[2]] : ['hero', 'services', 'writing'];
const shots = {}; // what → [path per theme]

// One build per theme, then capture every target from that build.
for (const theme of THEMES) {
  buildWithTheme(theme.id);
  for (const what of targets) {
    (shots[what] ??= []).push(await shoot(theme, what));
    console.log(`  ${theme.id} · ${what}`);
  }
}

for (const what of targets) {
  await contactSheet(shots[what], `Design options — ${what}`, `${OUT}/themes-${what}.png`);
  console.log(`→ ${OUT}/themes-${what}.png`);
}

writeFileSync(CONFIG, originalConfig);
execSync('npx astro build', { stdio: 'ignore' }); // restore dist to the real theme

await browser.close();
server.kill();
console.log('done');
