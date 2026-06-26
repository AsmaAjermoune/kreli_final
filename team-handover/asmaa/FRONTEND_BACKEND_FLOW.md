# Asmaa — Frontend ↔ Backend Flow (Public Experience)

## 1. Homepage Load

```
UI: app/page.tsx (Server Component)
  → renders HomeLandingClient (Client Component)

HomeLandingClient:
  → parallel: getCategories() + getFeaturedMateriels(4)

API:
  → GET /api/v1/categories
  Controller: categories.controller.js → Categorie.find().sort({ nom: 1 })

  → GET /api/v1/materiels?featured=true&limit=4
  Controller: materiels.controller.js → listFeaturedMateriels()
    → Materiel.find({ disponible: true, featured: true })
      .sort({ createdAt: -1 }).limit(4).populate("categorieId", "nom")

UI renders:
  HeroSection → RotatingText (animates through categories)
  CategorySection → category cards → link /catalogue?categorie=:id
  FeaturedSection → ProductCards
  HowItWorksSection → static content
  TestimonialsSection
  CTASection
```

---

## 2. Catalogue Search & Filter

```
URL params: /catalogue?q=grue&categorie=id1,id2&ville=Casablanca&rayon=50&prixMin=100&prixMax=5000&page=2&sort=prix_asc

UI: CatalogueClient.tsx
  → reads URL searchParams
  → builds filter state from params
  → GET /api/v1/materiels?q=grue&categorie=id1,id2&ville=Casablanca&rayon=50&prixMin=100&prixMax=5000&page=2&sort=prix_asc

Controller: materiels.controller.js → listMateriels()
  1. Text search: q → { $text: { $search: q } }
  2. Category filter: categorie → { categorieId: { $in: [id1, id2] } }
  3. Geo filter: lat + lng + rayon →
     a. Find nearby city names (Haversine formula over MOROCCAN_CITIES)
     b. $or: [{ location: $geoWithin $centerSphere }, { localisation: $regex cityNames }]
  4. City name filter: ville → { localisation: { $regex: ville, $options: "i" } }
  5. Price range: prixMin / prixMax → { prixParJour: { $gte, $lte } }
  6. Availability: disponibilite → { disponible: true }
  7. Sort: prix_asc | prix_desc | recent | note
  8. Pagination: skip + limit

Response: { data: Materiel[], total, page, limit, pages }

UI: renders ProductCard grid + CataloguePagination
```

---

## 3. Geolocation Filter

```
UI: CatalogueFilters → LocationFilter
  → useGeolocation() → navigator.geolocation.getCurrentPosition()
  → { lat, lng, accuracy }

  → "Use my location" button →
      useNominatim({ lat, lng }) → reverse geocode to city name
      OR MapPickerLeaflet → user clicks on map → sets lat/lng

  → rayon slider (10km, 25km, 50km, 100km)
  → adds lat + lng + rayon to URL params → triggers catalogue refetch
```

---

## 4. Equipment Detail Page

```
URL: /materiel/[id]

UI: materiel/[id]/page.tsx (Server Component)
  → getMateriel(id) → GET /api/v1/materiels/:id (with Authorization header if logged in)
  → generates metadata (title, description, OG image from first photo)
  → renders MaterielDetailClient

Controller: materiels.controller.js → getMateriel(req, res)
  → Materiel.findById(id)
    .populate("proprietaireId", "nom photo telephone")
    .populate("categorieId", "nom")

MaterielDetailClient:
  → displays: photo gallery, price, location, état, description
  → owner card with avatar
  → SimilarMateriels: GET /api/v1/materiels?categorie=X&limit=4

If logged in (useAuth):
  → "Contacter" button → ContactModal
  → "Réserver" button → ReservationModal
  → "Favori" button → POST/DELETE /api/v1/users/favoris/:id (shared with Meriem)

If not logged in:
  → redirect to /auth/login on action buttons
```

---

## 5. Reservation Flow (from Detail Page)

```
UI: ReservationModal
  → date picker: dateDebut, dateFinPrevue
  → preview: nbJours × prixParJour = total
  → preview: caution amount
  → "Confirmer la réservation" button

  → POST /api/v1/locations { materielId, dateDebut, dateFinPrevue }
    (requires verifyToken — only logged-in locataire)

Controller: locations.controller.js → createLocation()
  1. Validate dates
  2. Check materiel.disponible === true
  3. Check user is not the owner
  4. Calculate: nbJours, montantLocation, commissionMontant, montantNetProprio
  5. Location.create(...)
  6. Paiement.insertMany([{ type: 'location' }, { type: 'caution' }])
  7. Materiel.disponible = false
  8. res.status(201).json({ data: location })

UI: success → redirect to /dashboard/locataire/locations
```

---

## 6. Contact Owner (from Detail Page)

```
UI: ContactModal
  → user types initial message
  → POST /api/v1/conversations { materielId, initialMessage? }

Controller: conversations.controller.js → createOrGetConversation()
  1. Find existing conversation between locataireId + proprietaireId + materielId
  2. If found → return existing
  3. If not → Conversation.create({ locataireId, proprietaireId, materielId })
  4. If initialMessage → Message.create + socket emit

UI: redirect to /dashboard/locataire/messages?conv=:conversationId
```

---

## 7. i18n (Internationalization)

```
URL: /fr/catalogue | /en/catalogue | /ar/catalogue | /zgh/catalogue

Next.js Middleware: middleware.ts
  → reads locale prefix from URL
  → strips prefix → rewrites internally to /catalogue
  → sets req.headers["x-locale"] = "fr"

I18nContext.tsx:
  → reads locale from: URL path prefix → ?locale= param → cookie → localStorage
  → provides t("key") function for translations
  → for "ar": document.documentElement.dir = "rtl"
  → for others: dir = "ltr"

Locale switching (Navbar):
  → user selects language → navigate to /{newLocale}/currentPath
  → saves to cookie Kreli_locale
```
