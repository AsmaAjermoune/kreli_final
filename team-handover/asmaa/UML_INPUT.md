# Asmaa — UML Input (Public Experience)

## Classes

### Materiel (public view — frontend/src/lib/api.ts)
```
Materiel {
  _id: string
  nom: string
  description?: string
  photos?: [{ url: string, ordre?: number }]
  prixParJour: number
  caution?: number
  localisation?: string
  etat?: "neuf" | "bon_etat" | "usage"
  disponible?: boolean
  featured?: boolean
  categorieId?: { _id: string, nom: string } | string
  proprietaireId?: { _id: string, nom: string, photo?: string, telephone?: string } | string
  createdAt?: string
}
```

### Category (frontend/src/lib/api.ts)
```
Category {
  _id: string
  nom: string
  description?: string
  image?: string
}
```

### MaterielListResult (frontend/src/lib/api.ts)
```
MaterielListResult {
  data: Materiel[]
  total: number
  page: number
  limit: number
  pages: number
}
```

### I18nContextType (frontend/src/context/I18nContext.tsx)
```
I18nContextType {
  locale: "fr" | "en" | "ar" | "zgh"
  t(key: string): string
  setLocale(locale: string): void
  isRTL: boolean
}
```

---

## Relationships

```
Navbar ──uses──► useAuth (shared) + useI18n
HomeLandingClient ──loads──► Category[] + Materiel[] (featured)
CatalogueClient ──queries──► Materiel[] (paginated + filtered)
CatalogueFilters ──uses──► useGeolocation + useNominatim + cities.ts
MapPickerLeaflet ──provides──► lat/lng to CatalogueClient
MaterielDetailClient ──loads──► Materiel (single) + SimilarMateriels
ReservationModal ──creates──► Location (POST)
ContactModal ──creates──► Conversation (POST)
I18nContext ──provides t()──► all public components
Materiel ──categorized by──► Categorie
Materiel ──owned by──► User (proprietaire)
```

---

## Sequence Actors

- **Anonymous/Authenticated User** (browser)
- **CatalogueClient**
- **MaterielDetailClient**
- **ReservationModal** / **ContactModal**
- **useGeolocation** / **useNominatim**
- **api.ts** (fetch layer)
- **Express Router** (public routes)
- **materiels.controller.js** → listMateriels, getMateriel, listFeaturedMateriels
- **categories.controller.js** → getAllCategories
- **locations.controller.js** → createLocation
- **conversations.controller.js** → createOrGetConversation
- **Materiel Model** + **Categorie Model** + **Location Model**
- **Nominatim API** (external geocoding service)

---

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/materiels | Public | List with filters/pagination |
| GET | /api/v1/materiels/featured | Public | Featured equipment |
| GET | /api/v1/materiels/:id | Public | Equipment detail |
| GET | /api/v1/categories | Public | All categories |
| POST | /api/v1/locations | verifyToken | Create rental (from ReservationModal) |
| POST | /api/v1/conversations | verifyToken | Create/get conversation (from ContactModal) |
| GET | /uploads/:filename | Public | Serve uploaded images |

---

## Query Parameters (Catalogue)

```
GET /api/v1/materiels
  ?q=string          → full-text search (nom + description)
  &categorie=id,...  → comma-separated category IDs
  &ville=string      → city name filter (regex)
  &lat=float         → user latitude (geo filter)
  &lng=float         → user longitude (geo filter)
  &rayon=int         → radius in km
  &prixMin=number    → minimum daily price
  &prixMax=number    → maximum daily price
  &disponibilite=true → only available equipment
  &page=int          → pagination (default 1)
  &limit=int         → per page (default 12, max 48)
  &sort=recent|prix_asc|prix_desc
```

---

## i18n States

```
Locales: fr (default, LTR) | en (LTR) | ar (RTL) | zgh (LTR, Tifinagh script)

Resolution order:
  1. URL prefix: /fr/... /en/... /ar/... /zgh/...
  2. URL param: ?locale=fr
  3. Cookie: Kreli_locale
  4. localStorage: locale key
  5. Default: fr

RTL trigger: locale === "ar" → document.documentElement.dir = "rtl"
```

---

## Exchanged Data

### Catalogue Response
```json
{
  "data": [
    {
      "_id": "64a...",
      "nom": "Excavatrice Caterpillar 320",
      "prixParJour": 3500,
      "localisation": "Casablanca",
      "etat": "bon_etat",
      "disponible": true,
      "photos": [{ "url": "/uploads/exc-1.jpg", "ordre": 0 }],
      "categorieId": { "_id": "63b...", "nom": "Engins BTP" }
    }
  ],
  "total": 247,
  "page": 1,
  "limit": 12,
  "pages": 21
}
```
