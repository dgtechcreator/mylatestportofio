import { useRef } from 'react';
import { useRafScroll } from '../hooks/useRafScroll';

/** Thin gradient bar at the top showing page scroll progress. */
export default function ProgressBar() {
  const ref = useRef(null);

  useRafScroll(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    ref.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  });

  return <div className="pb" ref={ref} />;
}
