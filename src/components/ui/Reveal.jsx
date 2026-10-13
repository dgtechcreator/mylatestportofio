import { useInView } from '../../hooks/useInView';
import { cn } from '../../utils/cn';

/** Fades/slides its content in the first time it scrolls into view. */
export default function Reveal({ as: Tag = 'div', className, children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} data-r="" className={cn(className, inView && 'in')} {...rest}>
      {children}
    </Tag>
  );
}
