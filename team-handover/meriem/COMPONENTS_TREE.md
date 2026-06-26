# Meriem — Component Tree (Renter Space + Messaging)

```
dashboard/locataire/
├── layout.tsx                                [auth guard: isLoggedIn()]
│   └── LocataireSidebar                     [frontend/src/components/dashboard/LocataireSidebar.tsx]
│       └── links: overview, locations, messages, favoris, paiements, profile
│
├── page.tsx (Dashboard Overview)
│   ├── LocationRow (inline DashboardCards)   [rental summary card]
│   ├── RecoTile (inline DashboardCards)      [recommended equipment tile]
│   ├── SpendingChart                         [frontend/src/components/dashboard/SpendingChart.tsx]
│   └── API calls:
│       ├── getLocataireStats()
│       ├── getMyLocations({ limit: 4 })
│       └── getFeaturedMateriels(3)           [shared with Asmaa]
│
├── locations/
│   ├── page.tsx (All Rentals)
│   │   ├── LocationRow                       [frontend/src/app/dashboard/locataire/locations/LocationRow.tsx]
│   │   │   └── props: loc, index
│   │   │   └── shows: status badge, dates, equipment name, actions
│   │   └── LitigeModal                      [frontend/src/app/dashboard/locataire/locations/LitigeModal.tsx]
│   │       └── props: locationId, onClose, onSuccess
│   │       └── calls: POST /api/v1/litiges
│
├── messages/
│   └── page.tsx
│       └── MessagesView                     [frontend/src/components/dashboard/MessagesView.tsx]
│           ├── Conversation list panel
│           │   └── per conversation: avatar, name, last message, unread badge
│           ├── Chat panel
│           │   ├── Message bubbles
│           │   └── Image upload support
│           └── useSocket(token)             [frontend/src/hooks/useSocket.ts]
│               └── events: send_message, receive_message, mark_read, messages_read
│
├── favoris/
│   └── page.tsx
│       └── displays: favorited equipment cards
│       └── API calls:
│           ├── getFavoris()
│           └── removeFavori(id)
│
├── paiements/
│   ├── page.tsx
│   └── TransactionsTable                    [frontend/src/app/dashboard/locataire/paiements/TransactionsTable.tsx]
│       └── props: paiements[]
│       └── shows: type, montant, statut, date
│
└── profile/
    ├── page.tsx
    ├── ProfileHeader                         [frontend/src/app/dashboard/locataire/profile/ProfileHeader.tsx]
    │   └── displays: photo, nom, email, role, telephone
    └── SecurityForm                         [frontend/src/app/dashboard/locataire/profile/SecurityForm.tsx]
        └── PUT /api/v1/auth/profile (shared with Ahmed)

dashboard/messages/
└── page.tsx (generic messages redirect)

components/dashboard/
├── MessagesView.tsx                         [primary chat component]
│   ├── imports: useSocket, useAuth
│   └── socket events managed inline
│
├── SpendingChart.tsx
│   └── imports: recharts (or similar chart lib)
│
└── LocataireSidebar.tsx
    └── imports: useAuth (for user display), Link (navigation)
```

---

## Key Imports

### MessagesView.tsx
```typescript
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/context/AuthContext";
// socket.on("receive_message", ...)
// socket.emit("send_message", { conversationId, contenu })
// socket.emit("mark_read", { conversationId })
```

### useNotifications.ts
```typescript
import { useSocket } from "@/hooks/useSocket";
// socket.on("new_notification", handler)
// GET /api/v1/notifications/unread-count
```

### locataire/locations/page.tsx
```typescript
import { getMyLocations, cancelLocation } from "@/lib/api";
import LocationRow from "./LocationRow";
import LitigeModal from "./LitigeModal";
```
