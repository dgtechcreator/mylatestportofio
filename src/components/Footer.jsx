import { useSite } from '../context/SiteContext';

export default function Footer() {
  const { profile, footer } = useSite().content;
  return (
    <footer>
      <div className="wrap fg">
        <div>
          <b>{profile.name}</b>
          <span>{footer.tagline} · © {new Date().getFullYear()}</span>
        </div>
        <div className="fd">
          {footer.icons.map((icon, i) => (
            <span key={i}>{icon}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
