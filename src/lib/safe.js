/** Only let normal link schemes through — blocks `javascript:` and friends coming from editable content. */
export const safeHref = (url) => (/^(https?:|mailto:|tel:|#|\/)/i.test((url || '').trim()) ? url.trim() : '#');

/** Image sources must be an uploaded image or an https/http URL. */
export const safeSrc = (url) => (/^(\/api\/img\/[a-f0-9]{24}|https?:\/\/)/i.test((url || '').trim()) ? url.trim() : '');

export const telHref = (phone) => `tel:${(phone || '').replace(/[^\d+]/g, '')}`;
