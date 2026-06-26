# Sara — UML Input (Admin Panel)

## Classes

### Categorie (backend/src/models/Categorie.js)
```
Categorie {
  _id: ObjectId
  nom: String [required, unique]
  description: String
  image: String [URL]
  createdAt: Date
}
```

### Litige (backend/src/models/Litige.js)
```
Litige {
  _id: ObjectId
  locationId: ObjectId → Location [required]
  ouvertPar: ObjectId → User [required]
  adminId: ObjectId → User [null until assigned]
  raison: Enum["materiel_endommage","retard","non_conforme","autre"]
  description: String
  statut: Enum["ouvert","en_cours","resolu"]
  resolution: String [admin resolution notes]
  openedAt: Date
  resolvedAt: Date
}
```

### CommissionConfig (backend/src/models/CommissionConfig.js)
```
CommissionConfig {
  _id: ObjectId
  taux: Number  // percentage, e.g. 10
  updatedAt: Date
}
```

### Paiement (backend/src/models/Paiement.js — admin view)
```
Paiement {
  _id: ObjectId
  locationId: ObjectId → Location
  type: Enum["location","caution"]
  montant: Number
  statut: Enum["en_attente","confirme","rembourse","retenu"]
  createdAt: Date
}
```

---

## Relationships

```
Admin User ──manages──► All Users (suspend/block/reactivate/delete)
Admin User ──manages──► All Categories (CRUD)
Admin User ──assigned to──► Litige (adminId)
Admin User ──resolves──► Litige → affects Location.statut
Admin User ──configures──► CommissionConfig
Admin User ──moderates──► Materiel (featured toggle, force delete)
Admin User ──oversees──► All Paiements (confirm/refund)
Litige ──belongs to──► Location
Litige ──opened by──► User (locataire)
Litige ──resolution affects──► Location.statut, Materiel.disponible
Materiel ──categorized by──► Categorie
```

---

## Sequence Actors

- **Admin** (browser)
- **AdminSidebar**
- **admin/litiges/page.tsx**
- **admin/users/page.tsx**
- **api.ts** (fetch layer)
- **Express Router** (admin routes)
- **users.controller.js** / **litiges.controller.js** / **categories.controller.js** / **paiements.controller.js**
- **requireRole("admin")** middleware
- **User Model** / **Litige Model** / **Categorie Model** / **Paiement Model**
- **Notification Model** (dispute resolution notifications)
- **Socket.IO** (notify locataire + proprietaire on resolution)

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/users | verifyToken + admin | List all users |
| PATCH | /api/v1/users/:id | verifyToken + admin | Update user (suspend/block) |
| DELETE | /api/v1/users/:id | verifyToken + admin | Delete user |
| GET | /api/v1/categories | Public | List categories |
| POST | /api/v1/categories | verifyToken + admin | Create category |
| PUT | /api/v1/categories/:id | verifyToken + admin | Update category |
| DELETE | /api/v1/categories/:id | verifyToken + admin | Delete category |
| GET | /api/v1/litiges | verifyToken + admin | List all disputes |
| GET | /api/v1/litiges/:id | verifyToken + admin | Get dispute detail |
| PATCH | /api/v1/litiges/:id/assign | verifyToken + admin | Assign dispute to admin |
| PATCH | /api/v1/litiges/:id/resolve | verifyToken + admin | Resolve dispute |
| GET | /api/v1/paiements | verifyToken + admin | All payments |
| PATCH | /api/v1/paiements/:id | verifyToken + admin | Update payment status |
| GET | /api/v1/locations | verifyToken + admin | All locations |
| GET | /api/v1/locations/stats | verifyToken + admin | Admin statistics |
| PATCH | /api/v1/materiels/:id/featured | verifyToken + admin | Toggle featured |

---

## States (Litige lifecycle)

```
[ouvert] ──admin assign──► [en_cours]
[en_cours] ──admin resolve──► [resolu]
On resolve:
  decision = "locataire_gagne" → Location.statut = terminee, Materiel.disponible = true, caution → retenue
  decision = "proprietaire_gagne" → Location.statut = terminee, caution → restituee
  decision = "remboursement" → Location.statut = annulee, Paiements → rembourse
```

## States (User statut — admin actions)

```
[actif] ──suspend──► [suspendu]
[actif] ──block──►  [bloque]
[suspendu] | [bloque] ──reactivate──► [actif]
[any] ──admin delete──► [deleted]
```
