# Youssef — Frontend ↔ Backend Flow (Owner Space)

## 1. Owner Dashboard Load

```
UI: dashboard/proprietaire/page.tsx
  → Promise.all([getOwnerStats(), getOwnerLocations({ statut: 'en_attente', limit: 4 }), getMyMateriels({ limit: 4 })])

API (api.ts):
  → GET /api/v1/materiels/my/stats  → { totalMateriels, disponibiles, locations: {enAttente, acceptees, enCours, terminees, total}, revenus }
  → GET /api/v1/locations/owner?statut=en_attente&limit=4
  → GET /api/v1/materiels/my?limit=4

Controller: materiels.controller.js → getOwnerStats()
  → Materiel.countDocuments({ proprietaireId: req.user._id })
  → Location.aggregate([{ $match: { proprietaireId } }, { $group: { _id: '$statut', count: { $sum: 1 } } }])
  → sum montantNetProprio for terminee locations → revenus

UI: renders StatCards (Revenu net, Matériels, En location, Total demandes)
    + RevenueChartCard + DemandesCard (pending requests) + ParcTable (fleet)
```

---

## 2. Create Equipment (with Photo Upload)

```
UI: dashboard/proprietaire/ajouter/page.tsx
  → Step 1: PhotoUploader
      User selects photos → FileReader preview
      POST /api/v1/upload (multipart/form-data, field: "images")

Middleware: upload.middleware.js (multer)
  → validates file type (jpg, png, webp)
  → validates size (max 5MB per file)
  → saves to /uploads/ directory on server
  → returns: { urls: ["/uploads/filename.jpg", ...] }

  → Step 2: Form submit
      POST /api/v1/materiels
      Body: {
        nom, description, prixParJour, caution,
        localisation, etat, categorieId,
        photos: [{ url, ordre }],
        lat?, lng?  ← for GeoJSON location
      }

Controller: materiels.controller.js → createMateriel()
  1. Validate body (express-validator)
  2. Materiel.create({ ...body, proprietaireId: req.user._id })
  3. If lat & lng provided: materiel.location = { type: "Point", coordinates: [lng, lat] }
  4. materiel.save()
  5. res.status(201).json({ data: materiel })

Model: Materiel.js
  → photos: [{ url, ordre }]
  → location: { type: "Point", coordinates: [Number] }  ← GeoJSON 2dsphere index
```

---

## 3. Rental Request Workflow

```
UI: dashboard/proprietaire/locations/page.tsx
  → GET /api/v1/locations/owner?page=1&limit=20

Controller: locations.controller.js → getOwnerLocations()
  → Location.find({ "materielId.proprietaireId": req.user._id })
    OR via Materiel.find({ proprietaireId }) → then Location.find({ materielId: { $in: materielIds } })
  → populate: materielId (nom, photos), locataireId (nom, email, telephone)

UI: OwnerLocationRow per location
  → "Accepter" button → PATCH /api/v1/locations/:id/accept
  → "Refuser" button  → PATCH /api/v1/locations/:id/reject

Controller: acceptLocation()
  1. Location.findById(id)
  2. Check proprietaire owns the materiel
  3. Location.statut = 'acceptee' → save()
  4. Paiement.updateMany({ locationId }, { statut: 'confirme' })
  5. Notification.create({ destinataireId: locataireId, type: 'location', titre: 'Location acceptée' })
  6. io.to(locataireId).emit("new_notification", { notification })
  7. res.json({ data: location })

Controller: rejectLocation()
  1. Location.statut = 'refusee' → save()
  2. Materiel.findByIdAndUpdate → disponible: true  ← re-enable listing
  3. Paiement.updateMany({ locationId }, { statut: 'rembourse' })
  4. Notification to locataire
  5. res.json({ data: location })

Controller: markTerminee() / markRetour()
  1. Location.statut = 'terminee' → dateRetourReelle = now
  2. Calculate joursRetard if overdue
  3. Materiel.findByIdAndUpdate → disponible: true
  4. Paiement caution → statutCaution: 'restituee'
  5. Notification to locataire
```

---

## 4. Equipment Edit & Delete

```
UI: dashboard/proprietaire/materiels/[id]/edit/page.tsx
  → GET /api/v1/materiels/:id  → load existing data
  → PhotoUploader (can add/remove photos)
  → PUT /api/v1/materiels/:id  { nom, description, prixParJour, caution, photos, ... }

Controller: updateMateriel()
  1. Materiel.findById(id)
  2. Check materiel.proprietaireId === req.user._id
  3. Object.assign(materiel, updates) → materiel.save()
  4. res.json({ data: materiel })

UI: dashboard/proprietaire/materiels/page.tsx
  → DELETE /api/v1/materiels/:id
Controller: deleteMateriel()
  1. Check ownership
  2. Check no active locations (statut: en_attente | acceptee | en_cours)
  3. Materiel.findByIdAndDelete(id)
```

---

## 5. Revenue Analysis

```
UI: dashboard/proprietaire/revenus/page.tsx
  → GET /api/v1/locations/owner?statut=terminee → all completed rentals
  → aggregate by month on frontend

Component: RevenusChart (time-series bar chart)
  → x-axis: months
  → y-axis: montantNetProprio (sum per month)

Component: StatusDonutChart
  → slices: acceptees, terminées, refusées, en_litige
```
