import gsap from 'gsap';
import type Lenis from 'lenis';

/**
 * Infinite outlined-text loop. Scroll velocity (from Lenis) speeds the loop up
 * and skews the track, easing back when scrolling settles.
 */
export function initMarquee(lenis: Lenis | null): void {
  document.querySelectorAll<HTMLElement>('[data-marquee-track]').forEach((track) => {
    const loop = gsap.to(track, {
      xPercent: -50,
      duration: 20,
      ease: 'none',
      repeat: -1,
    });

    if (!lenis) return;
    const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.4, ease: 'power2.out' });

    lenis.on('scroll', () => {
      const v = lenis.velocity; // px per frame-ish; sign = direction
      const speed = gsap.utils.clamp(0.6, 3.5, 1 + Math.abs(v) * 0.05);
      gsap.to(loop, { timeScale: speed, duration: 0.25, overwrite: true });
      skewTo(gsap.utils.clamp(-5, 5, v * 0.12));
    });
  });
}
