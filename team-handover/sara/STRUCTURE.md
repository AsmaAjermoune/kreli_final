# Sara — Admin Panel

## Responsibility Overview
Sara owns the administration panel: platform-wide management of users, equipment moderation, categories, disputes (litiges), payments oversight, and commission configuration. She also owns backend admin routes, statistics aggregation, and moderation actions.

---

## Pages

| Page | Path |
|------|------|
| Admin Dashboard | `frontend/src/app/dashboard/admin/page.tsx` |
| Admin Users | `frontend/src/app/dashboard/admin/users/page.tsx` |
| Admin Categories | `frontend/src/app/dashboard/admin/categories/page.tsx` |
| Admin Litiges (Disputes) | `frontend/src/app/dashboard/admin/litiges/page.tsx` |
| Admin Locations | `frontend/src/app/dashboard/admin/locations/page.tsx` |
| Admin Materiels | `frontend/src/app/dashboard/admin/materiels/page.tsx` |
| Admin Paiements | `frontend/src/app/dashboard/admin/paiements/page.tsx` |

---

## Components

| Component | Path | Role |
|-----------|------|------|
| AdminSidebar | `frontend/src/components/dashboard/AdminSidebar.tsx` | Admin navigation |
| DashboardUI (StatCard) | `frontend/src/components/dashboard/DashboardUI.tsx` | Stat cards (shared with Youssef) |

---

## Hooks

| Hook | Path | Purpose |
|------|------|---------|
| useAuth | `frontend/src/context/AuthContext.tsx` | Verify admin role (shared) |

---

## Backend APIs

| Controller | Path | Admin Endpoints |
|-----------|------|----------------|
| users.controller.js | `backend/src/controllers/users.controller.js` | getAllUsers, getUserById, updateUser (suspend/block/reactivate), deleteUser |
| categories.controller.js | `backend/src/controllers/categories.controller.js` | getAllCategories, createCategorie, updateCategorie, deleteCategorie |
| litiges.controller.js | `backend/src/controllers/litiges.controller.js` | getAllLitiges, getLitige, assignLitige, resolveLitige |
| materiels.controller.js (admin) | `backend/src/controllers/materiels.controller.js` | Admin: featured toggle, force delete, admin stats |
| paiements.controller.js (admin) | `backend/src/controllers/paiements.controller.js` | getAllPaiements, updatePaiementStatut, getAdminStats |
| locations.controller.js (admin) | `backend/src/controllers/locations.controller.js` | getAdminStats, getAllLocations |

---

## Routes

| File | Path | Key Admin Routes |
|------|------|-----------------|
| users.routes.js | `backend/src/routes/users.routes.js` | GET /users, GET /users/:id, PATCH /users/:id, DELETE /users/:id |
| categories.routes.js | `backend/src/routes/categories.routes.js` | GET /categories, POST /categories, PUT /categories/:id, DELETE /categories/:id |
| litiges.routes.js | `backend/src/routes/litiges.routes.js` | GET /litiges, GET /litiges/:id, PATCH /litiges/:id/assign, PATCH /litiges/:id/resolve |
| paiements.routes.js | `backend/src/routes/paiements.routes.js` | GET /paiements (admin), PATCH /paiements/:id |
| locations.routes.js (admin) | `backend/src/routes/locations.routes.js` | GET /locations (admin), GET /locations/stats |
| materiels.routes.js (admin) | `backend/src/routes/materiels.routes.js` | PATCH /materiels/:id/featured, DELETE /materiels/:id (admin) |

---

## Models

| Model | Path | Purpose |
|-------|------|---------|
| User | `backend/src/models/User.js` | statut control (actif/suspendu/bloque) — shared |
| Categorie | `backend/src/models/Categorie.js` | nom, description, image |
| Litige | `backend/src/models/Litige.js` | locationId, ouvertPar, adminId, raison, statut, resolution |
| CommissionConfig | `backend/src/models/CommissionConfig.js` | platform commission rate — shared with Youssef |
| Paiement | `backend/src/models/Paiement.js` | Admin payment management — shared |
| Location | `backend/src/models/Location.js` | All location records — shared |
| Materiel | `backend/src/models/Materiel.js` | Admin moderation — shared with Youssef |

---

## Admin Stats Endpoints

| Endpoint | Data |
|----------|------|
| GET /api/v1/users/stats | Total users, by role, by statut |
| GET /api/v1/materiels/stats | Total equipment, by categorie, featured count |
| GET /api/v1/locations/stats | By statut, revenue aggregation |
| GET /api/v1/paiements/stats | En attente count, confirmed total |
| GET /api/v1/litiges/stats | Ouverts, en_cours, resolus counts |

---

## Dependencies

- `express-validator` — admin form validation
- `mongoose` — aggregation pipelines for stats
- `framer-motion` — admin dashboard animations
- `multer` (shared) — category image uploads
