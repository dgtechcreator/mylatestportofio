import { useInView } from '../../hooks/useInView';
import { cn } from '../../utils/cn';

/** Hand-drawn SVG stroke (references a <symbol> from SvgDefs) that draws itself on reveal. */
export default function DrawSvg({ symbol, viewBox, className, preserveAspectRatio }) {
  const [ref, inView] = useInView();
  return (
    <svg
      ref={ref}
      className={cn('d', className, inView && 'in')}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      aria-hidden="true"
    >
      <use href={`#${symbol}`} />
    </svg>
  );
}
