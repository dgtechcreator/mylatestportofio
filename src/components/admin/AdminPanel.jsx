import { useState } from 'react';
import heroPhoto from '../../assets/vivek-hero-wave.webp';
import polaroid from '../../assets/vivek-polaroid.jpeg';
import { useSite } from '../../context/SiteContext';
import { api } from '../../lib/api';
import { Check, Color, Field, ImageInput, ItemList, Strings, Text } from './fields';

const TINTS = [
  ['', 'Yellow (default)'],
  ['var(--accent2)', 'Orange'],
  ['#d6d4fb', 'Lilac'],
  ['var(--card)', 'Cream'],
];

const TABS = [
  ['hero', 'Header & Hero'],
  ['marquee', 'Ticker'],
  ['about', 'About'],
  ['skills', 'Skills'],
  ['projects', 'Projects'],
  ['experience', 'Experience'],
  ['contact', 'Contact & Footer'],
  ['security', 'Security'],
];

/* ---------------- sections ---------------- */

function HeroTab({ c, edit }) {
  const { hero, profile, nav } = c;
  const set = (section, key) => (value) => edit((d) => void (d[section][key] = value));

  return (
    <>
      <h3>Logo &amp; menu</h3>
      <div className="row2">
        <Text label="Logo initials" value={profile.initials} onChange={set('profile', 'initials')} maxLength={4} />
        <Text label="Your name" value={profile.name} onChange={set('profile', 'name')} />
      </div>
      <Text label="“Hire me” button (top bar)" value={nav.hireLabel} onChange={set('nav', 'hireLabel')} />
      <Field label="Menu names" hint="The links always point to their own section.">
        <div className="row2">
          {nav.links.map((link, i) => (
            <input key={link.id} value={link.label} onChange={(e) => edit((d) => void (d.nav.links[i].label = e.target.value))} />
          ))}
        </div>
      </Field>

      <h3>Hero</h3>
      <ImageInput
        label="Your photo"
        hint="Use a PNG/WebP with a transparent background for the cut-out look."
        value={hero.photo}
        fallback={heroPhoto}
        removeLabel="Use default photo"
        onChange={set('hero', 'photo')}
      />
      <Text label="Small title above heading" value={hero.eyebrow} onChange={set('hero', 'eyebrow')} />
      <div className="row2">
        <Text label="Heading line 1" value={hero.greeting} onChange={set('hero', 'greeting')} />
        <Text label="Heading line 2 (yellow)" value={hero.name} onChange={set('hero', 'name')} />
      </div>
      <Text label="Paragraph" multiline rows={4} value={hero.paragraph} onChange={set('hero', 'paragraph')} />
      <div className="row2">
        <Text label="Yellow button" value={hero.primaryLabel} onChange={set('hero', 'primaryLabel')} />
        <Text label="White button" value={hero.secondaryLabel} onChange={set('hero', 'secondaryLabel')} />
      </div>
      <Text label="Handwritten note (leave empty to hide)" value={hero.note} onChange={set('hero', 'note')} />
      <Text label="Big outline word in the background" value={hero.ghost} onChange={set('hero', 'ghost')} />

      <Field label="Floating stickers around the photo" hint="Up to 6 stickers." />
      <ItemList
        items={hero.stickers}
        onChange={(v) => edit((d) => void (d.hero.stickers = v))}
        title={(s) => s.label}
        max={6}
        addLabel="Add sticker"
        makeItem={() => ({ label: 'New', badge: 'N', color: '#512bd4', yellow: false })}
        render={(s, patch) => (
          <>
            <Text label="Text" value={s.label} onChange={(label) => patch({ label })} />
            <div className="row2">
              <Text label="Badge letter (optional)" value={s.badge} maxLength={2} onChange={(badge) => patch({ badge })} />
              <Color label="Badge colour" value={s.color} onChange={(color) => patch({ color })} />
            </div>
            <Check label="Yellow sticker" value={s.yellow} onChange={(yellow) => patch({ yellow })} />
          </>
        )}
      />
    </>
  );
}

function MarqueeTab({ c, edit }) {
  return (
    <>
      <h3>Black ticker strip</h3>
      <Strings
        label="Items"
        hint="Leave the list empty to hide the strip."
        value={c.marquee}
        addLabel="Add item"
        onChange={(v) => edit((d) => void (d.marquee = v))}
      />
    </>
  );
}

function AboutTab({ c, edit }) {
  const { about } = c;
  const set = (key) => (value) => edit((d) => void (d.about[key] = value));
  return (
    <>
      <h3>About section</h3>
      <Text label="Section label" value={about.label} onChange={set('label')} />
      <Text label="Heading (first part)" value={about.headingPre} onChange={set('headingPre')} />
      <Text label="Heading (circled part)" value={about.headingEm} onChange={set('headingEm')} />
      <Strings label="Paragraphs" value={about.paragraphs} addLabel="Add paragraph" onChange={set('paragraphs')} />
      <Strings label="Chips" value={about.chips} addLabel="Add chip" onChange={set('chips')} />
      <ImageInput label="Photo" value={about.photo} fallback={polaroid} removeLabel="Use default photo" onChange={set('photo')} />
      <Text label="Photo caption" value={about.caption} onChange={set('caption')} />
      <Field label="Numbers" hint="Values like 3+ count up on screen." />
      <ItemList
        items={about.stats}
        onChange={set('stats')}
        title={(s) => `${s.value} ${s.label}`}
        addLabel="Add number"
        makeItem={() => ({ value: '1', label: 'Label' })}
        render={(s, patch) => (
          <div className="row2">
            <Text label="Value" value={s.value} onChange={(value) => patch({ value })} />
            <Text label="Label" value={s.label} onChange={(label) => patch({ label })} />
          </div>
        )}
      />
    </>
  );
}

function SkillsTab({ c, edit }) {
  const { skills } = c;
  return (
    <>
      <h3>Technology wall</h3>
      <Text label="Section label" value={skills.label} onChange={(v) => edit((d) => void (d.skills.label = v))} />
      <Text label="Title" value={skills.title} onChange={(v) => edit((d) => void (d.skills.title = v))} />
      <Field label="Categories" />
      <ItemList
        items={skills.categories}
        onChange={(v) => edit((d) => void (d.skills.categories = v))}
        title={(cat) => cat.title}
        addLabel="Add category"
        makeItem={() => ({ title: 'NEW CATEGORY', items: ['SKILL'] })}
        render={(cat, patch) => (
          <>
            <Text label="Category name" value={cat.title} onChange={(title) => patch({ title })} />
            <Strings label="Technologies" value={cat.items} addLabel="Add technology" onChange={(items) => patch({ items })} />
          </>
        )}
      />
    </>
  );
}

function TintInput({ value, onChange }) {
  const preset = TINTS.some(([v]) => v === value);
  return (
    <Field label="Preview colour">
      <div className="row2">
        <select value={preset ? value : 'custom'} onChange={(e) => onChange(e.target.value === 'custom' ? '#ffd166' : e.target.value)}>
          {TINTS.map(([v, name]) => (
            <option key={name} value={v}>
              {name}
            </option>
          ))}
          <option value="custom">Custom colour…</option>
        </select>
        {!preset && <input type="color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#ffd166'} onChange={(e) => onChange(e.target.value)} />}
      </div>
    </Field>
  );
}

function ProjectsTab({ c, edit }) {
  const { projects } = c;
  const { more } = projects;
  const setP = (key) => (value) => edit((d) => void (d.projects[key] = value));
  const setMore = (key) => (value) => edit((d) => void (d.projects.more[key] = value));
  return (
    <>
      <h3>Selected projects</h3>
      <Text label="Section label" value={projects.label} onChange={setP('label')} />
      <Text label="Title" value={projects.title} onChange={setP('title')} />
      <Text label="“View project” link text" value={projects.linkLabel} onChange={setP('linkLabel')} />

      <Field label="Projects" hint="Cards are numbered automatically in this order." />
      <ItemList
        items={projects.items}
        onChange={setP('items')}
        title={(p, i) => `${String(i + 1).padStart(2, '0')} · ${p.title}`}
        addLabel="Add project"
        makeItem={() => ({
          tag: 'NEW',
          abbr: 'NP',
          glyph: '</>',
          title: 'New project',
          desc: 'Describe the project here.',
          stack: 'ASP.NET • C# • SQL Server',
          rotate: 0,
          tint: '',
          note: '',
          href: '#',
          image: '',
        })}
        render={(p, patch) => (
          <>
            <Text label="Title" value={p.title} onChange={(title) => patch({ title })} />
            <Text label="Tag (small label)" value={p.tag} onChange={(tag) => patch({ tag })} />
            <Text label="Description" multiline value={p.desc} onChange={(desc) => patch({ desc })} />
            <Text label="Tech stack" value={p.stack} onChange={(stack) => patch({ stack })} />
            <Text label="Project link" hint="https://… or # for none" value={p.href} onChange={(href) => patch({ href })} />
            <ImageInput
              label="Screenshot / cover image"
              hint="Optional. Without it the card shows the short name below."
              value={p.image}
              onChange={(image) => patch({ image })}
            />
            <div className="row2">
              <Text label="Short name (no image)" value={p.abbr} maxLength={6} onChange={(abbr) => patch({ abbr })} />
              <Text label="Symbol (no image)" value={p.glyph} maxLength={4} onChange={(glyph) => patch({ glyph })} />
            </div>
            <TintInput value={p.tint} onChange={(tint) => patch({ tint })} />
            <div className="row2">
              <Text label="Sticker note (optional)" value={p.note} onChange={(note) => patch({ note })} />
              <Text label="Tilt (degrees)" type="number" step="0.1" min="-5" max="5" value={p.rotate} onChange={(rotate) => patch({ rotate })} />
            </div>
          </>
        )}
      />

      <h3>“More projects” card</h3>
      <Check label="Show this card" value={more.show} onChange={setMore('show')} />
      <div className="row2">
        <Text label="Numbers" value={more.range} onChange={setMore('range')} />
        <Text label="Badge" value={more.badge} onChange={setMore('badge')} />
      </div>
      <Text label="Title" value={more.title} onChange={setMore('title')} />
      <Text label="Description" multiline value={more.desc} onChange={setMore('desc')} />
      <Text label="Button text" value={more.button} onChange={setMore('button')} />
    </>
  );
}

function ExperienceTab({ c, edit }) {
  const { experience } = c;
  return (
    <>
      <h3>Journey / timeline</h3>
      <Text label="Section label" value={experience.label} onChange={(v) => edit((d) => void (d.experience.label = v))} />
      <Text label="Title" value={experience.title} onChange={(v) => edit((d) => void (d.experience.title = v))} />
      <Field label="Timeline entries" />
      <ItemList
        items={experience.items}
        onChange={(v) => edit((d) => void (d.experience.items = v))}
        title={(e) => `${e.year} · ${e.title}`}
        addLabel="Add entry"
        makeItem={() => ({ year: '2025', title: 'New entry', desc: 'What happened?' })}
        render={(e, patch) => (
          <>
            <Text label="Year / period" value={e.year} onChange={(year) => patch({ year })} />
            <Text label="Title" value={e.title} onChange={(title) => patch({ title })} />
            <Text label="Description" multiline value={e.desc} onChange={(desc) => patch({ desc })} />
          </>
        )}
      />
    </>
  );
}

function ContactTab({ c, edit }) {
  const { contact, profile, footer } = c;
  const setC = (key) => (value) => edit((d) => void (d.contact[key] = value));
  const setP = (key) => (value) => edit((d) => void (d.profile[key] = value));
  return (
    <>
      <h3>Contact section</h3>
      <Text label="Section label" value={contact.label} onChange={setC('label')} />
      <Text label="Heading line 1" value={contact.line1} onChange={setC('line1')} />
      <Text label="Heading line 2" value={contact.line2} onChange={setC('line2')} />
      <Text label="Heading line 3 (highlighted)" value={contact.highlight} onChange={setC('highlight')} />
      <Text label="Button text" value={contact.button} onChange={setC('button')} />
      <Text label="Email" type="email" value={profile.email} onChange={setP('email')} />
      <Text label="Phone" value={profile.phone} onChange={setP('phone')} />
      <Text label="LinkedIn link" hint="https://…" value={profile.linkedin} onChange={setP('linkedin')} />
      <Text label="GitHub link" hint="https://…" value={profile.github} onChange={setP('github')} />
      <Text label="Location" value={profile.location} onChange={setP('location')} />

      <h3>Footer</h3>
      <Text label="Line under your name" value={footer.tagline} onChange={(v) => edit((d) => void (d.footer.tagline = v))} />
      <Strings label="Footer symbols" value={footer.icons} addLabel="Add symbol" onChange={(v) => edit((d) => void (d.footer.icons = v))} />
    </>
  );
}

function SecurityTab() {
  const { logout, resetToDefaults } = useSite();
  const [form, setForm] = useState({ current: '', next: '', again: '' });
  const [state, setState] = useState({ busy: false, error: '', ok: false });
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.next !== form.again) return setState({ busy: false, error: 'The new passwords do not match.', ok: false });
    setState({ busy: true, error: '', ok: false });
    try {
      await api.changePassword(form.current, form.next);
      setForm({ current: '', next: '', again: '' });
      setState({ busy: false, error: '', ok: true });
    } catch (err) {
      setState({ busy: false, error: err.message, ok: false });
    }
  };

  return (
    <>
      <h3>Change password</h3>
      <form onSubmit={submit} className="pwf" autoComplete="off">
        <Text label="Current password" type="password" autoComplete="current-password" value={form.current} onChange={set('current')} />
        <Text label="New password" type="password" autoComplete="new-password" hint="At least 10 characters. Use a long phrase you don't use anywhere else." value={form.next} onChange={set('next')} />
        <Text label="New password again" type="password" autoComplete="new-password" value={form.again} onChange={set('again')} />
        {state.error && <div className="adm-err">{state.error}</div>}
        {state.ok && <div className="adm-ok">Password changed. Every other device was logged out.</div>}
        <button type="submit" className="pbtn" disabled={state.busy || !form.current || !form.next}>
          {state.busy ? 'Saving…' : 'Change password'}
        </button>
      </form>

      <h3>Session</h3>
      <button type="button" className="pbtn ghost" onClick={logout}>
        Log out
      </button>

      <h3>Danger zone</h3>
      <p className="fh">Puts every text and list back to the original version in the editor. Nothing changes online until you press Publish.</p>
      <button
        type="button"
        className="pbtn ghost danger"
        onClick={() => confirm('Reset all text to the original defaults? (Not published until you press Publish.)') && resetToDefaults()}
      >
        Reset all content to defaults
      </button>
    </>
  );
}

const SECTION_TABS = { hero: HeroTab, marquee: MarqueeTab, about: AboutTab, skills: SkillsTab, projects: ProjectsTab, experience: ExperienceTab, contact: ContactTab };

/* ---------------- drawer ---------------- */

export default function AdminPanel() {
  const { content, edit, dirty, save, discard, setPanelOpen } = useSite();
  const [tab, setTab] = useState('hero');
  const [status, setStatus] = useState({ text: '', error: false });

  const publish = async () => {
    setStatus({ text: 'Publishing…', error: false });
    try {
      await save();
      setStatus({ text: 'Published ✓ Live for everyone', error: false });
    } catch (err) {
      setStatus({ text: err.message, error: true });
    }
  };

  const Section = SECTION_TABS[tab];

  return (
    <aside className="adm-panel" aria-label="Site editor">
      <header className="adm-top">
        <div>
          <b>Edit site</b>
          <span className={status.error ? 'adm-st err' : 'adm-st'}>{status.text || (dirty ? 'Unsaved changes' : 'All changes published')}</span>
        </div>
        <div className="adm-actions">
          <button type="button" className="pbtn ghost" disabled={!dirty} onClick={discard}>
            Discard
          </button>
          <button type="button" className="pbtn" disabled={!dirty} onClick={publish}>
            Publish
          </button>
          <button type="button" className="adm-x static" aria-label="Close editor" onClick={() => setPanelOpen(false)}>
            ✕
          </button>
        </div>
      </header>

      <nav className="adm-tabs" role="tablist">
        {TABS.map(([id, name]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>
            {name}
          </button>
        ))}
      </nav>

      <div className="adm-body">{Section ? <Section c={content} edit={edit} /> : <SecurityTab />}</div>
    </aside>
  );
}
