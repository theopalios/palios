/**
 * Motion entry point. Everything is gated:
 *  - html.motion is only present when JS runs and the visitor allows motion
 *    (set by an inline script in <head>), so CSS never hides content otherwise.
 *  - gsap.matchMedia reverts/rebuilds effects when preferences or viewport change.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSmoothScroll } from './smooth-scroll';
import { initThemeMorph } from './theme-morph';
import { initReveals } from './reveals';
import { initHero } from './hero';
import { initMarquee } from './marquee';
import { initWorkStrip } from './work-strip';
import { initMagnetic } from './magnetic';

gsap.registerPlugin(ScrollTrigger);

if (document.documentElement.classList.contains('motion')) {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const lenis = initSmoothScroll();
    initThemeMorph();
    initReveals();
    initHero();
    initMarquee(lenis);
    return () => lenis.destroy();
  });

  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
    initWorkStrip();
    initMagnetic();
  });

  // Oversized display type shifts layout when the webfont lands — re-measure once.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
