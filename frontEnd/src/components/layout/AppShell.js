// Phone-frame wrapper — full-bleed on mobile, floating device on desktop
export function AppShell({ children }) {
  return (
    <div className="flex min-h-dvh justify-center md:items-center md:py-6">
      <div className="relative flex h-[100dvh] min-h-0 w-full max-w-[440px] flex-col overflow-hidden bg-screen md:h-[min(900px,calc(100dvh-48px))] md:rounded-[44px] md:border md:border-border md:shadow-phone">
        {children}
      </div>
    </div>
  );
}
