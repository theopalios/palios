import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * The signature effect: each section declares data-bg/data-fg, and the page's
 * --bg/--fg custom properties tween to those colors as the section reaches the
 * middle of the viewport. Sections themselves are transparent while motion is
 * on (html.motion), so the whole canvas appears to change color.
 *
 * The active section is derived from live getBoundingClientRect() on every
 * scroll update (rather than per-section enter/leave toggles), so it stays
 * correct across instant jumps (End key, hash loads) and pinned sections.
 */
export function initThemeMorph(): void {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-bg]'));
  if (!sections.length) return;

  let currentBg = '';
  const apply = () => {
    const midY = window.innerHeight * 0.5;
    // Last section (in document order) whose top has crossed the viewport middle.
    let active = sections[0];
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= midY) active = s;
      else break;
    }
    const { bg, fg } = active.dataset;
    if (!bg || !fg || bg === currentBg) return;
    currentBg = bg;
    gsap.to('html', { '--bg': bg, '--fg': fg, duration: 0.7, ease: 'power2.out', overwrite: 'auto' });
  };

  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: apply });
  apply();
}
