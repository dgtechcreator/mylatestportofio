import { useState } from 'react';
import { useSite } from '../context/SiteContext';

/** Yellow intro curtain: shows the logo, then slides up (pure CSS) and unmounts itself. */
export default function Loader() {
  const [done, setDone] = useState(false);
  const initials = useSite().content.profile.initials;
  if (done) return null;

  return (
    <div
      className="ld"
      aria-hidden="true"
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) setDone(true);
      }}
    >
      <span>&lt;{initials}/&gt;</span>
    </div>
  );
}
