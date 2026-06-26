# Youssef — UML Input (Owner Space)

## Classes

### Materiel (backend/src/models/Materiel.js)
```
Materiel {
  _id: ObjectId
  nom: String [required]
  description: String
  photos: [{ url: String, ordre: Number }]
  prixParJour: Number [required, min: 0]
  caution: Number [default: 0]
  localisation: String
  etat: Enum["neuf", "bon_etat", "usage"]
  disponible: Boolean [default: true]
  featured: Boolean [default: false]
  proprietaireId: ObjectId → User [required]
  categorieId: ObjectId → Categorie [required]
  location: { type: "Point", coordinates: [lng, lat] }  // GeoJSON
  createdAt: Date
}
```

### CommissionConfig (backend/src/models/CommissionConfig.js)
```
CommissionConfig {
  _id: ObjectId
  taux: Number  // e.g. 10 (= 10%)
  updatedAt: Date
}
```

### Location (shared — backend/src/models/Location.js)
```
Location {
  statut: Enum["en_attente","acceptee","en_cours","terminee","en_retard","en_litige","refusee","annulee"]
  materielId: ObjectId → Materiel
  locataireId: ObjectId → User
  montantLocation: Number  // prixParJour × nbJours
  commissionTaux: Number   // from CommissionConfig.taux at time of creation
  commissionMontant: Number
  montantNetProprio: Number  // what owner receives
  cautionMontant: Number
  joursRetard: Number
  penaliteMontant: Number
}
```

---

## Relationships

```
User (proprietaire) ──owns many──► Materiel
Materiel ──belongs to──► Categorie
Materiel ──has many──► Location
Location ──generates──► Paiement (type: location + caution)
CommissionConfig ──read at creation──► Location.commissionTaux
Proprietaire ──receives net of commission──► montantNetProprio
Proprietaire ──messages via──► Conversation (as proprietaireId)
```

---

## Sequence Actors

- **Propriétaire** (browser)
- **Ajouter/page.tsx** + **PhotoUploader**
- **upload.middleware.js** (multer)
- **materiels.controller.js**
- **locations.controller.js**
- **Materiel Model** / **Location Model**
- **CommissionConfig Model**
- **Paiement Model**
- **Notification Model**
- **Socket.IO Server**
- **Locataire** (socket notification recipient)

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/materiels/my | verifyToken + proprietaire | Get owner's equipment |
| POST | /api/v1/materiels | verifyToken + proprietaire | Create equipment |
| PUT | /api/v1/materiels/:id | verifyToken + proprietaire | Update equipment |
| DELETE | /api/v1/materiels/:id | verifyToken + proprietaire | Delete equipment |
| GET | /api/v1/materiels/my/stats | verifyToken + proprietaire | Owner KPIs |
| GET | /api/v1/locations/owner | verifyToken + proprietaire | Owner's rental list |
| PATCH | /api/v1/locations/:id/accept | verifyToken + proprietaire | Accept rental |
| PATCH | /api/v1/locations/:id/reject | verifyToken + proprietaire | Reject rental |
| PATCH | /api/v1/locations/:id/terminer | verifyToken + proprietaire | Mark as returned |
| POST | /api/v1/upload | verifyToken | Upload photos (multipart) |

---

## States (Materiel availability)

```
[disponible: true]  ──rental created──► [disponible: false]
[disponible: false] ──rental rejected──► [disponible: true]
[disponible: false] ──rental terminated──► [disponible: true]
[disponible: false] ──rental cancelled──► [disponible: true]
```

## States (Location — owner's actions)

```
en_attente ──owner accept──► acceptee ──time──► en_cours ──owner mark return──► terminee
en_attente ──owner reject──► refusee
en_cours ──overdue cron──► en_retard
en_cours | en_retard ──locataire litige──► en_litige ──admin resolve──► terminee
```

---

## Exchanged Data

### Create Equipment Request
```json
{
  "nom": "Grue mobile 30T",
  "description": "Grue en excellent état, disponible immédiatement",
  "prixParJour": 2500,
  "caution": 5000,
  "localisation": "Casablanca",
  "etat": "bon_etat",
  "categorieId": "64a...",
  "photos": [
    { "url": "/uploads/grue-1.jpg", "ordre": 0 },
    { "url": "/uploads/grue-2.jpg", "ordre": 1 }
  ],
  "lat": 33.589,
  "lng": -7.603
}
```

### Owner Stats Response
```json
{
  "totalMateriels": 12,
  "disponibiles": 8,
  "locations": {
    "enAttente": 2,
    "acceptees": 1,
    "enCours": 3,
    "terminees": 45,
    "total": 51
  },
  "revenus": 87500
}
```
