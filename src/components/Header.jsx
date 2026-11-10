import { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { safeResume } from '../lib/safe';
import { useActiveSection } from '../hooks/useActiveSection';
import { cn } from '../utils/cn';
import Button from './ui/Button';

const sectionIds = ['about', 'skills', 'projects', 'experience', 'contact'];

export default function Header() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(sectionIds);
  const { content, admin, setLoginOpen, setPanelOpen } = useSite();
  const { profile, nav } = content;

  return (
    <header>
      <div className="wrap nav">
        <a className="logo" href="#top">
          <b>{profile.initials}</b>
          <span>{profile.name}</span>
        </a>
        <nav className={cn('nl', open && 'open')} id="nl">
          {nav.links.map(({ id, label }) => (
            <a
              key={id}
              className={cn('ln', active === id && 'cur')}
              href={`#${id}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="acts">
<<<<<<< HEAD
          <Button variant="z" href={safeResume(nav.resumeUrl)} download="Vivek_Pal_Resume.pdf">
=======
            <Button variant="z" href="/resume/Vivek_Pal_Resume.pdf" download="Vivek_Pal_Resume.pdf">
>>>>>>> 7ecd0d87acad0a99c08a5dcd878ccba720216f01
            {nav.resumeLabel}
          </Button>
         <Button variant="y" href="#contact">
            {nav.hireLabel}
          </Button> 
          <button
            type="button"
            className="lgbtn"
            onClick={() => (admin ? setPanelOpen(true) : setLoginOpen(true))}
          >
            {admin ? 'Edit site' : 'Login'}
          </button>
        </div>
        <button
          type="button"
          className="burger"
          id="bg"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}
