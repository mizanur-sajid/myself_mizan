import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string | undefined | null) => {
  if (!html) return '';
  if (typeof window === 'undefined') return html; // DOMPurify requires DOM, skip on server
  return DOMPurify.sanitize(html);
};
