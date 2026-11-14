# Yogdan

Yogdan is a blood-donation and community coordination platform with a React progressive web app, an Express/Mongoose API, MongoDB Atlas persistence, OTP authentication, health records, blood requests, community features, and live nearby-care lookup.

The frontend and backend are intentionally maintained as separate applications. There is no root workspace or monorepo package configuration.

## Architecture

```text
┌─────────────────────────────────────┐
│ React PWA                           │
│ Vite · React Router · Zustand       │
│ Tailwind CSS · Browser APIs         │
└────────────────┬────────────────────┘
                 │ REST/JSON + JWT
                 ▼
┌─────────────────────────────────────┐
│ Express API                         │
│ Auth · validation · authorization   │
│ requests · health · community       │
└────────────────┬────────────────────┘
                 │ Mongoose
                 ▼
┌─────────────────────────────────────┐
│ MongoDB Atlas                       │
│ users · OTPs · requests · records   │
│ posts · actions · responses         │
└─────────────────────────────────────┘

External integrations:
- Gmail SMTP for OTP and welcome emails
- OpenStreetMap/Nominatim for nearby healthcare lookup
- Browser Geolocation API for precise user location
```

## Repository layout

```text
YogdanWeb/
├── frontEnd/                 # React/Vite PWA
│   ├── public/               # Manifest, service worker, app icon
│   └── src/
│       ├── components/       # Reusable UI, layout and feature components
│       ├── pages/            # Route-level screens
│       ├── router/           # Guest/protected route configuration
│       ├── store/            # Zustand state and persistence
│       ├── lib/              # API, location and domain helpers
│       └── styles/           # Global Tailwind/CSS styles
└── backEnd/                  # Express/Mongoose API
    ├── config/               # MongoDB and runtime configuration
    ├── middleware/           # JWT and database guards
    ├── models/               # Mongoose schemas
    ├── services/             # Email and OTP services
    └── tests/                # Backend smoke tests
```

## Frontend

The frontend entry point is `frontEnd/src/main.js`. It mounts React, loads global styles, and registers the service worker for production builds.

`frontEnd/src/App.js` checks the stored access token, refreshes authenticated data, handles expired sessions, and renders the React Router provider.

The frontend uses `.js` files containing JSX. Vite is configured to parse those files as JSX; renaming every file to `.jsx` is not necessary and would not change the React architecture.

### Routes

Guest routes:

```text
/welcome
/register
/login
/verify
/onboarding
```

Protected routes:

```text
/
/discover
/community
/profile
/action
/request
/requests
/health
/health/assessment
/health/history
/health/passport
/blood
/documents
/activity
/donations
/leaderboard
/notifications
/settings
```

### State and API flow

```text
React page
  → Zustand action
  → frontEnd/src/lib/api.js
  → fetch with JWT bearer token
  → Express API
  → MongoDB
```

Zustand stores account data, requests, health records, documents, posts, notifications, actions, hospitals, and local UI state. Authenticated state is refreshed from the backend after login.

## Backend

The backend application is exported from `backEnd/app.js` and started by `backEnd/server.js`.

Startup:

```text
Load .env
  → connect to MongoDB Atlas
  → start Express on port 5000
  → expose REST API
```

Middleware order:

```text
CORS
  → JSON parser
  → request logger
  → public health endpoint
  → auth database guard
  → authentication routes
  → JWT middleware
  → protected database guard
  → protected routes
  → centralized error handler
```

### API domains

```text
Authentication:
  POST /api/auth/request-otp
  POST /api/auth/verify-otp
  POST /api/auth/register
  POST /api/auth/login

Profile:
  GET  /api/user/profile
  PUT  /api/user/profile

Blood requests:
  GET   /api/requests
  POST  /api/requests
  PATCH /api/requests/:id/status
  POST  /api/requests/:id/respond
  GET   /api/requests/:id/responses
  PATCH /api/responses/:id/status

Health:
  GET    /api/health/records
  POST   /api/health/assessments
  POST   /api/health/documents
  DELETE /api/health/documents/:id

Community:
  GET  /api/community/posts
  POST /api/community/posts
  POST /api/community/posts/:id/like

Actions:
  GET  /api/actions
  POST /api/actions
```

## Authentication flow

Yogdan uses passwordless OTP authentication.

### Login

```text
User enters email OR mobile
  → backend resolves the account
  → OTP is generated and hashed
  → OTP challenge is stored in MongoDB
  → OTP is sent to the account email
  → user submits the code
  → backend issues a seven-day JWT
```

OTP rules:

- Six-digit random code
- Stored as a SHA-256 hash
- Ten-minute expiry
- Maximum five attempts
- One-time verification
- Previous pending challenges are invalidated

### Registration

```text
Name + email + mobile
  → registration OTP
  → verification token
  → onboarding profile and location
  → user document
  → JWT
```

## Database models

| Model | Responsibility |
| --- | --- |
| `User` | Identity, donor profile, preferences and private GeoJSON location |
| `OtpChallenge` | Hashed OTP challenge, expiry and attempt tracking |
| `BloodRequest` | Blood requirement, urgency, hospital and requester |
| `RequestResponse` | Donor response to an open blood request |
| `HealthRecord` | Assessments and document metadata |
| `Post` | Community content and likes |
| `Action` | User activity and audit-style history |

## Location and nearby care

The browser requests high-accuracy coordinates through the Geolocation API. The frontend then:

1. Builds a live OpenStreetMap map.
2. Queries Nominatim for nearby hospitals and blood banks.
3. Calculates distances locally from the user’s coordinates.
4. Displays real map markers and facility information.

Exact coordinates are stored privately for matching. The UI should expose approximate location or distance rather than another user’s exact coordinates.

## Progressive Web App

The PWA configuration is in:

- `frontEnd/public/manifest.webmanifest`
- `frontEnd/public/sw.js`
- `frontEnd/public/icon.svg`

The service worker caches the application shell and provides an offline navigation fallback. API requests are deliberately not cached because authentication, requests, health data, and community data must remain current.

PWA installation requires production build hosting or localhost. HTTPS is required outside localhost.

## Local development

### Backend

```powershell
cd backEnd
npm install
Copy-Item .env.example .env
npm run dev
```

Backend URL: `http://localhost:5000`

### Frontend

```powershell
cd frontEnd
npm install
Copy-Item .env.example .env
npm run dev
```

Frontend URL: `http://localhost:5173`

The frontend Vite server proxies `/api` requests to `http://localhost:5000`.

## Environment variables

Backend secrets belong only in `backEnd/.env` and must never be committed.

Important backend variables:

```text
MONGODB_URI
JWT_ACCESS_SECRET
CLIENT_URL
MAIL_PROVIDER
GMAIL_USER
GMAIL_APP_PASSWORD
```

Frontend configuration:

```text
VITE_API_URL
```

Use the example files as templates:

- `frontEnd/.env.example`
- `backEnd/.env.example`

## Validation

Backend syntax and smoke test:

```powershell
cd backEnd
node --check app.js
npm test
```

Frontend production build:

```powershell
cd frontEnd
npm run build
```

## Current scope and future hardening

The core React, API, database, authentication, location and PWA flows are implemented. The following areas remain future production work:

- Backend geospatial donor matching with MongoDB `$near`
- Real medical-file storage instead of metadata-only document records
- Medical document extraction and verification pipeline
- Server-side rate limiting and resend cooldown enforcement
- Refresh-token rotation and stronger production token management
- Removal of remaining demo/seed fallback data
- Production map provider and routing service selection
- Automated frontend integration and end-to-end tests

Never commit credentials. Rotate any credentials that have previously been exposed during development before production deployment.
