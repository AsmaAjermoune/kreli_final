# Youssef — Component Tree (Owner Space)

```
dashboard/proprietaire/
├── layout.tsx                                [auth guard: role === 'proprietaire' || 'both']
│   └── ProprietaireSidebar                  [frontend/src/components/dashboard/ProprietaireSidebar.tsx]
│       └── links: tableau de bord, ajouter, matériels, locations, revenus, messages, profile
│
├── page.tsx (Dashboard Overview)
│   ├── StatCard (from DashboardUI)          [frontend/src/components/dashboard/DashboardUI.tsx]
│   │   └── icons: Wallet, Boxes, Package, Inbox
│   ├── RevenueChartCard                     [frontend/src/app/dashboard/proprietaire/RevenueChartCard.tsx]
│   │   └── shows: revenue stats + trends
│   ├── DemandesCard                         [frontend/src/app/dashboard/proprietaire/DemandesCard.tsx]
│   │   └── pending rental requests with accept/reject buttons
│   └── ParcTable                            [frontend/src/app/dashboard/proprietaire/ParcTable.tsx]
│       └── equipment fleet summary
│
├── ajouter/
│   └── page.tsx (Create Equipment)
│       └── PhotoUploader                    [frontend/src/app/dashboard/proprietaire/ajouter/PhotoUploader.tsx]
│           └── multi-photo drag/drop upload
│           └── calls: POST /api/v1/upload → get photo URLs
│           └── then: POST /api/v1/materiels { nom, description, photos, prixParJour, caution, localisation, etat, categorieId }
│
├── materiels/
│   ├── page.tsx (Equipment List)
│   │   └── equipment cards with edit/delete actions
│   │   └── API: GET /api/v1/materiels/my
│   └── [id]/edit/
│       └── page.tsx (Edit Equipment)
│           └── PhotoUploader (reused)
│           └── API: PUT /api/v1/materiels/:id
│
├── locations/
│   └── page.tsx (Rental Requests)
│       └── OwnerLocationRow                 [frontend/src/app/dashboard/proprietaire/locations/OwnerLocationRow.tsx]
│           └── props: location, onAccept, onReject, onMarkReturn
│           └── actions: accept (→ acceptee), reject (→ refusee), mark returned (→ terminee)
│           └── API:
│               ├── PATCH /api/v1/locations/:id/accept
│               ├── PATCH /api/v1/locations/:id/reject
│               └── PATCH /api/v1/locations/:id/terminer
│
├── revenus/
│   └── page.tsx
│       ├── RevenusChart                     [frontend/src/components/dashboard/RevenusChart.tsx]
│       │   └── monthly revenue bar/line chart
│       └── StatusDonutChart                 [frontend/src/components/dashboard/StatusDonutChart.tsx]
│           └── donut: acceptees / terminées / refusées / en_cours
│
├── messages/
│   └── page.tsx
│       └── MessagesView                     [frontend/src/components/dashboard/MessagesView.tsx]
│           └── (shared with Meriem — same component, different user context)
│           └── socket: send_message, receive_message, mark_read
│
└── profile/
    ├── page.tsx
    ├── ProfileHeader                         [frontend/src/app/dashboard/proprietaire/profile/ProfileHeader.tsx]
    └── SecurityForm                         [frontend/src/app/dashboard/proprietaire/profile/SecurityForm.tsx]

components/dashboard/
├── DashboardUI.tsx (StatCard)               [used by proprietaire & admin dashboards]
├── RevenusChart.tsx                         [revenue time-series chart]
├── StatusDonutChart.tsx                     [location status distribution]
└── ProprietaireSidebar.tsx                  [owner navigation]
```

---

## Key Imports

### proprietaire/page.tsx
```typescript
import { getOwnerStats, getOwnerLocations, formatPrice, getMyMateriels, acceptLocation, rejectLocation } from "@/lib/api";
import { StatCard } from "@/components/dashboard/DashboardUI";
import { RevenueChartCard } from "./RevenueChartCard";
import { DemandesCard } from "./DemandesCard";
import { ParcTable } from "./ParcTable";
```

### ajouter/page.tsx
```typescript
import PhotoUploader from "./PhotoUploader";
// PhotoUploader calls POST /api/v1/upload for each photo
// form submit calls POST /api/v1/materiels
```

### locations/page.tsx
```typescript
import { getOwnerLocations, acceptLocation, rejectLocation } from "@/lib/api";
import OwnerLocationRow from "./OwnerLocationRow";
```
