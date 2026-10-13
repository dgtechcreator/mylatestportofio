import { useSite } from '../context/SiteContext';
import { canUseMouseFx } from '../utils/media';
import SectionHead from './SectionHead';
import Deco from './ui/Deco';
import Reveal from './ui/Reveal';

/** Spotlight follows the pointer across the dark section. */
const spotlight = (e) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
};

export default function Skills() {
  const { skills } = useSite().content;
  return (
    <section id="skills" {...(canUseMouseFx && { onMouseMove: spotlight })}>
      <div className="wrap">
        <Deco rotate={-8} parallax=".06" style={{ left: '46%', top: '-2%' }}>
          =&gt;
        </Deco>
        <SectionHead label={skills.label} title={skills.title} />
        <div className="sg">
          {skills.categories.map(({ title, items }, c) => (
            <Reveal key={c} className="cat">
              <h4>{title}</h4>
              <ul>
                {items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
