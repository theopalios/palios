import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/**
 * Lenis ⇄ GSAP wiring (the canonical pattern): Lenis drives scroll, GSAP's
 * ticker drives Lenis, ScrollTrigger listens to Lenis.
 */
export function initSmoothScroll(): Lenis {
  const lenis = new Lenis({ lerp: 0.11 });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Anchor navigation goes through Lenis so it glides (and lands correctly
  // even past pinned sections, whose spacers are part of the document flow).
  // Handles both "#work" and cross-page "/#work" — the latter only when the
  // target section exists on the page we are already on, otherwise the browser
  // navigates normally.
  document.querySelectorAll<HTMLAnchorElement>('a[href*="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname) return;
      if (!url.hash || url.hash.length <= 1) return;
      const target = document.querySelector<HTMLElement>(url.hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: url.hash === '#top' ? 0 : -12, duration: 1.4 });
    });
  });

  // Nav: hide when scrolling down, reveal when scrolling up; solid once scrolled.
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (nav) {
    let lastY = 0;
    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      nav.classList.toggle('nav-scrolled', scroll > 60);
      nav.classList.toggle('nav-hidden', scroll > lastY && scroll > 180);
      lastY = scroll;
    });
  }

  return lenis;
}
