import { useEffect, useRef } from 'react';

/**
 * Calls `callback` at most once per animation frame while the page scrolls
 * (and once immediately on mount).
 */
export function useRafScroll(callback) {
  const cb = useRef(callback);
  cb.current = callback;

  useEffect(() => {
    let ticking = false;
    const run = () => {
      ticking = false;
      cb.current();
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(run);
      }
    };
    addEventListener('scroll', onScroll, { passive: true });
    run();
    return () => removeEventListener('scroll', onScroll);
  }, []);
}
