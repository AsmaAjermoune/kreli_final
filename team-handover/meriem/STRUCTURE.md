# Meriem — Renter Space + Messaging

## Responsibility Overview
Meriem owns the locataire (renter) dashboard, the full real-time chat/messaging system, renter notifications, favorites management, renter payments view, and the renter profile display. She also owns the Socket.IO event handling for messages.

---

## Pages

| Page | Path |
|------|------|
| Locataire Dashboard | `frontend/src/app/dashboard/locataire/page.tsx` |
| Locataire Locations | `frontend/src/app/dashboard/locataire/locations/page.tsx` |
| Locataire Messages | `frontend/src/app/dashboard/locataire/messages/page.tsx` |
| Locataire Favoris | `frontend/src/app/dashboard/locataire/favoris/page.tsx` |
| Locataire Paiements | `frontend/src/app/dashboard/locataire/paiements/page.tsx` |
| Locataire Profile | `frontend/src/app/dashboard/locataire/profile/page.tsx` (shared with Ahmed for SecurityForm) |
| Dashboard Messages (shared) | `frontend/src/app/dashboard/messages/page.tsx` |

---

## Components

| Component | Path | Role |
|-----------|------|------|
| LocataireSidebar | `frontend/src/components/dashboard/LocataireSidebar.tsx` | Navigation sidebar |
| MessagesView | `frontend/src/components/dashboard/MessagesView.tsx` | Full chat UI (conversation list + chat panel) |
| SpendingChart | `frontend/src/components/dashboard/SpendingChart.tsx` | Renter spending visualization |
| LocationRow | `frontend/src/app/dashboard/locataire/locations/LocationRow.tsx` | Single rental row with status |
| LitigeModal | `frontend/src/app/dashboard/locataire/locations/LitigeModal.tsx` | Open dispute modal |
| TransactionsTable | `frontend/src/app/dashboard/locataire/paiements/TransactionsTable.tsx` | Payment history table |
| ProfileHeader (locataire) | `frontend/src/app/dashboard/locataire/profile/ProfileHeader.tsx` | User info display |
| SecurityForm (locataire) | `frontend/src/app/dashboard/locataire/profile/SecurityForm.tsx` | Password change (shared with Ahmed) |
| DashboardCards (LocationRow, RecoTile) | implicit in locataire dashboard | Inline dashboard card components |

---

## Hooks

| Hook | Path | Purpose |
|------|------|---------|
| useSocket | `frontend/src/hooks/useSocket.ts` | Socket.IO singleton connection |
| useNotifications | `frontend/src/hooks/useNotifications.ts` | Real-time notification state |
| useAuth | `frontend/src/context/AuthContext.tsx` | Access current user (shared) |

---

## Contexts

| Context | Path | Purpose |
|---------|------|---------|
| AuthContext | `frontend/src/context/AuthContext.tsx` | Read user/token for API calls (shared) |

---

## Backend APIs

| Controller | Path | Endpoints |
|-----------|------|-----------|
| conversations.controller.js | `backend/src/controllers/conversations.controller.js` | Create/list conversations, get messages |
| notifications.controller.js | `backend/src/controllers/notifications.controller.js` | List, mark read, count unread |
| locations.controller.js (locataire slice) | `backend/src/controllers/locations.controller.js` | createLocation, getMyLocations, cancelLocation, getLocataireStats |
| users.controller.js (favorites) | `backend/src/controllers/users.controller.js` | getFavoris, addFavori, removeFavori |
| paiements.controller.js (locataire) | `backend/src/controllers/paiements.controller.js` | getMyPaiements |

---

## Routes

| File | Path | Key Routes |
|------|------|-----------|
| conversations.routes.js | `backend/src/routes/conversations.routes.js` | POST /conversations, GET /conversations, GET /conversations/:id/messages |
| notifications.routes.js | `backend/src/routes/notifications.routes.js` | GET /notifications, PATCH /notifications/:id/read, GET /notifications/unread-count |
| locations.routes.js (locataire) | `backend/src/routes/locations.routes.js` | POST /locations, GET /locations/my, PATCH /locations/:id/cancel |
| users.routes.js (favorites) | `backend/src/routes/users.routes.js` | GET /users/favoris, POST /users/favoris/:id, DELETE /users/favoris/:id |

---

## Models

| Model | Path | Purpose |
|-------|------|---------|
| Conversation | `backend/src/models/Conversation.js` | locataireId, proprietaireId, materielId, dernierMsgAt |
| Message | `backend/src/models/Message.js` | conversationId, expediteurId, contenu, imageUrl, lu |
| Notification | `backend/src/models/Notification.js` | destinataireId, type, titre, contenu, lienRedirection, lue |
| Location | `backend/src/models/Location.js` | Full rental record (shared) |
| Paiement | `backend/src/models/Paiement.js` | locationId, type, montant, statut (shared) |

---

## Socket Events

| Event | Direction | Purpose |
|-------|-----------|---------|
| `send_message` | Client → Server | Send a message in a conversation |
| `receive_message` | Server → Client | Receive a new message |
| `mark_read` | Client → Server | Mark messages as read |
| `messages_read` | Server → Client | Notify sender that messages were read |
| `new_notification` | Server → Client | Push new notification |
| `user_online` | Server → Client | Peer came online |
| `user_offline` | Server → Client | Peer went offline |
| `online_users` | Server → Client | Initial list of online users |
| `message_error` | Server → Client | Content policy violation (phone/URL blocked) |

---

## Dependencies

- `socket.io-client` — real-time messaging
- `@/hooks/useSocket` — singleton socket management
- `@/hooks/useNotifications` — notification polling + socket events
- `react` useState/useEffect — chat state management
