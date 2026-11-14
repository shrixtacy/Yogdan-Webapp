# Yogdan Backend

Standalone Node.js, Express, and MongoDB API for Yogdan.

## Run independently

```bash
npm install
npm run dev
```

The API listens on `http://localhost:5000` by default. Copy `.env.example` to
`.env` and set values for the local environment before starting the server.

Provider secrets such as `RESEND_API_KEY` and `GEMINI_API_KEY` must be saved
only in the local backend `.env` file. Rotate any key pasted into chat before
using it. Never place provider secrets in frontend `VITE_*` variables or
commit them to source control.

## Database behavior

The API uses MongoDB through Mongoose. In development, the server can start
without a reachable database so `/api/health` remains available; persistent
routes return `503 DATABASE_UNAVAILABLE` until MongoDB is connected. In
production, startup fails when `MONGODB_URI` is missing or unreachable.

## API areas

- `/api/auth` — registration, login, and OTP verification
- `/api/user` — authenticated profile and health-passport updates
- `/api/requests` — blood requests, cancellation, donor responses, and statuses
- `/api/health` — assessments, documents, and health records
- `/api/actions` — Action Hub history
- `/api/community` — posts and likes
- `/api/directory` — hospital directory

All data routes require a JWT bearer token and a connected MongoDB database.

## Project boundary

This directory owns the backend runtime, API routes, configuration, and backend
tests. It does not import files from `frontEnd/`. The frontend runs as a
separate Vite application and communicates with this service through HTTP.
