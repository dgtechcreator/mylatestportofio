import { useSite } from '../context/SiteContext';
import { safeHref, safeSrc } from '../lib/safe';
import { canUseMouseFx } from '../utils/media';
import SectionHead from './SectionHead';
import Button from './ui/Button';
import Deco from './ui/Deco';
import Reveal from './ui/Reveal';

/** 3D tilt + glare that follow the pointer over a card. */
const tilt = {
  onMouseMove(e) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const a = (e.clientX - r.left) / r.width - 0.5;
    const b = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${a * 9}deg`);
    el.style.setProperty('--rx', `${-b * 9}deg`);
    el.style.setProperty('--gx', `${(a + 0.5) * 100}%`);
    el.style.setProperty('--gy', `${(b + 0.5) * 100}%`);
  },
  onMouseLeave(e) {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  },
};

// Odd/even cards enter slightly staggered.
const staggerDelay = (index) => `${(index % 2) * 0.14}s`;

function ProjectCard({ project, index, linkLabel }) {
  const { tag, abbr, glyph, title, desc, stack, rotate, tint, note, href, image } = project;
  const no = String(index + 1).padStart(2, '0');
  const img = safeSrc(image);
  return (
    <Reveal
      as="article"
      className="pc"
      style={{ '--r': `${Number(rotate) || 0}deg`, '--rd': staggerDelay(index) }}
      {...(canUseMouseFx && tilt)}
    >
      <div className="pn">
        {no} <span>{tag}</span>
      </div>
      <div className={img ? 'pv has-img' : 'pv'} style={tint ? { '--t': tint } : undefined}>
        {img ? (
          <img src={img} alt={title} loading="lazy" />
        ) : (
          <>
            <b>{abbr}</b>
            <i>{glyph}</i>
          </>
        )}
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <div className="sk">{stack}</div>
      <a className="go ln" href={safeHref(href)}>
        {linkLabel}
      </a>
      {note && <span className="note">{note}</span>}
    </Reveal>
  );
}

export default function Projects() {
  const { projects } = useSite().content;
  const { more } = projects;
  return (
    <section id="projects">
      <div className="wrap">
        <Deco rotate={10} parallax=".05" style={{ right: 0, top: 0, fontSize: 'clamp(2.4rem,5vw,4rem)' }}>
          {'{ }'}
        </Deco>
        <SectionHead label={projects.label} title={projects.title} />
        <div className="pg">
          {projects.items.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} linkLabel={projects.linkLabel} />
          ))}
          {more.show && (
            <Reveal as="article" className="pc mo" style={{ '--rd': staggerDelay(projects.items.length) }}>
              <div>
                <div className="pn" style={{ gap: 14, justifyContent: 'flex-start' }}>
                  {more.range} <span style={{ color: 'var(--accent)' }}>{more.badge}</span>
                </div>
                <h3>{more.title}</h3>
                <p>{more.desc}</p>
              </div>
              <Button variant="y" href="#contact">
                {more.button}
              </Button>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
