# Meriem — UML Input (Renter Space + Messaging)

## Classes

### Conversation (backend/src/models/Conversation.js)
```
Conversation {
  _id: ObjectId
  locataireId: ObjectId → User
  proprietaireId: ObjectId → User
  materielId: ObjectId → Materiel
  dernierMsgAt: Date
  createdAt: Date
}
```

### Message (backend/src/models/Message.js)
```
Message {
  _id: ObjectId
  conversationId: ObjectId → Conversation
  expediteurId: ObjectId → User
  contenu: String
  imageUrl: String?
  lu: Boolean [default: false]
  createdAt: Date
}
```

### Notification (backend/src/models/Notification.js)
```
Notification {
  _id: ObjectId
  destinataireId: ObjectId → User
  type: Enum["message", "location", "litige", "paiement", "system"]
  titre: String
  contenu: String
  lienRedirection: String
  lue: Boolean [default: false]
  createdAt: Date
}
```

### Location (shared — backend/src/models/Location.js)
```
Location {
  _id: ObjectId
  materielId: ObjectId → Materiel
  locataireId: ObjectId → User
  statut: Enum["en_attente","acceptee","en_cours","terminee","en_retard","en_litige","refusee","annulee"]
  dateDebut, dateFinPrevue, nbJours, prixParJour,
  montantLocation, cautionMontant,
  commissionTaux, commissionMontant, montantNetProprio
}
```

### Paiement (shared — backend/src/models/Paiement.js)
```
Paiement {
  _id: ObjectId
  locationId: ObjectId → Location
  type: Enum["location", "caution"]
  montant: Number
  statut: Enum["en_attente","confirme","rembourse","retenu"]
  createdAt: Date
}
```

---

## Relationships

```
User (locataire) ──creates──► Location
User (locataire) ──participates in──► Conversation (as locataireId)
User (locataire) ──sends──► Message (as expediteurId)
User (locataire) ──receives──► Notification
User (locataire) ──has many──► Paiement (via Location)
Conversation ──has many──► Message
Conversation ──belongs to──► Materiel
Location ──triggers──► Notification (status changes)
Message (via socket) ──triggers──► Notification (new message)
```

---

## Sequence Actors

- **Locataire** (browser)
- **MessagesView** (React component)
- **useSocket** (hook)
- **Socket.IO Client**
- **Socket.IO Server** (backend/src/socket/index.js)
- **conversations.controller.js**
- **Conversation Model** / **Message Model**
- **Notification Model**
- **Proprietaire** (socket room recipient)

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/locations/my | verifyToken | Get renter's rentals |
| GET | /api/v1/locations/my/stats | verifyToken | Get renter KPIs |
| POST | /api/v1/locations | verifyToken + locataire | Create a rental request |
| PATCH | /api/v1/locations/:id/cancel | verifyToken + locataire | Cancel a rental |
| GET | /api/v1/conversations | verifyToken | List user's conversations |
| POST | /api/v1/conversations | verifyToken | Create or get conversation |
| GET | /api/v1/conversations/:id/messages | verifyToken | Get messages in conversation |
| GET | /api/v1/notifications | verifyToken | List notifications |
| GET | /api/v1/notifications/unread-count | verifyToken | Count unread |
| PATCH | /api/v1/notifications/:id/read | verifyToken | Mark as read |
| GET | /api/v1/users/favoris | verifyToken | Get favorites |
| POST | /api/v1/users/favoris/:id | verifyToken | Add favorite |
| DELETE | /api/v1/users/favoris/:id | verifyToken | Remove favorite |
| GET | /api/v1/paiements/my | verifyToken | Get renter payments |

---

## Socket Events

```
Client → Server:
  send_message: { conversationId: string, contenu: string, imageUrl?: string }
  mark_read: { conversationId: string }

Server → Client:
  receive_message: { conversationId: string, message: Message }
  messages_read: { conversationId: string }
  new_notification: { notification: Notification }
  user_online: { userId: string }
  user_offline: { userId: string }
  online_users: { userIds: string[] }
  message_error: { message: string }
```

---

## States (Location lifecycle — renter perspective)

```
[create] → en_attente
en_attente ──proprietaire accept──► acceptee
en_attente ──proprietaire reject──► refusee
en_attente ──locataire cancel──► annulee
acceptee ──time passes──► en_cours
en_cours ──locataire return──► terminee
en_cours ──overdue──► en_retard
en_cours | en_retard ──locataire dispute──► en_litige
```
