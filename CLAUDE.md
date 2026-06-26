# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Kreli** (formerly LocaMat) — an equipment rental marketplace for Morocco. Frontend and backend are separate apps in the same repo.

## Commands

```bash
# Full stack
docker-compose up

# Frontend (http://localhost:3000)
cd frontend && npm run dev
cd frontend && npm run build
cd frontend && npm run lint

# Backend (http://localhost:5000)
cd backend && npm run dev      # nodemon
cd backend && npm run seed     # seed database
```

Backend has no test runner. No frontend test suite either — verify by running the app.

Swagger docs available at `http://localhost:5000/api-docs` when backend is running.
Health check: `GET /api/v1/health`

## Architecture

### Request flow

```
Browser → Next.js middleware (locale routing only) → App Router page
                                                    → frontend/src/lib/api.ts (fetch)
                                                    → Express /api/v1/* routes
                                                    → controllers → Mongoose models
```

All API calls go through `frontend/src/lib/api.ts`. It reads `NEXT_PUBLIC_API_URL` or falls back to `http://localhost:5000/api/v1` in dev / Railway in prod. Token is read from localStorage via `getToken()` (returns `""` on server side).

### Authentication

Two parallel token stores:
- `localStorage["Kreli_token"]` — used by `api.ts` for API calls
- Cookie `Kreli_token` — written by `saveAuth()` in `frontend/src/lib/auth.ts`

`frontend/middleware.ts` handles **locale routing only** — it strips locale prefixes (`/fr/`, `/en/`, etc.) and rewrites URLs internally. It does NOT do JWT verification or auth redirects.

Dashboard auth protection is **client-side**, done in each `layout.tsx` via `useAuth()`:
- `/dashboard/admin/` — redirects to `/auth/login` if not admin
- `/dashboard/proprietaire/` — redirects to `/auth/login` if not logged in, `/dashboard` if wrong role
- `/dashboard/locataire/` — same pattern

Backend uses `verifyToken` + `requireRole(...roles)` middleware from `backend/src/middleware/auth.middleware.js`. Role `both` is authorized for both `locataire` and `proprietaire` protected routes.

### User roles

`locataire` | `proprietaire` | `both` | `admin`

Users holding `both` land on the locataire dashboard by default but can navigate to proprietaire pages. `dashboard/page.tsx` redirects: `admin → /dashboard/admin`, `proprietaire → /dashboard/proprietaire`, otherwise → `/dashboard/locataire`.

### Real-time (Socket.IO)

`frontend/src/hooks/useSocket.ts` maintains a **module-level singleton** — one socket connection per browser session regardless of how many components call `useSocket`. JWT is passed in `socket.handshake.auth.token`. The socket reconnects automatically if the token changes.

Server stores `io` and the online-user map on `app`: `app.get("io")`, `app.get("onlineUsers")`. Controllers that need to push real-time events grab `io` from `req.app.get("io")`.

Socket events: `send_message`, `receive_message`, `mark_read`, `messages_read`, `new_notification`, `user_online`, `user_offline`, `online_users`, `message_error`.

Chat content filter (in `backend/src/index.js`): phone numbers and URLs are blocked in text messages and emit a `message_error` event.

### i18n

Four locales: `fr` (default), `en`, `ar` (RTL), `zgh` (Tifinagh script). Managed in `frontend/src/context/I18nContext.tsx`. Locale is resolved from: path prefix → URL `?locale=` param → cookie `Kreli_locale` → localStorage.

RTL is applied automatically for `ar` via `document.documentElement.dir`. Switching locale navigates to `/{locale}/path`. Translation files live in `frontend/src/locales/*.json`; access via the `t("key.nested")` function from `useI18n()`.

### Dashboard routing

Three sub-dashboards, each with its own `layout.tsx`:
- `app/dashboard/admin/` — platform management (users, materiels, locations, paiements, litiges)
- `app/dashboard/proprietaire/` — equipment owner
- `app/dashboard/locataire/` — renter

`app/dashboard/page.tsx` redirects to the appropriate sub-dashboard based on role.

### Domain model (key relationships)

```
User (locataire) ──rents──► Location ◄──belongs to── Materiel ◄──owned by── User (proprietaire)
                                │
                         Paiement (caution / location fee)
                                │
                            Litige (dispute)
                                │
                         Conversation / Message (per-materiel chat)
```

`Location.statut` lifecycle: `en_attente` → `acceptee` → `en_cours` → `terminee` | `en_retard` | `en_litige` | `refusee` | `annulee`

`Location` records commission: `commissionTaux`, `commissionMontant`, `montantNetProprio`. Commission rates are stored in the `CommissionConfig` model.

### Backend patterns

- Backend uses CommonJS (`require` / `module.exports`) throughout
- Routes in `src/routes/resource.routes.js`, logic in `src/controllers/resource.controller.js`
- All responses: `{ success, data, message }` shape
- `asyncHandler` wrapper in `src/utils/asyncHandler.js` — use it on all controller functions
- `ApiError` class in `src/utils/ApiError.js` — throw for known error cases; caught by `errorHandler.middleware.js`
- Cron job in `src/services/reminders.cron.js` runs daily at 08:00 to email rental reminders

### Environment variables

Backend `backend/.env`:
```
PORT=5000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000   # comma-separated for multiple origins
NODE_ENV=development
```

Frontend `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # used for OG metadata canonical URLs
```

## Key conventions

- **No `any` types** — use `unknown` and narrow, or define shared types in `frontend/src/lib/api.ts`
- **Server Components by default** — add `"use client"` only when hooks/events are needed
- **`next/image`** for all `<img>` tags
- **Materiel images**: use `getMaterielImage(materiel)` from `api.ts`; it handles both absolute URLs and relative `/uploads/` paths
- **Price formatting**: use `formatPrice(value)` from `api.ts` — formats as MAD currency
- **Status labels/colors**: use `getStatutLabel(statut)` and `getStatutColor(statut)` from `api.ts`
- **shadcn/ui** components live in `frontend/src/components/ui/` (added via `shadcn` CLI, see `components.json`)
- **Fonts**: Inter (body), Inter Tight (display, `--font-display`), JetBrains Mono (`--font-mono`), Cairo (`--font-arabic`), Plus Jakarta Sans (`--font-jakarta`)
- **Auth helpers**: `saveAuth()`, `clearAuth()`, `getStoredUser()`, `isLoggedIn()` from `frontend/src/lib/auth.ts`; `useAuth()` from `AuthContext`
