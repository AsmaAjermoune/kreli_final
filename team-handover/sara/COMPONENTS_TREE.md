# Sara — Component Tree (Admin Panel)

```
dashboard/admin/
├── layout.tsx                                [auth guard: role === 'admin']
│   └── AdminSidebar                         [frontend/src/components/dashboard/AdminSidebar.tsx]
│       └── links: overview, users, categories, litiges, locations, materiels, paiements
│
├── page.tsx (Admin Dashboard)
│   ├── StatCard (from DashboardUI)          [frontend/src/components/dashboard/DashboardUI.tsx]
│   │   └── icons: Wallet, Users, Package, Inbox
│   ├── Alert banners (litiges ouverts, paiements en attente)
│   │   └── Link to /dashboard/admin/litiges | /dashboard/admin/paiements
│   └── Quick links grid → 5 admin sections
│   └── API calls (parallel):
│       ├── getAdminStats()          → GET /api/v1/locations/stats + /users/count
│       ├── getAdminLitigesStats()   → GET /api/v1/litiges/stats
│       └── getAdminPaiementsStats() → GET /api/v1/paiements/stats
│
├── users/
│   └── page.tsx
│       └── user table with search + filter by role/statut
│       └── action buttons: suspend, block, reactivate, delete
│       └── API: GET /api/v1/users, PATCH /api/v1/users/:id, DELETE /api/v1/users/:id
│
├── categories/
│   └── page.tsx
│       └── category list with CRUD
│       └── image upload for each category (uses POST /api/v1/upload)
│       └── API: GET/POST/PUT/DELETE /api/v1/categories
│
├── litiges/
│   └── page.tsx
│       └── dispute list with filters (statut: ouvert | en_cours | resolu)
│       └── litige detail: location info, equipment, renter, reason
│       └── actions: assign to self, resolve with decision
│       └── API:
│           ├── GET /api/v1/litiges
│           ├── PATCH /api/v1/litiges/:id/assign
│           └── PATCH /api/v1/litiges/:id/resolve { decision, resolution }
│
├── locations/
│   └── page.tsx
│       └── all locations across platform with filters
│       └── API: GET /api/v1/locations?admin=true&page=1
│
├── materiels/
│   └── page.tsx
│       └── all equipment listing with moderation actions
│       └── feature/unfeature toggle (appears on homepage)
│       └── force delete equipment
│       └── API:
│           ├── GET /api/v1/materiels (admin view)
│           └── PATCH /api/v1/materiels/:id/featured
│
└── paiements/
    └── page.tsx
        └── all payments across platform
        └── manual status update (confirm, refund)
        └── API:
            ├── GET /api/v1/paiements (admin)
            └── PATCH /api/v1/paiements/:id { statut }

components/dashboard/
├── AdminSidebar.tsx                         [admin navigation]
└── DashboardUI.tsx (StatCard)              [shared stat cards]
```

---

## Key Imports

### admin/page.tsx
```typescript
import { getAdminStats, getAdminLitigesStats, getAdminPaiementsStats, formatPrice } from "@/lib/api";
import { StatCard } from "@/components/dashboard/DashboardUI";
import { motion } from "framer-motion";
```

### admin/layout.tsx
```typescript
import { useAuth } from "@/context/AuthContext";
// redirect if user.role !== 'admin'
```

### admin/litiges/page.tsx
```typescript
// getLitiges, assignLitige, resolveLitige from "@/lib/api"
// Litige includes: location → materiel + locataire, raison, statut, adminId
```

### admin/users/page.tsx
```typescript
// getAdminUsers, suspendUser, blockUser, reactivateUser, deleteUser from "@/lib/api"
// filter by: role (locataire|proprietaire|both|admin), statut (actif|suspendu|bloque)
```
