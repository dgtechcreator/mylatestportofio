const match = (query) => typeof window !== 'undefined' && window.matchMedia(query).matches;

/** True on devices with a mouse-like pointer (enables cursor / tilt / magnetic effects). */
export const hasFinePointer = match('(pointer:fine)');

/** True when the user asked the OS to reduce motion. */
export const prefersReducedMotion = match('(prefers-reduced-motion:reduce)');

/** Mouse-driven decorative effects are only enabled with a fine pointer and motion allowed. */
export const canUseMouseFx = hasFinePointer && !prefersReducedMotion;
