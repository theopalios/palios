import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * The signature effect: each section declares data-bg/data-fg, and the page's
 * --bg/--fg custom properties tween to those colors as the section crosses the
 * middle of the viewport. Sections themselves are transparent while motion is
 * on (html.motion), so the whole canvas appears to change color.
 */
export function initThemeMorph(): void {
  document.querySelectorAll<HTMLElement>('[data-bg]').forEach((section) => {
    const bg = section.dataset.bg;
    const fg = section.dataset.fg;
    if (!bg || !fg) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 45%',
      onToggle: (self) => {
        if (!self.isActive) return;
        gsap.to('html', {
          '--bg': bg,
          '--fg': fg,
          duration: 0.7,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      },
    });
  });
}
