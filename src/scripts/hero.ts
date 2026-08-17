import gsap from 'gsap';
import { splitChars } from './split';

/**
 * Hero: a load timeline (eyebrow → masked line rises → accent color roll →
 * sub + CTAs), infinite blob drift, and scroll parallax as the hero exits.
 */
export function initHero(): void {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;

  const lines = hero.querySelectorAll<HTMLElement>('.hero-line-inner');
  const accent = hero.querySelector<HTMLElement>('[data-hero-accent]');
  const chars = accent ? splitChars(accent) : [];

  gsap.set(lines, { yPercent: 110, opacity: 1 });

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.fromTo(
    '[data-hero-eyebrow]',
    { y: 18 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    0.1,
  )
    .to(lines, { yPercent: 0, duration: 0.95, stagger: 0.09 }, 0.25)
    .to(
      chars,
      {
        keyframes: [
          { color: '#f2409b' },
          { color: '#ff4d24' },
          { color: '#2b3ff3' },
        ],
        duration: 0.9,
        stagger: 0.06,
        ease: 'none',
      },
      0.7,
    )
    .fromTo(
      '[data-hero-sub]',
      { y: 28, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.65 },
      '-=0.55',
    )
    .fromTo(
      '[data-hero-cta]',
      { y: 22, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08 },
      '-=0.4',
    );

  // Infinite gentle drift (inner element — the parallax wrapper owns scroll y).
  hero.querySelectorAll<HTMLElement>('[data-blob]').forEach((blob, i) => {
    gsap.to(blob, {
      y: gsap.utils.random(-22, 22),
      rotation: gsap.utils.random(-10, 10),
      duration: 7 + i * 1.4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
  });

  // Scroll parallax: wrappers move at their data-speed as the hero leaves.
  hero.querySelectorAll<HTMLElement>('[data-blob-wrap]').forEach((wrap) => {
    const speed = Number(wrap.dataset.speed ?? '1');
    gsap.to(wrap, {
      y: -110 * speed,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  });

  // Content gently recedes while scrolling away.
  gsap.to('[data-hero-content]', {
    y: 90,
    opacity: 0.3,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
}
