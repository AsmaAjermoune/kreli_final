# Asmaa — Component Tree (Public Experience)

```
app/
├── layout.tsx (root)                        [Next.js root layout]
│   ├── Providers                            [frontend/src/components/Providers.tsx]
│   │   ├── AuthProvider (shared - Ahmed)
│   │   └── I18nProvider                    [frontend/src/context/I18nContext.tsx]
│   ├── Navbar                              [frontend/src/components/Navbar.tsx]
│   │   ├── HeroSearch                      [frontend/src/components/HeroSearch.tsx]
│   │   └── language switcher + auth links
│   ├── CookieBanner                        [frontend/src/components/CookieBanner.tsx]
│   └── Footer                              [frontend/src/components/Footer.tsx]
│       └── modem-animated-footer (UI lib)  [frontend/src/components/ui/modem-animated-footer.tsx]
│
├── page.tsx (Homepage - Server Component)
│   └── HomeLandingClient                   [frontend/src/components/landing/HomeLandingClient.tsx]
│       ├── HeroSection                     [frontend/src/components/landing/HeroSection.tsx]
│       │   ├── RotatingText               [frontend/src/components/ui/RotatingText.tsx]
│       │   └── HeroSearch                 [frontend/src/components/HeroSearch.tsx]
│       │
│       ├── MoroccoHeroSection             [frontend/src/components/landing/MoroccoHeroSection.tsx]
│       │   └── CircularGallery            [frontend/src/components/ui/CircularGallery.jsx]
│       │
│       ├── CategorySection                [frontend/src/components/landing/CategorySection.tsx]
│       │   └── API: getCategories()
│       │   └── links to /catalogue?categorie=id
│       │
│       ├── FeaturedSection                [frontend/src/components/landing/FeaturedSection.tsx]
│       │   └── API: getFeaturedMateriels()
│       │   └── ProductCard (from catalogue)
│       │
│       ├── HowItWorksSection              [frontend/src/components/landing/HowItWorksSection.tsx]
│       │   └── 3 steps: browse → reserve → rent
│       │
│       ├── TestimonialsSection            [frontend/src/components/TestimonialsSection.tsx]
│       │   └── TestimonialsSlider         [frontend/src/components/TestimonialsSlider.tsx]
│       │       └── stagger-testimonials   [frontend/src/components/ui/stagger-testimonials.tsx]
│       │
│       ├── AnimatedSection                [frontend/src/components/AnimatedSection.tsx]
│       │   └── wraps sections with scroll-reveal
│       │
│       └── CTASection                     [frontend/src/components/landing/CTASection.tsx]
│           └── GlassSurface              [frontend/src/components/ui/GlassSurface.jsx]
│
├── catalogue/
│   ├── page.tsx (Server: sets metadata)
│   └── CatalogueClient.tsx               [CLIENT — primary catalogue logic]
│       ├── CatalogueFilters               [frontend/src/app/catalogue/CatalogueFilters.tsx]
│       │   ├── LocationFilter             [frontend/src/components/catalogue/LocationFilter.tsx]
│       │   │   └── uses: useGeolocation, useNominatim, cities.ts
│       │   └── MapPickerLeaflet           [frontend/src/components/catalogue/MapPickerLeaflet.tsx]
│       │       └── Leaflet map for coordinate-based radius search
│       ├── ProductCard (×N)              [frontend/src/app/catalogue/ProductCard.tsx]
│       │   └── getMaterielImage(materiel) → handles URL/path
│       └── CataloguePagination           [frontend/src/app/catalogue/CataloguePagination.tsx]
│           └── API: GET /api/v1/materiels?q=&categorie=&ville=&prixMin=&prixMax=&page=&sort=
│
├── materiel/[id]/
│   ├── page.tsx (Server: fetches materiel + metadata)
│   └── MaterielDetailClient              [CLIENT]
│       ├── Image gallery (next/image)
│       ├── Price display (formatPrice)
│       ├── Owner info card
│       ├── SimilarMateriels              [frontend/src/app/materiel/[id]/SimilarMateriels.tsx]
│       │   └── API: GET /api/v1/materiels?categorie=X&limit=4
│       ├── ContactModal                  [frontend/src/app/materiel/[id]/ContactModal.tsx]
│       │   └── creates conversation → redirects to /dashboard/locataire/messages
│       │   └── API: POST /api/v1/conversations { materielId }
│       └── ReservationModal              [frontend/src/app/materiel/[id]/ReservationModal.tsx]
│           └── date picker (dateDebut, dateFinPrevue)
│           └── price calculation preview
│           └── API: POST /api/v1/locations { materielId, dateDebut, dateFinPrevue }
│           └── adds to favorites: POST /api/v1/users/favoris/:id
│
└── about/
    ├── page.tsx (Server: metadata)
    └── AboutClient
        ├── AboutTeam                     [frontend/src/app/about/AboutTeam.tsx]
        └── AboutValues                   [frontend/src/app/about/AboutValues.tsx]
```

---

## Key Imports

### CatalogueClient.tsx
```typescript
import { getMateriels, getCategories, getMaterielImage, formatPrice } from "@/lib/api";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useNominatim } from "@/hooks/useNominatim";
import CatalogueFilters from "./CatalogueFilters";
import ProductCard from "./ProductCard";
import CataloguePagination from "./CataloguePagination";
```

### MaterielDetailClient.tsx
```typescript
import { getMateriel, formatPrice, getMaterielImage } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";  // to show auth-gated actions
import ReservationModal from "./ReservationModal";
import ContactModal from "./ContactModal";
import SimilarMateriels from "./SimilarMateriels";
```

### Navbar.tsx
```typescript
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
// shows: logo, search, locale switcher, auth links (login/signup or dashboard)
```
