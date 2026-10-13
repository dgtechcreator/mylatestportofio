import DrawSvg from './ui/DrawSvg';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';

/** Section label, big split-word title and the hand-drawn underline. */
export default function SectionHead({ label, title }) {
  return (
    <Reveal className="sh">
      <span className="lab">{label}</span>
      <h2 className="big">
        <SplitText>{title}</SplitText>
      </h2>
      <DrawSvg symbol="ul" viewBox="0 0 300 24" className="u" />
    </Reveal>
  );
}
