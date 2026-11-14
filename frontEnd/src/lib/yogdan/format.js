// Date formatting and text utilities for Yogdan
import { formatDistanceToNowStrict, format } from 'date-fns';

export const ago = (iso) => `${formatDistanceToNowStrict(new Date(iso))} ago`;
export const fmtDate = (iso, f = 'd MMM yyyy') => format(new Date(iso), f);
export const until = (iso) => {
  const d = new Date(iso);
  return d.getTime() < Date.now() ? 'Overdue' : `in ${formatDistanceToNowStrict(d)}`;
};
export const initials = (name) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
export const greeting = (d = new Date()) => {
  const h = d.getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};
