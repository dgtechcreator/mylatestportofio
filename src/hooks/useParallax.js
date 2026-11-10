import { useEffect } from 'react';
import { prefersReducedMotion } from '../utils/media';

/**
 * Scroll parallax for every `[data-plx="speed"]` element.
 *
 * Each frame the element's distance from the viewport centre is multiplied by `speed` and written
 * to `--plx` (px). Positive speeds lag behind the page (feels far away), negative ones run ahead
 * (feels close). Scroll is eased so layers glide instead of snapping. CSS decides what `--plx`
 * moves (see `[data-plx]` in main.css), so it never fights the reveal animations.
 */
export function useParallax() {
  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    let smooth = scrollY;
    let raf = 0;
    const applied = new WeakMap();

    const tick = () => {
      const target = scrollY;
      smooth += (target - smooth) * 0.14;
      const settled = Math.abs(target - smooth) < 0.2;
      if (settled) smooth = target;
      const lag = target - smooth; // how far behind the real scroll the eased value is

      const els = document.querySelectorAll('[data-plx]');
      const mid = innerHeight / 2;
      // Read everything first, then write — avoids layout thrash.
      const reads = [];
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -400 || r.top > innerHeight + 400) continue;
        reads.push([el, r.top + r.height / 2 - (applied.get(el) || 0) - mid, r]);
      }
      for (const [el, offset] of reads) {
        const speed = Number(el.dataset.plx) || 0;
        const shift = Math.round((-(offset + lag) * speed) * 10) / 10;
        applied.set(el, shift);
        el.style.setProperty('--plx', shift);
      }
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', kick);
    // Content (reveals, images, admin edits) appears over time — keep the layers in sync.
    const mo = new MutationObserver(kick);
    mo.observe(document.body, { childList: true, subtree: true });
    kick();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('scroll', kick);
      removeEventListener('resize', kick);
      mo.disconnect();
    };
  }, []);
}
