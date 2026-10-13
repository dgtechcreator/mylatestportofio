import { useRef, useState } from 'react';
import { useSite } from '../context/SiteContext';
import { useRafScroll } from '../hooks/useRafScroll';
import { cn } from '../utils/cn';
import SectionHead from './SectionHead';
import Deco from './ui/Deco';
import Reveal from './ui/Reveal';

export default function Experience() {
  const { experience } = useSite().content;
  const timeline = useRef(null);
  const [reached, setReached] = useState(0);

  // Fills the timeline line and lights up each dot as it passes ~60% of the viewport.
  useRafScroll(() => {
    const tl = timeline.current;
    const rect = tl.getBoundingClientRect();
    tl.style.setProperty('--tp', Math.min(1, Math.max(0, (innerHeight * 0.6 - rect.top) / rect.height)));
    const count = [...tl.children].filter((item) => item.getBoundingClientRect().top < innerHeight * 0.62).length;
    setReached(count);
  });

  return (
    <section id="experience">
      <div className="wrap">
        <Deco rotate={-6} parallax=".06" style={{ right: '4%', top: '6%' }}>
          &lt; /&gt;
        </Deco>
        <SectionHead label={experience.label} title={experience.title} />
        <div className="tl" ref={timeline}>
          {experience.items.map(({ year, title, desc }, i) => (
            <Reveal key={i} className={cn('ti', i < reached && 'on')}>
              <div className="yr">{year}</div>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
