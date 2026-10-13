import { useState } from 'react';
import { useRafScroll } from '../hooks/useRafScroll';
import { cn } from '../utils/cn';

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useRafScroll(() => setShow(scrollY > 600));

  return (
    <button
      type="button"
      className={cn('top', show && 'show')}
      aria-label="Back to top"
      onClick={() => scrollTo({ top: 0 })}
    >
      ↑
    </button>
  );
}
