# Sara — Frontend ↔ Backend Flow (Admin Panel)

## 1. Admin Dashboard Load

```
UI: dashboard/admin/page.tsx
  → Promise.all([getAdminStats(), getAdminLitigesStats(), getAdminPaiementsStats()])

API:
  → GET /api/v1/locations/stats  → { totalLocations, locationsActives, totalRevenus, totalUsers, totalMateriels }
  → GET /api/v1/litiges/stats    → { ouverts: number, en_cours: number, resolus: number }
  → GET /api/v1/paiements/stats  → { enAttente: number, total: number }

Controller: locations.controller.js → getAdminStats()
  → Location.aggregate([{ $group: { _id: "$statut", count: { $sum: 1 } } }])
  → Location.aggregate([{ $match: { statut: "terminee" } }, { $group: { _id: null, total: { $sum: "$montantLocation" } } }])
  → User.countDocuments()
  → Materiel.countDocuments()

UI: renders StatCards + alert banners for open litiges and pending payments
    + 5 quick-link cards to admin sections
```

---

## 2. User Management

```
UI: dashboard/admin/users/page.tsx
  → GET /api/v1/users?page=1&limit=20&role=&statut=

Controller: users.controller.js → getAllUsers()
  → User.find(filter).select("-password").sort({ createdAt: -1 }).skip().limit()
  → returns: { data: User[], total, page, pages }

UI: table with columns: nom, email, role, statut, createdAt, actions

Suspend user:
  → PATCH /api/v1/users/:id  { statut: 'suspendu' }
  Controller: updateUser() → User.findByIdAndUpdate(id, { statut })
  Effect: user's next API call → verifyToken returns 403 (statut check)

Delete user:
  → DELETE /api/v1/users/:id
  Controller: deleteUser()
    1. Cannot delete own account
    2. Cannot delete last admin
    3. User.findByIdAndDelete(id)
    4. Optionally: cascade delete user's materiels, conversations
```

---

## 3. Category Management

```
UI: dashboard/admin/categories/page.tsx
  → GET /api/v1/categories → Category[]

Controller: categories.controller.js → getAllCategories()
  → Categorie.find().sort({ nom: 1 })

Create category:
  → (optional) POST /api/v1/upload { image } → get image URL
  → POST /api/v1/categories { nom, description, image }
  Controller: createCategorie()
    → Categorie.create({ nom, description, image })

Update category:
  → PUT /api/v1/categories/:id { nom, description, image }

Delete category:
  → DELETE /api/v1/categories/:id
  Controller: deleteCategorie()
    1. Check no active materiels in this category
    2. Categorie.findByIdAndDelete(id)
```

---

## 4. Dispute (Litige) Management

```
UI: dashboard/admin/litiges/page.tsx
  → GET /api/v1/litiges?statut=ouvert&page=1

Controller: litiges.controller.js → getAllLitiges()
  → Litige.find(filter)
    .populate("ouvertPar", "nom email photo")
    .populate("adminId", "nom")
    .populate({
      path: "locationId",
      populate: [
        { path: "materielId", select: "nom photos" },
        { path: "locataireId", select: "nom email" }
      ]
    })

UI: each litige row shows:
  - Equipment name + renter name
  - Raison + description
  - Current statut badge
  - Admin assigned to (or "Non assigné")
  - Actions: Assign to me / Resolve

Assign to admin:
  → PATCH /api/v1/litiges/:id/assign
  Controller: assignLitige()
    → Litige.findByIdAndUpdate(id, { adminId: req.user._id, statut: 'en_cours' })

Resolve dispute:
  → PATCH /api/v1/litiges/:id/resolve { decision, resolution }
  Controller: resolveLitige()
    → Litige.statut = 'resolu', resolution = text, resolvedAt = now
    → Location.statut = 'terminee' (or 'annulee' based on decision)
    → Notifications to both locataire and proprietaire
    → re-enable Materiel.disponible if appropriate
```

---

## 5. Payment Oversight

```
UI: dashboard/admin/paiements/page.tsx
  → GET /api/v1/paiements?page=1&limit=20&statut=

Controller: paiements.controller.js → getAllPaiements()
  → Paiement.find(filter)
    .populate({ path: "locationId", populate: [materielId, locataireId] })
    .sort({ createdAt: -1 })

UI: table with columns: type, montant, statut, locataire, matériel, date, actions

Update payment status:
  → PATCH /api/v1/paiements/:id { statut: 'confirme' | 'rembourse' }
  Controller: → Paiement.findByIdAndUpdate(id, { statut })
```

---

## 6. Commission Configuration

```
Admin can update platform commission rate:
  → PUT /api/v1/admin/commission { taux: 15 }

Model: CommissionConfig.js → findOneAndUpdate or upsert
  → New rentals will use updated taux
  → Existing locations keep their snapshotted commissionTaux
```

---

## 7. Equipment Moderation

```
UI: dashboard/admin/materiels/page.tsx
  → GET /api/v1/materiels?page=1&limit=20 (admin view: all, not just available)

Feature toggle:
  → PATCH /api/v1/materiels/:id/featured { featured: true | false }
  Controller: → Materiel.findByIdAndUpdate(id, { featured })
  Effect: featured=true → appears on homepage (Asmaa's FeaturedSection)

Force delete:
  → DELETE /api/v1/materiels/:id (admin bypass ownership check)
```
