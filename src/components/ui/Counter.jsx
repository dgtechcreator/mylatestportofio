import { useEffect, useRef, useState } from 'react';

const DURATION = 1200;

/** Counts up from 0 to a value like "3+" (number + optional suffix) when scrolled into view. */
export default function Counter({ value }) {
  const text = String(value ?? '');
  const target = parseInt(text, 10);
  const suffix = text.replace(/\d/g, '');
  const ref = useRef(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const el = ref.current;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      let start = null;
      const step = (ts) => {
        start = start ?? ts;
        const p = Math.min((ts - start) / DURATION, 1);
        setCurrent(Math.round(target * (1 - (1 - p) ** 3)));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target]);

  if (Number.isNaN(target)) return <b>{text}</b>;

  return (
    <b ref={ref}>
      {current}
      {suffix}
    </b>
  );
}
