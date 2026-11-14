// 6-box OTP input component
import { useRef } from 'react';
import { cn } from '../../lib/utils';

export function OtpInput({ value, onChange, length = 6 }) {
  const refs = useRef([]);

  const handleChange = (char, index) => {
    const digit = char.replace(/\D/g, '').slice(-1);
    const next = value.split('');
    next[index] = digit;
    onChange(next.join(''));
    if (digit && index < length - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) refs.current[index - 1]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text" inputMode="numeric" maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          autoFocus={i === 0}
          className={cn(
            'size-12 rounded-full border text-center text-xl font-bold text-ink outline-none transition-all focus:ring-4 focus:ring-primary/10',
            value[i] ? 'border-primary bg-accent' : 'border-border bg-white',
          )}
        />
      ))}
    </div>
  );
}
