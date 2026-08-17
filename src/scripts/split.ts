/**
 * Tiny DIY text splitter (SplitText stays out of the bundle).
 * Wraps each character in an inline-block span; screen readers keep the
 * original text via aria-label on the parent, chars are aria-hidden.
 */
export function splitChars(el: HTMLElement): HTMLSpanElement[] {
  const text = el.textContent ?? '';
  el.setAttribute('aria-label', text);
  el.textContent = '';
  return [...text].map((ch) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch === ' ' ? ' ' : ch;
    span.setAttribute('aria-hidden', 'true');
    el.appendChild(span);
    return span;
  });
}
