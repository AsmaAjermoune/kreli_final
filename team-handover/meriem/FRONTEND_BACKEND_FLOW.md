# Meriem — Frontend ↔ Backend Flow (Renter Space + Messaging)

## 1. Renter Dashboard Load

```
UI: dashboard/locataire/page.tsx
  → Promise.all([getLocataireStats(), getMyLocations({ limit: 4 }), getFeaturedMateriels(3)])

API (api.ts):
  → GET /api/v1/locations/my/stats   → { locations: { enAttente, enCours, terminees, total }, totalDepenses }
  → GET /api/v1/locations/my?limit=4 → { data: Location[], total, page, pages }
  → GET /api/v1/materiels?featured=true&limit=3

Controller: locations.controller.js → getLocataireStats(), getMyLocations()
  → Location.find({ locataireId: req.user._id })
  → aggregates counts by statut

Model: Location.js → populated with Materiel (nom, photos)

UI: renders KPI cards (enAttente, enCours, terminees, totalDepenses) + recent location rows
```

---

## 2. Rental List & Dispute Opening

```
UI: dashboard/locataire/locations/page.tsx
  → GET /api/v1/locations/my?page=1&limit=20

Controller: getMyLocations()
  → Location.find({ locataireId: req.user._id })
    .populate("materielId", "nom photos localisation prixParJour")
    .sort({ createdAt: -1 })

UI: renders LocationRow per location
  → Status badge (en_attente → acceptee → en_cours → terminee)
  → "Ouvrir un litige" button (visible when statut === 'en_cours' | 'en_retard')
    → opens LitigeModal

LitigeModal:
  → POST /api/v1/litiges  { locationId, raison, description }
  Controller: litiges.controller.js → createLitige()
    → Litige.create({ locationId, ouvertPar: req.user._id, raison })
    → Location.findByIdAndUpdate → statut: 'en_litige'
    → Notification.create({ destinataireId: proprietaireId, type: 'litige' })
    → io.to(proprietaireId).emit("new_notification", ...)
```

---

## 3. Messaging Flow (Real-time)

```
UI: dashboard/locataire/messages/page.tsx
  → MessagesView component mounts
  → GET /api/v1/conversations  → list of conversations

Controller: conversations.controller.js → getMyConversations()
  → Conversation.find({
      $or: [{ locataireId: req.user._id }, { proprietaireId: req.user._id }]
    }).populate("materielId", "nom photos")
     .populate("locataireId proprietaireId", "nom photo")
     .sort({ dernierMsgAt: -1 })

UI: click on a conversation
  → GET /api/v1/conversations/:id/messages
  Controller: → Message.find({ conversationId }).sort({ createdAt: 1 })
  → socket.emit("mark_read", { conversationId })

Socket (send_message):
  Client → socket.emit("send_message", { conversationId, contenu })
  Server (socket/index.js):
    1. Validate: no phone/URL in content
    2. Message.create({ conversationId, expediteurId: uid, contenu })
    3. Conversation.findByIdAndUpdate → dernierMsgAt: now
    4. io.to(recipientId).emit("receive_message", { message: populated })
    5. socket.emit("receive_message", { message: populated })  ← echo to sender
    6. Notification.create({ destinataireId: recipientId, type: 'message' })
    7. io.to(recipientId).emit("new_notification", { notification })

Socket (mark_read):
  Client → socket.emit("mark_read", { conversationId })
  Server:
    → Message.updateMany({ conversationId, expediteurId: { $ne: uid }, lu: false }, { lu: true })
    → io.to(senderId).emit("messages_read", { conversationId })
```

---

## 4. Favorites Management

```
UI: dashboard/locataire/favoris/page.tsx
  → GET /api/v1/users/favoris → populated Materiel[]

Controller: users.controller.js → getFavoris()
  → User.findById(req.user._id).populate("favoris")

UI: click "Remove from favorites"
  → DELETE /api/v1/users/favoris/:materielId

Controller: removeFavori()
  → User.findByIdAndUpdate(req.user._id, { $pull: { favoris: materielId } })

(Adding to favorites is done from Asmaa's materiel detail page)
```

---

## 5. Payments View

```
UI: dashboard/locataire/paiements/page.tsx
  → GET /api/v1/paiements/my → Paiement[]

Controller: paiements.controller.js → getMyPaiements()
  → Paiement.find({ ... })
    .populate("locationId", "materielId dateDebut dateFinPrevue")

UI: TransactionsTable renders paiements
  → columns: type (location/caution), montant, statut, date
```

---

## 6. Notifications

```
Hook: useNotifications.ts
  → GET /api/v1/notifications/unread-count  → { count: number }
  → socket.on("new_notification", ({ notification }) => {
      setUnreadCount(prev => prev + 1);
      setNotifications(prev => [notification, ...prev]);
    })

UI: notification bell in LocataireSidebar
  → click → GET /api/v1/notifications?page=1&limit=20
  → click notification → PATCH /api/v1/notifications/:id/read
```
