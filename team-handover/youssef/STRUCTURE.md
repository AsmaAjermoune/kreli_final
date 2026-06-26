# Youssef — Owner Space (Espace Propriétaire)

## Responsibility Overview
Youssef owns the propriétaire (owner) dashboard: equipment management (create, edit, list), rental request approval/rejection, revenue tracking, and the owner messaging interface. He also owns the backend for materiels, owner statistics, file upload, and the rental workflow lifecycle (accept/reject/complete).

---

## Pages

| Page | Path |
|------|------|
| Propriétaire Dashboard | `frontend/src/app/dashboard/proprietaire/page.tsx` |
| Add Equipment | `frontend/src/app/dashboard/proprietaire/ajouter/page.tsx` |
| Owner Rentals | `frontend/src/app/dashboard/proprietaire/locations/page.tsx` |
| My Equipment List | `frontend/src/app/dashboard/proprietaire/materiels/page.tsx` |
| Edit Equipment | `frontend/src/app/dashboard/proprietaire/materiels/[id]/edit/page.tsx` |
| Owner Messages | `frontend/src/app/dashboard/proprietaire/messages/page.tsx` |
| Owner Revenues | `frontend/src/app/dashboard/proprietaire/revenus/page.tsx` |
| Owner Profile | `frontend/src/app/dashboard/proprietaire/profile/page.tsx` (shared with Ahmed for SecurityForm) |

---

## Components

| Component | Path | Role |
|-----------|------|------|
| ProprietaireSidebar | `frontend/src/components/dashboard/ProprietaireSidebar.tsx` | Navigation sidebar |
| RevenusChart | `frontend/src/components/dashboard/RevenusChart.tsx` | Revenue visualization chart |
| StatusDonutChart | `frontend/src/components/dashboard/StatusDonutChart.tsx` | Location status donut chart |
| DashboardUI (StatCard) | `frontend/src/components/dashboard/DashboardUI.tsx` | Shared stat card (used in proprietaire dashboard) |
| PhotoUploader | `frontend/src/app/dashboard/proprietaire/ajouter/PhotoUploader.tsx` | Multi-photo upload with preview |
| OwnerLocationRow | `frontend/src/app/dashboard/proprietaire/locations/OwnerLocationRow.tsx` | Rental row with accept/reject actions |
| ProfileHeader (proprietaire) | `frontend/src/app/dashboard/proprietaire/profile/ProfileHeader.tsx` | User info display |
| SecurityForm (proprietaire) | `frontend/src/app/dashboard/proprietaire/profile/SecurityForm.tsx` | Password change (shared with Ahmed) |
| RevenueChartCard | `frontend/src/app/dashboard/proprietaire/RevenueChartCard.tsx` | Revenue summary card |
| DemandesCard | `frontend/src/app/dashboard/proprietaire/DemandesCard.tsx` | Pending rental requests card |
| ParcTable | `frontend/src/app/dashboard/proprietaire/ParcTable.tsx` | Equipment fleet table |

---

## Hooks

| Hook | Path | Purpose |
|------|------|---------|
| useSocket | `frontend/src/hooks/useSocket.ts` | Real-time socket for owner messages (shared) |
| useAuth | `frontend/src/context/AuthContext.tsx` | Access current user (shared) |

---

## Backend APIs

| Controller | Path | Owner Endpoints |
|-----------|------|----------------|
| materiels.controller.js | `backend/src/controllers/materiels.controller.js` | createMateriel, updateMateriel, deleteMateriel, getMyMateriels, getOwnerStats |
| locations.controller.js (owner) | `backend/src/controllers/locations.controller.js` | getOwnerLocations, acceptLocation, rejectLocation, markEnCours, markTerminee |
| paiements.controller.js (owner) | `backend/src/controllers/paiements.controller.js` | getOwnerPaiements, getOwnerRevenues |
| upload (middleware) | `backend/src/middleware/upload.middleware.js` | multer disk storage for equipment photos |

---

## Routes

| File | Path | Key Routes |
|------|------|-----------|
| materiels.routes.js | `backend/src/routes/materiels.routes.js` | POST /materiels, PUT /materiels/:id, DELETE /materiels/:id, GET /materiels/my |
| locations.routes.js (owner) | `backend/src/routes/locations.routes.js` | GET /locations/owner, PATCH /locations/:id/accept, PATCH /locations/:id/reject |
| upload.routes.js | `backend/src/routes/upload.routes.js` | POST /upload (multipart/form-data) |

---

## Models

| Model | Path | Key Fields |
|-------|------|-----------|
| Materiel | `backend/src/models/Materiel.js` | nom, photos, prixParJour, caution, disponible, featured, proprietaireId, categorieId, location (GeoJSON) |
| Location | `backend/src/models/Location.js` | statut lifecycle, commissionTaux, montantNetProprio (shared) |
| CommissionConfig | `backend/src/models/CommissionConfig.js` | taux (platform commission rate) |

---

## Services

| File | Path | Purpose |
|------|------|---------|
| reminders.cron.js | `backend/src/services/reminders.cron.js` | Daily cron at 08:00 — emails rental reminders to owners |
| upload.middleware.js | `backend/src/middleware/upload.middleware.js` | Multer config for image uploads |

---

## Dependencies

- `multer` — file upload middleware
- `express-validator` — equipment form validation
- `mongoose` — Materiel, Location, CommissionConfig models
- `socket.io-client` — owner receives messages via socket (shared MessagesView)
- `recharts` or `chart.js` — revenue charts (RevenusChart, StatusDonutChart)
