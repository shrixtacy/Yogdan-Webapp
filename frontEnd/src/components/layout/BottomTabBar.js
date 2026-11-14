// Bottom navigation tab bar with floating FAB center button
import { NavLink, useLocation } from 'react-router-dom';
import { Home, HeartPulse, Users, UserRound } from 'lucide-react';
import { cn } from '../../lib/utils';
import heartDrop from '../../assets/heart-drop.png';

const TABS = [
  { to: '/',          label: 'Home',      Icon: Home },
  { to: '/health',    label: 'Health',    Icon: HeartPulse },
  { to: '/action',    label: 'Action',    Icon: null },
  { to: '/community', label: 'Community', Icon: Users },
  { to: '/profile',   label: 'Profile',   Icon: UserRound },
];

export function BottomTabBar() {
  const { pathname } = useLocation();

  return (
    <nav aria-label="Main" className="absolute inset-x-0 bottom-0 z-30 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
      <ul className="relative z-30 grid h-[70px] grid-cols-5 items-center rounded-[26px] border border-[#303030] bg-[#191919] px-2 shadow-[0_14px_34px_-14px_rgba(0,0,0,0.4)]">
        {TABS.map((tab) => {
          const isActive = tab.to === '/' ? pathname === '/' : pathname.startsWith(tab.to);

          if (!tab.Icon) {
            return (
              <li key={tab.to} className="flex h-full items-center justify-center">
                <NavLink to={tab.to} aria-label={tab.label}
                    className={cn('flex size-[58px] flex-col items-center justify-center gap-0.5 rounded-full bg-[#E63946] text-white shadow-crimson ring-4 ring-[#F5F5F3] transition-transform active:scale-95', !isActive && 'animate-pulse-ring')}
                >
                  <img src={heartDrop} alt="" className="size-[48px] drop-shadow-md" />
                  </NavLink>
              </li>
            );
          }

          return (
            <li key={tab.to} className="flex h-full items-center justify-center">
              <NavLink to={tab.to} aria-label={tab.label} aria-current={isActive ? 'page' : undefined}
                className={cn('flex size-12 flex-col items-center justify-center gap-0.5 rounded-full transition-all', isActive ? 'bg-white text-[#191919]' : 'text-[#A5A5A5] hover:text-white')}
              >
                <tab.Icon className="size-6" />
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
