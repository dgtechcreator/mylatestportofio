import polaroid from '../assets/vivek-polaroid.jpeg';
import { useSite } from '../context/SiteContext';
import { safeSrc } from '../lib/safe';
import Counter from './ui/Counter';
import Deco from './ui/Deco';
import DrawSvg from './ui/DrawSvg';
import Reveal from './ui/Reveal';

export default function About() {
  const { about, profile } = useSite().content;
  return (
    <section id="about">
      <div className="wrap">
        <Deco rotate={12} parallax=".07" style={{ right: '2%', top: '-2%' }}>
          #
        </Deco>

        <div className="ab">
          <div className="abl">
            <Reveal as="span" className="lab">
              {about.label}
            </Reveal>
            <Reveal as="h2" className="st2">
              {about.headingPre}{' '}
              <span className="circ">
                <em>{about.headingEm}</em>
                <DrawSvg symbol="ci" viewBox="0 0 400 90" preserveAspectRatio="none" />
              </span>
            </Reveal>
            <Reveal className="abt">
              {about.paragraphs.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
              <div className="chips">
                {about.chips.map((chip, i) => (
                  <span key={i}>{chip}</span>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="abr">
            <Reveal className="ap">
              <figure className="pol">
                <img src={safeSrc(about.photo) || polaroid} alt={profile.name} />
                <figcaption>{about.caption}</figcaption>
              </figure>
            </Reveal>
            <Reveal className="nums">
              {about.stats.map(({ value, label }, i) => (
                <div key={i}>
                  <Counter value={value} />
                  <span>{label}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
