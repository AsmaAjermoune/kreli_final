# Asmaa — Public Experience

## Responsibility Overview
Asmaa owns everything users see before logging in: the homepage/landing page, the public equipment catalogue with search and geolocation, the equipment detail page with reservation modal, the about page, global navigation (Navbar, Footer), the public notification display, and the payment initiation flow. She also owns the public-facing backend catalogue APIs, payment creation, and geolocation services.

---

## Pages

| Page | Path |
|------|------|
| Homepage | `frontend/src/app/page.tsx` |
| Catalogue | `frontend/src/app/catalogue/page.tsx` |
| Catalogue Client | `frontend/src/app/catalogue/CatalogueClient.tsx` |
| Equipment Detail | `frontend/src/app/materiel/[id]/page.tsx` |
| About | `frontend/src/app/about/page.tsx` |
| Error Page | `frontend/src/app/error.tsx` |
| Not Found | `frontend/src/app/not-found.tsx` |
| Loading | `frontend/src/app/loading.tsx` |
| Sitemap | `frontend/src/app/sitemap.ts` |

---

## Components

### Landing Components
| Component | Path | Role |
|-----------|------|------|
| HomeLandingClient | `frontend/src/components/landing/HomeLandingClient.tsx` | Client wrapper for homepage |
| HeroSection | `frontend/src/components/landing/HeroSection.tsx` | Hero with animated text + CTA |
| MoroccoHeroSection | `frontend/src/components/landing/MoroccoHeroSection.tsx` | Morocco-themed hero variant |
| HowItWorksSection | `frontend/src/components/landing/HowItWorksSection.tsx` | 3-step explainer |
| CategorySection | `frontend/src/components/landing/CategorySection.tsx` | Browse by category |
| FeaturedSection | `frontend/src/components/landing/FeaturedSection.tsx` | Featured equipment grid |
| CTASection | `frontend/src/components/landing/CTASection.tsx` | Call-to-action banner |

### Catalogue Components
| Component | Path | Role |
|-----------|------|------|
| CatalogueFilters | `frontend/src/app/catalogue/CatalogueFilters.tsx` | Sidebar filters (category, price, location, availability) |
| CataloguePagination | `frontend/src/app/catalogue/CataloguePagination.tsx` | Pagination controls |
| ProductCard | `frontend/src/app/catalogue/ProductCard.tsx` | Equipment card in grid |
| LocationFilter | `frontend/src/components/catalogue/LocationFilter.tsx` | City + radius filter |
| MapPickerLeaflet | `frontend/src/components/catalogue/MapPickerLeaflet.tsx` | Interactive map for location picking |

### Equipment Detail Components
| Component | Path | Role |
|-----------|------|------|
| MaterielDetailClient | `frontend/src/app/materiel/[id]/MaterielDetailClient.tsx` | Full detail page (client) |
| ContactModal | `frontend/src/app/materiel/[id]/ContactModal.tsx` | Start conversation with owner |
| ReservationModal | `frontend/src/app/materiel/[id]/ReservationModal.tsx` | Date picker + rental form |
| SimilarMateriels | `frontend/src/app/materiel/[id]/SimilarMateriels.tsx` | Related equipment grid |

### Global Components
| Component | Path | Role |
|-----------|------|------|
| Navbar | `frontend/src/components/Navbar.tsx` | Global navigation bar |
| Footer | `frontend/src/components/Footer.tsx` | Global footer |
| HeroSearch | `frontend/src/components/HeroSearch.tsx` | Search bar in hero |
| AnimatedSection | `frontend/src/components/AnimatedSection.tsx` | Scroll-reveal animation wrapper |
| CookieBanner | `frontend/src/components/CookieBanner.tsx` | GDPR cookie consent |
| TestimonialsSection | `frontend/src/components/TestimonialsSection.tsx` | Testimonials carousel |
| TestimonialsSlider | `frontend/src/components/TestimonialsSlider.tsx` | Slider sub-component |

### About Components
| Component | Path | Role |
|-----------|------|------|
| AboutClient | `frontend/src/app/about/AboutClient.tsx` | Client wrapper |
| AboutTeam | `frontend/src/app/about/AboutTeam.tsx` | Team section |
| AboutValues | `frontend/src/app/about/AboutValues.tsx` | Company values |

---

## Hooks

| Hook | Path | Purpose |
|------|------|---------|
| useGeolocation | `frontend/src/hooks/useGeolocation.ts` | Browser geolocation API |
| useNominatim | `frontend/src/hooks/useNominatim.ts` | Geocoding (city name → coordinates) |

---

## Library Utilities

| File | Path | Purpose |
|------|------|---------|
| cities.ts | `frontend/src/lib/cities.ts` | Moroccan cities list for location filter |
| userLocation.ts | `frontend/src/lib/userLocation.ts` | Get user's city from coordinates |
| format.ts | `frontend/src/lib/format.ts` | Number/date formatting utilities |
| api.ts (public functions) | `frontend/src/lib/api.ts` | getMateriels, getMateriel, getCategories, getFeaturedMateriels, getMaterielImage, formatPrice |

---

## Backend APIs

| Controller | Path | Public Endpoints |
|-----------|------|-----------------|
| materiels.controller.js | `backend/src/controllers/materiels.controller.js` | listMateriels, getMateriel, listFeaturedMateriels |
| categories.controller.js | `backend/src/controllers/categories.controller.js` | getAllCategories (public) |
| locations.controller.js | `backend/src/controllers/locations.controller.js` | createLocation (auth required — initiated from detail page) |
| paiements.controller.js | `backend/src/controllers/paiements.controller.js` | createPaiement (initiated with rental) |
| conversations.controller.js | `backend/src/controllers/conversations.controller.js` | createConversation (from ContactModal) |
| upload.routes.js | `backend/src/routes/upload.routes.js` | GET /uploads/:file (serve images) |

---

## i18n

| File | Purpose |
|------|---------|
| `frontend/src/context/I18nContext.tsx` | Locale state management, `t()` function |
| `frontend/src/locales/fr.json` | French translations |
| `frontend/src/locales/en.json` | English translations |
| `frontend/src/locales/ar.json` | Arabic translations (RTL) |
| `frontend/src/locales/ber.json` / `zgh.json` | Tamazight/Tifinagh |
| `frontend/src/middleware.ts` | Locale prefix routing |

---

## Dependencies

- `leaflet` / `react-leaflet` — interactive map for geolocation filter
- `@/hooks/useGeolocation` — browser GPS
- `@/hooks/useNominatim` — reverse geocoding
- `next/image` — optimized equipment photos
- `framer-motion` — landing page animations
- `next/link` — navigation
