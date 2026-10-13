import { useSite } from '../context/SiteContext';

/** Tilted black ticker. The list is rendered twice so the -50% loop is seamless. */
export default function Marquee() {
  const { marquee } = useSite().content;
  if (!marquee.length) return null;
  const items = [...marquee, ...marquee];
  return (
    <div className="mq" aria-hidden="true">
      <div className="mt">
        {items.map((text, i) => (
          <span key={i}>{text}</span>
        ))}
      </div>
    </div>
  );
}
