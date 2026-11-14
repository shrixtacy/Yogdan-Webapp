// User avatar with initials fallback
import { initials } from '../../lib/yogdan/format';
import { cn } from '../../lib/utils';

export function Avatar({ name, src, hue = 355, size = 40, className }) {
  const style = { width: size, height: size, fontSize: size * 0.36, background: `oklch(0.93 0.04 ${hue})` };
  if (src) return <img src={src} alt={name} width={size} height={size} className={cn('shrink-0 rounded-full border-2 border-white object-cover shadow-soft', className)} style={{ width: size, height: size }} />;
  return (
    <div className={cn('grid shrink-0 place-items-center rounded-full border-2 border-white font-semibold text-ink shadow-soft', className)} style={style} aria-label={name}>
      {initials(name) || '?'}
    </div>
  );
}
