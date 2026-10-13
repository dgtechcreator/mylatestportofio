import { useEffect, useRef, useState } from 'react';
import { canUseMouseFx } from '../utils/media';
import { cn } from '../utils/cn';

const INTERACTIVE = 'a,button,.pc,.btn,.stk';

/** Dot + lagging ring cursor. Grows over interactive elements and reads "VIEW" over project cards. */
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [hover, setHover] = useState({ big: false, label: '' });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('cur');

    let mx = -100;
    let my = -100;
    let x = -100;
    let y = -100;
    let raf = 0;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.current.style.transform = `translate(${mx}px,${my}px)`;
    };
    const onOver = (e) => {
      const t = e.target.closest?.(INTERACTIVE);
      setHover({ big: !!t, label: t?.classList.contains('pc') ? 'VIEW' : '' });
    };
    const loop = () => {
      x += (mx - x) * 0.18;
      y += (my - y) * 0.18;
      ring.current.style.transform = `translate(${x}px,${y}px)`;
      raf = requestAnimationFrame(loop);
    };

    addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    loop();

    return () => {
      root.classList.remove('cur');
      removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="cd" ref={dot} />
      <div className={cn('cr', hover.big && 'big')} ref={ring}>
        {hover.label}
      </div>
    </>
  );
}

export default function CustomCursor() {
  return canUseMouseFx ? <Cursor /> : null;
}
