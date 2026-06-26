# Kreli — Team Handover Master Document

**Project**: Kreli (formerly LocaMat) — Equipment rental marketplace for Morocco  
**Stack**: Next.js 14 + Express 5 + MongoDB + Socket.IO  
**Date**: June 2026

---

## Responsibility Matrix

| Domain | Member | Frontend Pages | Components | Backend Controllers | Models |
|--------|--------|---------------|------------|-------------------|--------|
| Auth & Authorization | **Ahmed** | auth/login, auth/signup, auth/forgot-password, auth/reset-password, locataire/profile, proprietaire/profile | RoleSelector, ProfileHeader×2, SecurityForm×2, Providers | auth.controller, users.controller | User |
| Renter Space + Messaging | **Meriem** | locataire/dashboard, locataire/locations, locataire/messages, locataire/favoris, locataire/paiements, dashboard/messages | LocataireSidebar, MessagesView, SpendingChart, LocationRow, LitigeModal, TransactionsTable | conversations.controller, notifications.controller, locations.controller (locataire), users.controller (favorites) | Conversation, Message, Notification |
| Owner Space | **Youssef** | proprietaire/dashboard, proprietaire/ajouter, proprietaire/materiels, proprietaire/materiels/[id]/edit, proprietaire/locations, proprietaire/revenus, proprietaire/messages, proprietaire/profile | ProprietaireSidebar, RevenusChart, StatusDonutChart, PhotoUploader, OwnerLocationRow, RevenueChartCard, DemandesCard, ParcTable | materiels.controller (owner), locations.controller (owner), paiements.controller (owner) | Materiel, CommissionConfig |
| Admin Panel | **Sara** | admin/dashboard, admin/users, admin/categories, admin/litiges, admin/locations, admin/materiels, admin/paiements | AdminSidebar, DashboardUI (StatCard) | users.controller (admin), categories.controller, litiges.controller, paiements.controller (admin), locations.controller (admin stats) | Categorie, Litige |
| Public Experience | **Asmaa** | homepage, catalogue, materiel/[id], about | Navbar, Footer, HeroSearch, HomeLandingClient, HeroSection, MoroccoHeroSection, CategorySection, FeaturedSection, CatalogueClient, CatalogueFilters, ProductCard, MapPickerLeaflet, MaterielDetailClient, ReservationModal, ContactModal, AboutClient | materiels.controller (public), categories.controller (public), locations.controller (createLocation) | — (reads Materiel, Categorie) |

---

## File Count Per Member

| Member | Frontend Files | Backend Files | Total |
|--------|---------------|---------------|-------|
| Ahmed | 11 files (pages + components + context + lib) | 4 files (controller, routes, middleware, model) | **15** |
| Meriem | 12 files (pages + components + hooks) | 6 files (controllers, routes, models, socket) | **18** |
| Youssef | 13 files (pages + components) | 5 files (controllers, routes, models, middleware) | **18** |
| Sara | 9 files (pages + components) | 7 files (controllers, routes, models) | **16** |
| Asmaa | 30 files (pages + components + hooks + i18n + lib) | 3 files (public controller endpoints) | **33** |

*Note: Many backend controllers serve multiple members (shared ownership)*

---

## Shared Files (Multi-member Dependencies)

| File | Used By | Why Shared |
|------|---------|-----------|
| `frontend/src/lib/api.ts` | **All 5** | Central fetch layer — types, API functions, formatters |
| `frontend/src/context/AuthContext.tsx` | **All 5** | useAuth() consumed by every dashboard layout and many components |
| `frontend/src/middleware.ts` | **All 5** | Locale routing for ALL pages |
| `frontend/src/components/Navbar.tsx` | **Asmaa** (primary) | Uses useAuth (Ahmed) + useI18n (Asmaa) — global |
| `frontend/src/components/Providers.tsx` | **Ahmed** (primary) | Wraps AuthProvider + I18nProvider |
| `frontend/src/context/I18nContext.tsx` | **Asmaa** + all | i18n used in navbar and all pages |
| `frontend/src/hooks/useSocket.ts` | **Meriem** + **Youssef** | Socket singleton for both locataire and proprietaire messages |
| `frontend/src/components/dashboard/MessagesView.tsx` | **Meriem** + **Youssef** | Same chat component used by both dashboards |
| `frontend/src/components/dashboard/DashboardUI.tsx` | **Youssef** + **Sara** | StatCard used in both proprietaire and admin dashboards |
| `backend/src/middleware/auth.middleware.js` | **Ahmed** (primary) | verifyToken + requireRole used by ALL protected routes |
| `backend/src/middleware/upload.middleware.js` | **Youssef** + **Sara** | Multer config for equipment (Youssef) and category images (Sara) |
| `backend/src/models/User.js` | **Ahmed** + **Sara** | Auth (Ahmed), admin user management (Sara), populated by all |
| `backend/src/models/Location.js` | **Meriem** + **Youssef** + **Sara** + **Asmaa** | Core domain model — every domain reads/writes it |
| `backend/src/models/Materiel.js` | **Youssef** + **Sara** + **Asmaa** | Owner CRUD (Youssef), admin moderation (Sara), public listing (Asmaa) |
| `backend/src/models/Paiement.js` | **Meriem** + **Youssef** + **Sara** | Renter view, owner revenues, admin oversight |
| `backend/src/controllers/locations.controller.js` | **Meriem** + **Youssef** + **Sara** + **Asmaa** | One file, four domains' endpoints |
| `backend/src/controllers/materiels.controller.js` | **Youssef** + **Sara** + **Asmaa** | Owner CRUD, admin moderation, public listing |
| `backend/src/controllers/paiements.controller.js` | **Meriem** + **Youssef** + **Sara** | Multi-role payment access |
| `backend/src/socket/index.js` | **Meriem** + **Youssef** | Message delivery for both dashboard types |
| `backend/src/utils/asyncHandler.js` | **All backend** | Error wrapper for all async controllers |
| `backend/src/utils/ApiError.js` | **All backend** | Standard error class |

---

## Global Architecture

```
Browser
  ↓ locale routing
Next.js Middleware (middleware.ts) ← Asmaa
  ↓ strips /fr/, /en/, etc.
App Router Pages
  ├── Public (Asmaa): / | /catalogue | /materiel/[id] | /about
  ├── Auth (Ahmed): /auth/login | /auth/signup | /auth/forgot-password | /auth/reset-password
  └── Dashboard
      ├── Admin (Sara): /dashboard/admin/**
      ├── Locataire (Meriem): /dashboard/locataire/**
      └── Proprietaire (Youssef): /dashboard/proprietaire/**

  ↓ all API calls via api.ts (Authorization: Bearer token from localStorage)
Express /api/v1/*
  ↓ verifyToken middleware (Ahmed)
  ├── auth.routes.js (Ahmed)
  ├── categories.routes.js (Sara/Asmaa)
  ├── conversations.routes.js (Meriem)
  ├── litiges.routes.js (Sara)
  ├── locations.routes.js (Meriem + Youssef + Sara + Asmaa)
  ├── materiels.routes.js (Youssef + Sara + Asmaa)
  ├── notifications.routes.js (Meriem)
  ├── paiements.routes.js (Meriem + Youssef + Sara)
  ├── upload.routes.js (Youssef + Sara)
  └── users.routes.js (Ahmed + Meriem + Sara)

  ↓ Mongoose models
MongoDB
  ├── users (Ahmed + Sara)
  ├── materiels (Youssef + Sara + Asmaa)
  ├── locations (Meriem + Youssef + Sara + Asmaa)
  ├── conversations + messages (Meriem)
  ├── notifications (Meriem)
  ├── paiements (Meriem + Youssef + Sara)
  ├── litiges (Sara)
  ├── categories (Sara + Asmaa)
  └── commissionconfigs (Youssef + Sara)

Socket.IO (Meriem + Ahmed for token verification)
  └── events: send_message, receive_message, mark_read, messages_read,
              new_notification, user_online, user_offline, online_users
```

---

## Soutenance Checklist

### Global
- [ ] Docker Compose starts all services correctly
- [ ] Swagger docs accessible at `/api-docs`
- [ ] Health check: `GET /api/v1/health` returns 200
- [ ] All 4 locales render correctly (fr, en, ar RTL, zgh)

### Ahmed (Auth)
- [ ] Register → receive JWT → redirected by role
- [ ] Login error messages (wrong password, suspended account)
- [ ] Password reset email received and link works
- [ ] Dashboard layout redirects on unauthorized access
- [ ] Password change in profile works and refreshes token

### Meriem (Renter)
- [ ] Create rental → appears in locataire/locations with en_attente status
- [ ] Open litige from in-progress rental
- [ ] Real-time message sending + receiving (open two browsers)
- [ ] Phone number blocked in chat (message_error event)
- [ ] Notification bell updates in real-time
- [ ] Favorites: add from detail page → appear in locataire/favoris

### Youssef (Owner)
- [ ] Create equipment with multiple photos
- [ ] Accept rental → locataire receives notification
- [ ] Reject rental → materiel becomes available again
- [ ] Revenue chart shows completed rental amounts
- [ ] Edit/delete equipment
- [ ] Owner messages work (same MessagesView as locataire)

### Sara (Admin)
- [ ] Admin stats load with correct counts
- [ ] Suspend user → that user gets 403 on next API call
- [ ] Create category → appears in public catalogue filter
- [ ] Assign + resolve litige → location status updated
- [ ] Featured toggle on materiel → appears/disappears on homepage

### Asmaa (Public)
- [ ] Homepage loads with featured equipment
- [ ] Catalogue full-text search works
- [ ] Geolocation filter (with map) finds nearby equipment
- [ ] Equipment detail page has correct OG metadata
- [ ] ReservationModal calculates price correctly
- [ ] ContactModal creates conversation + redirects to messages
- [ ] Arabic locale displays RTL correctly
- [ ] Catalogue URL params can be bookmarked/shared

---

## Who Needs Class Diagrams

| Member | Diagrams Needed |
|--------|----------------|
| **Ahmed** | User class + AuthContext class + JWT sequence |
| **Meriem** | Conversation + Message + Notification classes + Socket sequence |
| **Youssef** | Materiel + CommissionConfig + Location (owner view) + rental workflow state machine |
| **Sara** | Categorie + Litige + full domain class diagram + admin use-case diagram |
| **Asmaa** | Materiel (public view) + i18n state + catalogue sequence |

---

## Who Needs Sequence Diagrams

| Member | Key Sequences |
|--------|--------------|
| **Ahmed** | Login, Registration, Password Reset, Token Verification |
| **Meriem** | Send Message (Socket), Create Rental, Open Litige |
| **Youssef** | Accept Rental (→ notifications + payments), Create Equipment (upload + save) |
| **Sara** | Resolve Litige (→ cascade effects), User Suspension |
| **Asmaa** | Catalogue Search (with geo), Equipment Reservation |

---

## Who Needs Screenshots

| Member | Min Screenshots |
|--------|----------------|
| Ahmed | 8 (auth flows + profile) |
| Meriem | 8 (dashboard + chat + litige + notifs + favoris + payments) |
| Youssef | 8 (dashboard + create + locations + revenues) |
| Sara | 9 (all admin sections + litige resolution) |
| Asmaa | 10 (homepage + catalogue + geo + detail + reservation + RTL) |

---

*This document was generated by analyzing actual source code imports, dependencies, and data flows — not folder names alone.*
