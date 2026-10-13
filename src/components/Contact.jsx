import { useSite } from '../context/SiteContext';
import { safeHref, telHref } from '../lib/safe';
import Button from './ui/Button';
import Deco from './ui/Deco';
import Reveal from './ui/Reveal';

export default function Contact() {
  const { profile, contact } = useSite().content;
  return (
    <section id="contact" className="ct">
      <div className="wrap">
        <Deco rotate={-10} parallax=".06" style={{ right: '2%', top: '2%' }}>
          &lt;/&gt;
        </Deco>
        <Deco rotate={0} parallax=".05" style={{ left: '48%', bottom: '30%', color: 'var(--accent2)' }}>
          +
        </Deco>
        <Reveal as="span" className="lab">
          {contact.label}
        </Reveal>
        <Reveal as="h2">
          {contact.line1}
          <br />
          {contact.line2}
          <br />
          <span className="hl">{contact.highlight}</span>
        </Reveal>

        <Reveal className="cl">
          <div>
            <small>Email</small>
            <a className="ln" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </div>
          <div>
            <small>Phone</small>
            <a className="ln" href={telHref(profile.phone)}>
              {profile.phone}
            </a>
          </div>
          <div>
            <small>LinkedIn / GitHub</small>
            <a className="ln" href={safeHref(profile.linkedin)}>
              LinkedIn
            </a>
            {' · '}
            <a className="ln" href={safeHref(profile.github)}>
              GitHub
            </a>
          </div>
          <div>
            <small>Location</small>
            <span>{profile.location}</span>
          </div>
        </Reveal>

        <Reveal as={Button} variant="y" className="big2" href={`mailto:${profile.email}`}>
          {contact.button}
        </Reveal>
      </div>
    </section>
  );
}
