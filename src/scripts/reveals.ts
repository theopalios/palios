import gsap from 'gsap';

type RevealVariant = '' | 'slide' | 'toss' | 'wipe';

/** Per-variant "from" state; every reveal animates to its natural position. */
function fromVars(el: HTMLElement): gsap.TweenVars {
  const variant = (el.dataset.reveal ?? '') as RevealVariant;
  switch (variant) {
    case 'slide': {
      const dir = Number(el.dataset.dir ?? '1');
      // keep the pre-reveal offset inside the viewport so it never creates
      // horizontal scrollable overflow on small screens
      const dist = Math.min(64, window.innerWidth * 0.045);
      return { x: dist * dir, rotation: 1.5 * dir };
    }
    case 'toss':
      return { y: 64, rotation: gsap.utils.random(-4, 4) };
    case 'wipe':
      return { clipPath: 'inset(100% 0% 0% 0%)' };
    default:
      return { y: 44 };
  }
}

function toVars(el: HTMLElement): gsap.TweenVars {
  const variant = (el.dataset.reveal ?? '') as RevealVariant;
  const to: gsap.TweenVars = { opacity: 1, x: 0, y: 0, duration: 0.85, ease: 'power3.out' };
  if (variant === 'toss') {
    to.rotation = gsap.utils.random(-1.2, 1.2); // settle slightly askew, like thrown cards
  } else if (variant === 'wipe') {
    to.clipPath = 'inset(0% 0% 0% 0%)';
    to.duration = 0.95;
  } else {
    to.rotation = 0;
  }
  return to;
}

/** Clear inline transforms after entrance so CSS :hover transforms can win. */
function clearAfter(el: HTMLElement): void {
  if ((el.dataset.reveal ?? '') === 'toss') return; // keep the askew settle
  gsap.set(el, { clearProps: 'transform,clipPath' });
}

export function initReveals(): void {
  // Grouped reveals: children stagger when the group enters.
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const items = Array.from(group.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!items.length) return;
    gsap.fromTo(
      items,
      {
        x: (i, t) => (fromVars(t as HTMLElement).x as number) ?? 0,
        y: (i, t) => (fromVars(t as HTMLElement).y as number) ?? 0,
        rotation: (i, t) => (fromVars(t as HTMLElement).rotation as number) ?? 0,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: group, start: 'top 78%', once: true },
        onComplete: () => items.forEach(clearAfter),
      },
    );
  });

  // Solo reveals (with per-variant behavior).
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (el.closest('[data-reveal-group]')) return;
    gsap.fromTo(el, fromVars(el), {
      ...toVars(el),
      scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      onComplete: () => clearAfter(el),
    });
  });

  // Stat count-ups.
  document.querySelectorAll<HTMLElement>('[data-counter]').forEach((el) => {
    const target = Number(el.dataset.counter ?? '0');
    const state = { n: 0 };
    gsap.to(state, {
      n: target,
      duration: 1.5,
      ease: 'power1.out',
      snap: { n: 1 },
      scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      onStart: () => {
        el.textContent = '0';
      },
      onUpdate: () => {
        el.textContent = String(Math.round(state.n));
      },
    });
  });
}
