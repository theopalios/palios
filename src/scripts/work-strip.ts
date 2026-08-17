import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Desktop-only: pin the Work section and scrub the card track horizontally.
 * On mobile (and reduced motion) the strip is a native snap-scroll list.
 */
export function initWorkStrip(): void {
  const section = document.querySelector<HTMLElement>('[data-work]');
  if (!section) return;
  const track = section.querySelector<HTMLElement>('[data-work-track]');
  const viewport = section.querySelector<HTMLElement>('[data-work-viewport]');
  if (!track || !viewport) return;

  const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

  const scrub = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => '+=' + distance(),
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  gsap.to('[data-work-progress]', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => '+=' + distance(),
      scrub: true,
    },
  });

  // Card index numbers drift against the strip for a bit of depth.
  section.querySelectorAll<HTMLElement>('[data-card-num]').forEach((num) => {
    const card = num.closest<HTMLElement>('.work-card');
    if (!card) return;
    gsap.fromTo(
      num,
      { xPercent: 45 },
      {
        xPercent: -45,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          containerAnimation: scrub,
          start: 'left right',
          end: 'right left',
          scrub: true,
        },
      },
    );
  });
}
