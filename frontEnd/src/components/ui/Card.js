// Card variants — white card, glass card, blush card
import { cn } from '../../lib/utils';

export function Card({ children, className, tone = 'white', onClick }) {
  const tones = {
    white:  'border border-[#EAEAEA] bg-white shadow-card',
    glass:  'glass shadow-soft',
    blush:  'glass-blush shadow-soft',
  };
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag onClick={onClick} className={cn('rounded-3xl p-4 text-ink', tones[tone], onClick && 'w-full text-left transition-all hover:brightness-98 active:scale-[0.99]', className)}>
      {children}
    </Tag>
  );
}
