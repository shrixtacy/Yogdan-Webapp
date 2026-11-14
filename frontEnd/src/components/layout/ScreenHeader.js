// Screen header — back button, centered title, optional right slot
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ScreenHeader({ title, back, right }) {
  const navigate = useNavigate();
  return (
    <header className="grid shrink-0 grid-cols-[48px_1fr_48px] items-center px-3 pb-2 pt-4">
      <div>
        {back !== false && (
          <button
            type="button" aria-label="Go back"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(back ?? '/'))}
            className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-white"
          >
            <ChevronLeft className="size-6" />
          </button>
        )}
      </div>
      <h1 className="truncate text-center text-[17px] font-semibold text-ink">{title}</h1>
      <div className="flex justify-end">{right}</div>
    </header>
  );
}
