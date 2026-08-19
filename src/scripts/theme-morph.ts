import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Resolve a custom property to a concrete color, following var() chains
 * (--sec-about-bg → var(--color-cobalt) → #2b3ff3). GSAP needs a real color
 * value to tween, and the indirection is what makes themes swappable.
 */
function resolveColor(name: string): string {
  const cs = getComputedStyle(document.documentElement);
  let value = cs.getPropertyValue(name).trim();
  for (let i = 0; i < 5 && value.startsWith('var('); i++) {
    const inner = value.slice(4, value.indexOf(')')).trim();
    value = cs.getPropertyValue(inner).trim();
  }
  return value;
}

/**
 * The signature effect: each section declares which palette slot it wears
 * (data-sec="about"), and the page's --bg/--fg tween to that section's colors
 * as it reaches the middle of the viewport. Sections are transparent while
 * motion is on (html.motion), so the whole canvas appears to change color.
 *
 * The active section is derived from live getBoundingClientRect() on every
 * scroll update (rather than per-section enter/leave toggles), so it stays
 * correct across instant jumps (End key, hash loads) and pinned sections.
 */
export function initThemeMorph(): void {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-sec]'));
  if (!sections.length) return;

  const colors = new Map<HTMLElement, { bg: string; fg: string }>();
  const readColors = () => {
    colors.clear();
    for (const s of sections) {
      const key = s.dataset.sec;
      if (!key) continue;
      colors.set(s, { bg: resolveColor(`--sec-${key}-bg`), fg: resolveColor(`--sec-${key}-fg`) });
    }
  };
  readColors();

  let currentBg = '';
  const apply = () => {
    const midY = window.innerHeight * 0.5;
    // Last section (in document order) whose top has crossed the viewport middle.
    let active = sections[0];
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= midY) active = s;
      else break;
    }
    const pair = colors.get(active);
    if (!pair || !pair.bg || pair.bg === currentBg) return;
    currentBg = pair.bg;
    gsap.to('html', {
      '--bg': pair.bg,
      '--fg': pair.fg,
      duration: 0.7,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: apply });
  apply();

  // Live theme switching (used by the design-preview harness).
  new MutationObserver(() => {
    readColors();
    currentBg = '';
    apply();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
