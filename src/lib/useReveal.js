import { useEffect } from 'react';

/**
 * Adds `is-visible` to every `.reveal` element as it scrolls into view.
 * Waits until `enabled` (the envelope is open) so first-screen animations aren't missed.
 */
export function useReveal(enabled, deps = []) {
  useEffect(() => {
    if (!enabled) return undefined;
    const els = document.querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);
}
