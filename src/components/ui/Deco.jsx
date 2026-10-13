import { cn } from '../../utils/cn';

/**
 * Floating handwritten doodle (`.dd`) that drifts with scroll.
 * `rotate` is in degrees, `parallax` scales how far it drifts; `style` positions it.
 */
export default function Deco({ children, rotate = 0, parallax, className, style }) {
  return (
    <span
      className={cn('dd', className)}
      style={{ '--r': `${rotate}deg`, ...(parallax !== undefined && { '--p': parallax }), ...style }}
    >
      {children}
    </span>
  );
}
