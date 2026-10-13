import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import heroPhoto from '../assets/vivek-hero-wave.webp';
import { useSite } from '../context/SiteContext';
import { trailSymbols } from '../data/content';
import { safeSrc } from '../lib/safe';
import { canUseMouseFx, prefersReducedMotion } from '../utils/media';
import Button from './ui/Button';
import Deco from './ui/Deco';
import SplitText from './ui/SplitText';

const TRAIL_COLORS = ['var(--secondary)', 'var(--accent2)'];
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

/** Eases the portrait's layers toward the pointer and spawns the little code-symbol trail. */
function useHeroMouseFx(portraitRef) {
  const target = useRef({ x: 0, y: 0 });
  const lastTrail = useRef(0);
  const trailId = useRef(0);
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    if (!canUseMouseFx) return undefined;
    let px = 0;
    let py = 0;
    let raf = 0;
    const loop = () => {
      px += (target.current.x - px) * 0.08;
      py += (target.current.y - py) * 0.08;
      const el = portraitRef.current;
      if (el) {
        el.style.setProperty('--px', px.toFixed(3));
        el.style.setProperty('--py', py.toFixed(3));
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [portraitRef]);

  if (!canUseMouseFx) return { handlers: {}, trail: [] };

  const handlers = {
    onMouseMove(e) {
      const r = e.currentTarget.getBoundingClientRect();
      target.current = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };

      const now = Date.now();
      if (now - lastTrail.current < 110) return;
      lastTrail.current = now;
      const id = trailId.current++;
      setTrail((t) => [
        ...t,
        { id, symbol: pick(trailSymbols), color: pick(TRAIL_COLORS), x: e.clientX, y: e.clientY, dx: Math.random() * 70 - 35 },
      ]);
      setTimeout(() => setTrail((t) => t.filter((item) => item.id !== id)), 900);
    },
    onMouseLeave() {
      target.current = { x: 0, y: 0 };
    },
  };

  return { handlers, trail };
}

// Where each sticker floats around the portrait (first three on the left, then right side).
const STICKER_SLOTS = [
  { cls: 'el', r: '-6deg', top: '21%', left: '-14%' },
  { cls: 'el', r: '5deg', top: '41%', left: '-17%' },
  { cls: 'el', r: '-4deg', top: '61%', left: '-9%' },
  { cls: 'er', r: '7deg', top: '33%', right: '-6%' },
  { cls: 'er', r: '-5deg', top: '8%', right: '-4%' },
  { cls: 'er', r: '4deg', top: '56%', right: '-8%' },
];

export default function Hero() {
  const { hero } = useSite().content;
  const portraitRef = useRef(null);
  const [go, setGo] = useState(false);
  const { handlers, trail } = useHeroMouseFx(portraitRef);

  // Headline words slide up once the intro loader has cleared.
  useEffect(() => {
    const t = setTimeout(() => setGo(true), prefersReducedMotion ? 0 : 950);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="hero" {...handlers}>
      <span className="gt" aria-hidden="true">
        {hero.ghost}
      </span>
      <div className="wrap hg">
        <div className="ht">
          <span className="eb">{hero.eyebrow}</span>
          <h1 className={go ? 'go' : undefined}>
            <SplitText>
              {hero.greeting} <br />
              <span className="nm">{hero.name}</span>
            </SplitText>
          </h1>
          <p>{hero.paragraph}</p>
          <div className="cta">
            <Button variant="y" href="#contact">
              {hero.primaryLabel}
            </Button>
            <Button href="#projects">{hero.secondaryLabel}</Button>
            {hero.note && (
              <span className="note">
                <svg viewBox="0 0 70 40" aria-hidden="true">
                  <path d="M66 8C44 2 20 8 8 30M8 30l14-2M8 30l4-13" />
                </svg>
                {hero.note}
              </span>
            )}
          </div>
        </div>

        <div className="hp" ref={portraitRef}>
          <div className="sun" />
          <svg className="arc" viewBox="0 0 100 100" aria-hidden="true">
            <path d="M12 62A42 42 0 0 1 40 14" />
            <path d="M70 90A42 42 0 0 0 92 56" />
          </svg>
          <img className="pimg" src={safeSrc(hero.photo) || heroPhoto} alt={hero.name} />
          {hero.stickers.slice(0, STICKER_SLOTS.length).map((st, i) => {
            const { cls, r, ...pos } = STICKER_SLOTS[i];
            return (
              <span key={i} className={`stk ${cls}${st.yellow ? ' y' : ''}`} style={{ '--r': r, ...pos }}>
                {st.badge && (
                  <i className="lg" style={{ background: st.color }}>
                    {st.badge}
                  </i>
                )}
                {st.label}
              </span>
            );
          })}
          <svg className="spark" viewBox="0 0 60 60" aria-hidden="true">
            <path d="M8 40L24 24M26 54L40 24M44 56L56 38" />
          </svg>
          <Deco rotate={-12} parallax=".08" style={{ left: '4%', top: '2%', fontSize: 'clamp(2.6rem,6vw,4.6rem)' }}>
            &lt;/&gt;
          </Deco>
        </div>
      </div>

      {createPortal(
        trail.map(({ id, symbol, color, x, y, dx }) => (
          <span key={id} className="tr" style={{ left: x, top: y, color, '--dx': `${dx}px` }}>
            {symbol}
          </span>
        )),
        document.body,
      )}
    </section>
  );
}
