/** Only let normal link schemes through — blocks `javascript:` and friends coming from editable content. */
export const safeHref = (url) => (/^(https?:|mailto:|tel:|#|\/)/i.test((url || '').trim()) ? url.trim() : '#');

/** Image sources must be an uploaded image or an https/http URL. */
export const safeSrc = (url) => (/^(\/api\/img\/[a-f0-9]{24}|https?:\/\/)/i.test((url || '').trim()) ? url.trim() : '');

export const DEFAULT_RESUME = '/resume/Vivek_Pal_Resume.pdf';

/** The resume button may only point at an uploaded resume (or the bundled default). */
export const safeResume = (url) => (/^\/api\/resume\/[a-f0-9]{24}$/.test((url || '').trim()) ? url.trim() : DEFAULT_RESUME);

export const telHref = (phone) => `tel:${(phone || '').replace(/[^\d+]/g, '')}`;
