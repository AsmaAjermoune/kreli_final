<div align="center">

# Kreli

### Plateforme de location de matériel professionnel au Maroc

*(anciennement LocaMat)*

Fullstack monorepo — **Next.js 14** · **TypeScript** · **Express 5** · **MongoDB / Mongoose** · **Socket.IO**

<p>
  <img src="https://img.shields.io/badge/Frontend-Next.js%2014-0F172A?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/Backend-Express%205-F97316?style=for-the-badge&logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/Database-MongoDB-13aa52?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Realtime-Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO" />
</p>

<p>
  <img src="https://img.shields.io/badge/App%20Router-Enabled-0F172A?style=flat-square" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-0F172A?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth-JWT-0F172A?style=flat-square" />
  <img src="https://img.shields.io/badge/i18n-FR%20%C2%B7%20EN%20%C2%B7%20AR-F97316?style=flat-square" />
  <img src="https://img.shields.io/badge/UI-shadcn%2Fui-000000?style=flat-square" />
</p>

</div>

---

## Overview

Kreli is a full-stack rental marketplace for professional equipment in Morocco. Visitors browse and search equipment with geolocated map filtering; users register as renters (*locataires*), owners (*propriétaires*), or both; rentals flow through a status workflow (pending → accepted → in progress → returned); participants chat in real time and receive live notifications; and an admin panel manages users, categories, equipment, rentals, payments, and disputes. The interface is multilingual (French, English, Arabic with RTL).

Built as a PFE (Projet de Fin d'Études) fullstack application.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Design System & Theming](#design-system--theming)
- [Internationalization (i18n)](#internationalization-i18n)
- [Pages & Routes](#pages--routes)
- [Features](#features)
- [Data Models](#data-models)
- [API Reference](#api-reference)
- [Real-time (Socket.IO)](#real-time-socketio)
- [Authentication & Authorization](#authentication--authorization)
- [Database Fixtures (Seeds)](#database-fixtures-seeds)
- [Email & Cron](#email--cron)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
- [Docker](#docker)
- [Deployment](#deployment)

---

## Tech Stack

### Frontend (`frontend/`)

| Library | Version | Purpose |
|---------|---------|---------|
| **Next.js** | 14.2 (App Router) | React framework, Server Components, routing |
| **React** | 18 | UI rendering |
| **TypeScript** | 5 (strict) | Type safety |
| **Tailwind CSS** | 3.4 | Utility-first styling |
| `tailwindcss-animate`, `tw-animate-css` | — | Animation utilities |
| `tailwind-merge`, `clsx`, `class-variance-authority` | — | Class composition (shadcn/ui helpers) |
| **shadcn/ui** + **@base-ui/react** | 4 / 1 | Accessible headless UI primitives (dialog, select, tabs…) |
| **lucide-react** | — | Icon set |
| **Recharts** | 3 | Revenue / spending charts, status donut |
| **Framer Motion** | 12 | Dashboard animations, count-up stats |
| **GSAP** + **@gsap/react** | 3 | Scroll-triggered animations (About page) |
| **Leaflet** + **react-leaflet** | 1.9 / 4 | Interactive map for geolocated catalogue search |
| **dotted-map** | — | Stylized Morocco map (landing) |
| **ogl** | — | WebGL circular image gallery |
| **socket.io-client** | 4 | Real-time messaging & notifications |

> PDF exports (receipts, statements, reports) are generated **client-side** via a generated print window (`window.open` + `window.print()`) — no PDF library dependency. See `lib/pdf.ts`.

### Backend (`backend/`)

| Library | Version | Purpose |
|---------|---------|---------|
| **Node.js** | 20 | Runtime |
| **Express** | 5 | HTTP framework |
| **MongoDB** + **Mongoose** | 9 | Database & ODM (schema validation) |
| **Socket.IO** | 4 | Real-time bidirectional events |
| **jsonwebtoken** | 9 | Authentication tokens |
| **bcryptjs** | 12 rounds | Password hashing |
| **helmet** | 8 | Security HTTP headers |
| **cors** | — | Cross-origin configuration |
| **express-validator** | 7 | Input validation |
| **express-rate-limit** | 8 | Global + auth rate limiting |
| **multer** | 2 | File uploads (equipment photos) |
| **nodemailer** | 8 | Transactional emails |
| **node-cron** | 4 | Daily email reminder job (08:00) |
| **swagger-jsdoc** + **swagger-ui-express** | — | Auto-generated API docs at `/api-docs` |
| **dotenv** | — | Environment configuration |
| `nodemon` (dev) | — | Hot reload |

---

## Project Structure

```text
kreli/
├── frontend/                              # Next.js 14 App Router
│   └── src/
│       ├── app/
│       │   ├── layout.tsx                     # Root layout (fonts, Providers, Navbar, Footer)
│       │   ├── page.tsx                       # Homepage
│       │   ├── about/                         # About page + AboutClient/Values/Team
│       │   ├── catalogue/                     # Catalogue + Client/Filters/ProductCard/Pagination
│       │   ├── materiel/[id]/                 # Detail + Reservation/Contact modals, SimilarMateriels
│       │   ├── auth/                          # login, signup (RoleSelector), forgot/reset password
│       │   └── dashboard/
│       │       ├── page.tsx                   # Role-based redirect
│       │       ├── locataire/                 # Renter dashboard (layout + pages + co-located parts)
│       │       ├── proprietaire/              # Owner dashboard
│       │       └── admin/                      # Admin panel (users, materiels, locations, paiements, litiges, categories)
│       ├── components/
│       │   ├── Navbar.tsx · Footer.tsx · Providers.tsx · CookieBanner.tsx
│       │   ├── HeroSearch.tsx · AnimatedSection.tsx · Testimonials*.tsx
│       │   ├── ui/                            # shadcn/ui primitives + custom visual components
│       │   ├── dashboard/                     # Sidebars, DashboardUI, MessagesView, charts
│       │   ├── catalogue/                     # LocationFilter, MapPickerLeaflet
│       │   └── landing/                       # Hero, Category, Featured, HowItWorks, CTA sections
│       ├── context/
│       │   ├── AuthContext.tsx                # Global auth state (useAuth)
│       │   └── I18nContext.tsx                # Locale, RTL, translations (useI18n, t)
│       ├── hooks/
│       │   ├── useSocket.ts                   # Socket.IO singleton
│       │   ├── useNotifications.ts            # Real-time notification count
│       │   └── useNominatim.ts                # City/address autocomplete (OpenStreetMap)
│       ├── lib/
│       │   ├── api.ts                         # All API calls + shared types + formatters
│       │   ├── auth.ts                        # localStorage/cookie auth helpers
│       │   ├── pdf.ts                         # Receipt / statement / report PDF builders
│       │   └── format.ts                      # Date formatting helpers
│       └── locales/                           # fr.json, en.json, ar.json (+ ber.json, zgh.json)
├── backend/
│   └── src/
│       ├── index.js                           # Express + HTTP server entry
│       ├── socket/index.js                    # Socket.IO setup (auth, presence, chat events)
│       ├── config/
│       │   ├── db.js                          # MongoDB connection
│       │   └── swagger.js                     # Swagger spec
│       ├── controllers/                       # auth, categories, conversations, locations,
│       │   │                                  #   materiels, notifications, paiements, litiges, users
│       ├── middleware/
│       │   ├── auth.middleware.js             # verifyToken + requireRole
│       │   ├── errorHandler.middleware.js     # Central error handler
│       │   └── upload.middleware.js           # multer config
│       ├── models/                            # User, Categorie, Materiel, Location, Paiement,
│       │   │                                  #   CommissionConfig, Litige, Conversation, Message, Notification
│       ├── routes/                            # one *.routes.js per resource (10 total)
│       ├── services/
│       │   ├── email.service.js               # Nodemailer + HTML templates
│       │   └── reminders.cron.js              # Daily 08:00 cron job
│       ├── utils/
│       │   ├── ApiError.js · asyncHandler.js  # Error helpers
│       │   ├── validate.js                    # Shared express-validator middleware
│       │   ├── mailer.js · cities.js          # Mail transport, Moroccan city geodata
│       └── seeds/index.seed.js                # Database seed script
└── docker-compose.yml
```

---

## Design System & Theming

The app has two coordinated visual layers:

- **Storefront** (public pages) — a warm marketing theme with custom Tailwind tokens.
- **Dashboards** (locataire / propriétaire / admin) — a unified design system implemented in `components/dashboard/DashboardUI.tsx`, used as the single reference for every dashboard page.

### Tailwind theme tokens (`tailwind.config.ts`)

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#004e98` | Primary actions / accents |
| `brand` | `#ff6700` | CTAs, prices, highlights |
| `ink` | `#0f172a` | Main text (navy) |
| `muted` / `muted-light` | `#64748b` / `#94a3b8` | Secondary text |
| `surface` / `surface-alt` | `#ffffff` / `#fdf4f8` | Cards / alt surfaces |
| `rose` · `pink` · `mauve` · `lavender` | — | Warm accent palette |

### Dashboard design tokens

| Token | Value |
|-------|-------|
| Background | `#F8FAFC` |
| Navy (text/headers) | `#0F172A` |
| Accent (orange) | `#F97316` (sidebar `#F8812B`) |
| Border | `#E2E8F0` |
| Muted text | `#64748B` / `#94A3B8` |

### Fonts (via CSS variables)

Inter (body), Inter Tight (`--font-display`), JetBrains Mono (`--font-mono`), Cairo (`--font-arabic`), Plus Jakarta Sans (`--font-jakarta`).

---

## Internationalization (i18n)

- Managed in `context/I18nContext.tsx`; translations in `src/locales/*.json`; accessed with `t("key.nested")` from `useI18n()`.
- **Active locales:** `fr` (default), `en`, `ar` (RTL). Additional locale files (`ber.json`, `zgh.json`) exist in the repo but are not currently wired into the context.
- Locale resolution order: path prefix (`/fr/…`) → `?locale=` query → cookie `Kreli_locale` → `localStorage`.
- RTL is applied automatically for `ar` via `document.documentElement.dir`. Switching locale navigates to `/{locale}/path`.

---

## Pages & Routes

### Public

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero + search, categories, featured equipment, how-it-works, testimonials, CTA |
| `/catalogue` | Filterable catalogue — search, category, city/radius map filter, price, availability, sort, pagination |
| `/materiel/[id]` | Equipment detail — gallery, specs, owner info, reservation + contact modals, similar items |
| `/about` | About page (GSAP scroll animations, values, team) |
| `/auth/login` | Login |
| `/auth/signup` | Registration with role selection (locataire / propriétaire / both) |
| `/auth/forgot-password`, `/auth/reset-password` | Password recovery flow |

### Locataire Dashboard (auth required)

| Route | Description |
|-------|-------------|
| `/dashboard/locataire` | Overview — stat cards, spending chart, status donut, recent rentals, recommendations |
| `/dashboard/locataire/locations` | Filterable rentals list with status + actions (dispute modal) |
| `/dashboard/locataire/favoris` | Saved favorite equipment |
| `/dashboard/locataire/paiements` | Transactions table + PDF receipt / statement export |
| `/dashboard/locataire/messages` | Real-time chat (`?conv=ID` opens a thread) |
| `/dashboard/locataire/profile` | Edit profile + change password |

### Propriétaire Dashboard (auth required)

| Route | Description |
|-------|-------------|
| `/dashboard/proprietaire` | Overview — fleet grid, incoming requests (accept/reject), revenue chart |
| `/dashboard/proprietaire/ajouter` | Create listing (with photo uploader) |
| `/dashboard/proprietaire/materiels` · `/materiels/[id]/edit` | Manage / edit fleet |
| `/dashboard/proprietaire/locations` | Received rentals with workflow actions |
| `/dashboard/proprietaire/revenus` | Revenue overview |
| `/dashboard/proprietaire/messages` · `/profile` | Chat & profile |

### Admin Panel (auth required)

| Route | Description |
|-------|-------------|
| `/dashboard/admin` | Platform stats overview |
| `/dashboard/admin/users` | Manage users / change status (actif / suspendu / bloqué) |
| `/dashboard/admin/materiels` | Moderate listings, toggle "vedette" (featured) |
| `/dashboard/admin/locations` | Platform-wide rental activity |
| `/dashboard/admin/paiements` | Payment records |
| `/dashboard/admin/litiges` | Disputes management |
| `/dashboard/admin/categories` | Category management |

> `/dashboard/messages` is a legacy redirect that forwards to the role-appropriate messages page (preserving `?conv=ID`).

---

## Features

- **Catalogue & geo-search** — full-text search, category/price/availability filters, sort, server-side pagination, plus a **Leaflet map** filter by city + radius (geospatial query) with Nominatim address autocomplete.
- **Rental workflow** — strict state machine (see below); equipment availability auto-toggled; price & commission snapshotted at booking time.
- **Favorites** — renters can save equipment (`favoris` on the user).
- **Real-time chat** — per-equipment conversations, instant delivery to both participants, unread badge, read receipts. A chat content filter blocks phone numbers and URLs.
- **Real-time notifications** — pushed on new messages and dispute decisions; auto-expire after 30 days (TTL index). Types: `reservation` · `paiement` · `message` · `litige` · `retard` · `compte` · `materiel`.
- **Online presence** — `user_online` / `user_offline` broadcasts; each user in a personal room for targeted emits.
- **Payments tracking** — `Paiement` records per rental (location fee + deposit), with PDF receipt / statement export.
- **Disputes** — renters/owners open a `Litige`; admins review and record a decision (notifies the opener).
- **File uploads** — equipment photos via multer, served at `/uploads/*`, stored as an ordered array.
- **Admin controls** — change user status, moderate listings, toggle featured equipment, manage categories/payments/disputes.
- **i18n & RTL** — French / English / Arabic.
- **Cookie consent**, **PDF exports**, **Swagger docs** at `/api-docs`.

### Rental Workflow

```
en_attente → acceptee → en_cours → terminee
     ↓             ↓
  annulee        refusee          (+ en_retard, en_litige)
```

| Status | Who transitions | How |
|--------|----------------|-----|
| `en_attente` | System | Rental request created (`disponible=false`) |
| `acceptee` | Propriétaire | `POST /locations/:id/accept` |
| `refusee` | Propriétaire | `POST /locations/:id/reject` (restores availability) |
| `en_cours` | Propriétaire | `POST /locations/:id/start` |
| `terminee` | Locataire/Owner | `POST /locations/:id/return` (restores availability) |
| `annulee` | Locataire | `DELETE /locations/:id` (only from `en_attente`/`acceptee`) |

### Pricing & Commission
- `prixParJour` snapshotted at booking — later owner price changes don't affect active rentals.
- Commission rate stored in `CommissionConfig` (default **10%**).
- `montantLocation = prixParJour × nbJours`; `commissionMontant = montantLocation × taux`; `montantNetProprio = montantLocation − commissionMontant`; deposit stored as `cautionMontant`.

---

## Data Models

All schemas use `timestamps: true`. Responses follow `{ success, data, message }`.

- **User** — `nom`, `email` (unique), `password` (bcrypt), `telephone`, `photo`, `adresse`, `role` (`locataire`|`proprietaire`|`both`|`admin`), `statut` (`actif`|`suspendu`|`bloque`), `favoris` (→ Materiel[]).
- **Categorie** — `nom`, `description`, `image`.
- **Materiel** — `nom`, `description`, `photos[{url, ordre}]`, `prixParJour`, `caution`, `localisation`, `location` (GeoJSON Point), `etat` (`neuf`|`bon_etat`|`usage`), `disponible`, `featured`, `proprietaireId`, `categorieId`.
- **Location** — `materielId`, `locataireId`, `dateDebut`, `dateFinPrevue`, `dateRetourReelle`, `statut` (full state machine), `nbJours`, `prixParJour`, `montantLocation`, `cautionMontant`, `commissionTaux`, `commissionMontant`, `montantNetProprio`, retard/penalty fields, `statutCaution`.
- **Paiement** — `locationId`, `type` (`location`|`caution`|`remboursement`|`remboursement_partiel`|`penalite`|`annulation`), `montant`, `statut`, `note`.
- **CommissionConfig** — `taux` (default 10%), `modifiePar`.
- **Litige** — `locationId`, `ouvertPar`, `description`, `statut` (`ouvert`|`en_cours`|`cloture`), `preuves[]`, `decisionAdmin`, `adminId`.
- **Conversation** — `materielId`, `locataireId`, `proprietaireId`, `dernierMsgAt`; unique compound index per `(materiel, locataire, proprietaire)`.
- **Message** — `conversationId`, `expediteurId`, `contenu`, `imageUrl?`, `lu`.
- **Notification** — `destinataireId`, `type`, `titre`, `contenu`, `lu`, `lienRedirection`; TTL index (30 days).

---

## API Reference

Base URL: `http://localhost:5000/api/v1` · Interactive docs: `http://localhost:5000/api-docs`

### Auth — `/auth`
`POST /register` · `POST /login` · `GET /me` · `PUT /profile` · `POST /forgot-password` · `POST /reset-password`

### Categories — `/categories`
`GET /` (+ admin CRUD)

### Materiels — `/materiels`
`GET /featured` · `GET /` (filters: `q`, `categorie`, `ville`, `rayon`, `lat`, `lng`, `prixMin`, `prixMax`, `disponibilite`, `page`, `limit`, `sort`) · `GET /mine` · `GET /:id` · `GET /:id/similar` · `POST /` · `PUT /:id` (owner **or** admin; `featured` admin-only) · `DELETE /:id` (owner or admin)

### Locations — `/locations`
`POST /` · `GET /` (own) · `GET /owner` · `GET /admin/all` (admin) · `GET /stats` · `GET /:id` · `DELETE /:id` (cancel) · `POST /:id/accept` · `POST /:id/reject` · `POST /:id/start` · `POST /:id/return`

### Users — `/users`
`GET|PUT /me` · `PUT /me/password` · `GET /me/favoris` · `POST /me/favoris/:materielId` (toggle) · `GET /stats/owner` · `GET /stats/locataire` · `GET /stats/admin` · `GET /` (admin) · `GET /:id` · `PATCH /:id/status` (admin)

### Conversations — `/conversations`
`GET /` · `POST /` (get-or-create) · `GET /:id/messages`

### Notifications — `/notifications`
`GET /` · `PATCH /read-all` · `PATCH /:id/read`

### Paiements — `/paiements`
`GET /stats` · `GET /` · `GET /:id` · `PATCH /:id`

### Litiges — `/litiges`
`GET /stats` · `GET /my` · `GET /` (admin) · `GET /:id` · `POST /` (open) · `PATCH /:id/status` (admin decision)

### Upload — `/upload`
`POST /` — multipart image upload (multer)

### System
`GET /health` · `GET /api-docs` · `GET /uploads/*` (static)

---

## Real-time (Socket.IO)

Connection requires a valid JWT in `socket.handshake.auth.token`; invalid tokens are rejected. Each user is joined to a personal room keyed by `userId`. Socket logic lives in `backend/src/socket/index.js`; the server exposes `app.get("io")` and `app.get("onlineUsers")`.

### Server → Client

| Event | Trigger |
|-------|---------|
| `online_users` | On connect — current online user IDs |
| `user_online` / `user_offline` | First connect / last disconnect |
| `receive_message` | After `send_message` (to both participants) |
| `message_error` | Blocked content (phone/URL) or handler error |
| `new_notification` | After a message arrives (to recipient) |
| `messages_read` | After `mark_read` (to original sender) |
| `location_update` | After accept/reject/start/return |

### Client → Server
`send_message` `{ conversationId, contenu, imageUrl? }` · `mark_read` `{ conversationId }`

---

## Authentication & Authorization

- **Register** → express-validator (min 8 chars, uppercase, digit, valid phone, valid role) → bcrypt (12 rounds) → JWT.
- **Login** → lookup by email → status check (suspended/blocked rejected) → bcrypt compare → JWT (7-day expiry). Payload: `{ id, email, role, statut }`.
- **`verifyToken`** reads `Authorization: Bearer <token>`, verifies signature, re-checks `statut` per request (suspended/blocked → 403), attaches `req.user`.
- **`requireRole(...roles)`** — `both` satisfies either `locataire` or `proprietaire` checks; `admin` guards admin routes.
- **Dashboard protection is client-side** in each `layout.tsx` via `useAuth()` (middleware handles locale routing only, not auth).
- **Frontend token storage:** `localStorage["Kreli_token"]` + `localStorage["Kreli_user"]`, plus a `Kreli_token` cookie written by `saveAuth()`.

---

## Database Fixtures (Seeds)

`cd backend && npm run seed` wipes all collections and loads a full demo dataset: admin, owners, a renter, categories, equipment (featured + more), rentals, payments, conversations, messages, and notifications.

### Default accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@Kreli.ma` | `Admin@2024` |
| Propriétaire | `yassine@Kreli.ma` | `Proprio@2024` |
| Propriétaire | `aya@Kreli.ma` | `Proprio@2024` |
| Propriétaire | `sara@demo.ma` | `Sara@2024` |
| Locataire | `karim@demo.ma` | `Karim@2024` |

Initial commission rate: **10%**. Categories: BTP & Chantier, Outillage Pro, Evénementiel, Électronique, Agriculture, Industrie.

---

## Email & Cron

- **`services/email.service.js` / `utils/mailer.js`** — Nodemailer transport + HTML templates (rental return reminder, pending-request follow-up, password reset). Silently skipped if SMTP env vars are absent.
- **`services/reminders.cron.js`** — runs daily at **08:00**: emails return reminders for rentals ending soon and follow-ups for requests pending 24h+.

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/kreli   # or mongodb://127.0.0.1:27017/kreli
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000          # comma-separated for multiple origins
NODE_ENV=development

# Optional — emails silently skipped if absent
EMAIL_USER=you@gmail.com
EMAIL_PASS=your_app_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_FROM=Kreli <noreply@kreli.ma>
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000     # used for OG metadata canonical URLs
```

---

## Local Setup

```bash
# 1. Install
cd backend && npm install
cd ../frontend && npm install

# 2. Configure backend/.env and frontend/.env.local (see templates above)

# 3. Seed the database
cd backend && npm run seed

# 4. Run (two terminals)
cd backend && npm run dev      # http://localhost:5000  (nodemon)
cd frontend && npm run dev     # http://localhost:3000
```

Other scripts: `frontend` → `npm run build`, `npm run start`, `npm run lint`. Backend has no test runner — verify by running the app. Swagger at `http://localhost:5000/api-docs`, health check at `GET /api/v1/health`.

---

## Docker

```bash
docker-compose up
```

| Service | Image | Port | Notes |
|---------|-------|------|-------|
| `backend` | `node:20-alpine` | `5000` | `npm install && npm run dev`; mounts `./backend` |
| `frontend` | `node:20-alpine` | `3000` | `npm install && npm run dev`; depends on `backend` |

MongoDB is **not** containerized — set `MONGODB_URI` in `backend/.env` (Atlas or a local/host MongoDB).

> The `NEXT_PUBLIC_API_URL` baked into the frontend container should point at the backend (`http://localhost:5000/api/v1`).

---

## Deployment

| Service | Target |
|---------|--------|
| Frontend | Vercel |
| Backend | Railway / Render / any Node.js host |
| Database | MongoDB Atlas (or self-hosted MongoDB) |

See `DEPLOY.md` for details.

---

<div align="center">

Built for **Kreli** — PFE 2024/2025

</div>
