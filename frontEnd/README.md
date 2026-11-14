# Yogdan — Frontend

Standalone React 18 single-page application for the Yogdan blood-donor
platform. It is intentionally maintained as a separate application from
`backEnd/` and communicates with the API over HTTP.

## Stack
- **React 18** — UI library
- **React Router v6** — client-side routing
- **Zustand** — global state with localStorage persistence
- **Tailwind CSS v3** — utility-first styling
- **Vite** — build tool and dev server

## Structure
```
frontEnd/
  public/          Static assets (favicon, images)
  src/
    App.js         Root component — mounts the router
    main.js        Entry point — renders App into #root
    assets/        Images used in components
    components/
      ui/          Base UI: Button, Card, Input, Badge, Avatar
      layout/      AppShell, BottomTabBar, ScreenHeader
      common/      DemoNote, BloodGroupPicker, OtpInput
    pages/
      auth/        WelcomePage, RegisterPage, LoginPage, VerifyPage, OnboardingPage
      app/         HomePage, ProfilePage, ComingSoonPage
    router/        index.js, ProtectedRoute.js, GuestRoute.js
    store/         Zustand store (index.js)
    lib/
      yogdan/      Business logic: format, rules, matching, seed, types
      utils.js     Shared helpers (cn)
    styles/        global.css — Tailwind base + design tokens
  tests/
    App.test.js
  package.json
  vite.config.js
  config/
    tailwind.config.js
    postcss.config.js
```

## Getting started
```bash
npm install
npm run dev        # http://localhost:5173
```

The Vite development server proxies `/api` requests to
`http://localhost:5000`. Start the backend separately from `../backEnd`.

## Demo credentials
- OTP code: **123456** (no real SMS sent)
- All data is fictional and stored only on this device
