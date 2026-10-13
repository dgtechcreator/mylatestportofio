import { canUseMouseFx } from '../../utils/media';
import { cn } from '../../utils/cn';

/** Neo-brutalist link button. On fine-pointer devices it leans toward the cursor ("magnetic"). */
export default function Button({ variant, className, children, ...rest }) {
  const onMouseMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.22}px ${(e.clientY - r.top - r.height / 2) * 0.3}px`;
  };
  const onMouseLeave = (e) => {
    e.currentTarget.style.translate = '';
  };

  return (
    <a
      className={cn('btn', variant, className)}
      {...(canUseMouseFx && { onMouseMove, onMouseLeave })}
      {...rest}
    >
      {children}
    </a>
  );
}
