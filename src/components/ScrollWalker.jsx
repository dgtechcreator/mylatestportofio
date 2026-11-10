import { useEffect, useRef, useState } from 'react';
import { useRafScroll } from '../hooks/useRafScroll';

/** Limb drawn twice (dark outline under the coloured stroke) to match the page's thick-outline look. */
const Limb = ({ d }) => (
  <>
    <path className="o" d={d} />
    <path className="i" d={d} />
  </>
);

const STOPS = [
  ['top', 'Top'],
  ['about', 'About'],
  ['skills', 'Skills'],
  ['projects', 'Projects'],
  ['experience', 'Experience'],
  ['contact', 'Contact'],
];

/**
 * Custom scrollbar: a little developer walks down the path as you scroll, turns around and
 * walks back up when you scroll up. Drag him (or click the path) to jump; dots mark the sections.
 */
export default function ScrollWalker() {
  const track = useRef(null);
  const walker = useRef(null);
  const last = useRef(0);
  const idle = useRef(0);
  const dragging = useRef(false);
  const [stops, setStops] = useState([]);

  // Position, direction and "is walking" state — written straight to the DOM (no re-render per frame).
  useRafScroll(() => {
    const el = track.current;
    if (!el) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    el.style.setProperty('--p', p.toFixed(4));
    if (walker.current) walker.current.firstChild.dataset.pct = `${Math.round(p * 100)}%`;
    const delta = scrollY - last.current;
    last.current = scrollY;
    if (Math.abs(delta) > 0.5) {
      el.dataset.dir = delta > 0 ? 'down' : 'up';
      el.classList.add('walking');
      clearTimeout(idle.current);
      idle.current = setTimeout(() => el.classList.remove('walking'), 160);
    }
  });

  // Section markers along the path.
  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (max <= 0) return setStops([]);
      setStops(
        STOPS.map(([id, label]) => {
          const target = id === 'top' ? 0 : document.getElementById(id)?.offsetTop - 80;
          return target === undefined || Number.isNaN(target) ? null : { id, label, at: Math.min(1, Math.max(0, target / max)) };
        }).filter(Boolean),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  // Drag the walker / click the path to scroll there.
  const jump = (e) => {
    const rect = track.current.getBoundingClientRect();
    const pad = 30;
    const p = Math.min(1, Math.max(0, (e.clientY - rect.top - pad) / (rect.height - pad * 2)));
    const max = document.documentElement.scrollHeight - innerHeight;
    scrollTo({ top: p * max, behavior: 'instant' });
  };
  const onDown = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    track.current.classList.add('drag');
    jump(e);
  };
  const onMove = (e) => dragging.current && jump(e);
  const onUp = () => {
    dragging.current = false;
    track.current?.classList.remove('drag');
  };

  return (
    <div className="sw" ref={track} data-dir="down" aria-hidden="true">
      <div className="sw-path" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <i className="sw-fill" />
        {stops.map(({ id, label, at }) => (
          <button
            key={id}
            type="button"
            tabIndex={-1}
            className="sw-stop"
            style={{ '--at': at }}
            data-label={label}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => scrollTo({ top: id === 'top' ? 0 : document.getElementById(id).offsetTop - 80, behavior: 'smooth' })}
          />
        ))}
        <div className="sw-man" ref={walker}>
          <span className="sw-pct" />
          <svg viewBox="0 0 40 60" width="32" height="48">
            <g className="arm l">
              <Limb d="M13 27L9 39" />
            </g>
            <g className="arm r">
              <Limb d="M27 27L31 39" />
            </g>
            <g className="leg l">
              <Limb d="M16.5 38V52" />
              <ellipse className="shoe" cx="16.5" cy="54" rx="4.2" ry="2.6" />
            </g>
            <g className="leg r">
              <Limb d="M23.5 38V52" />
              <ellipse className="shoe" cx="23.5" cy="54" rx="4.2" ry="2.6" />
            </g>
            <g className="torso">
              <rect className="pack" x="10.5" y="23" width="19" height="15" rx="3" />
              <rect className="shirt" x="13" y="22" width="14" height="18" rx="3" />
              <circle className="skin" cx="20" cy="13" r="8" />
              <path className="cap" d="M12 12a8 8 0 0 1 16 0z" />
              <path className="brim" d="M14 12.5H26" />
              <circle className="hair" cx="20" cy="13" r="8.2" />
              <g className="face">
                <circle className="eye" cx="16.8" cy="15" r="1.3" />
                <circle className="eye" cx="23.2" cy="15" r="1.3" />
                <path className="smile" d="M17.5 18.2Q20 20.4 22.5 18.2" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
