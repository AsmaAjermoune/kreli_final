# Asmaa — Rapport Section: Expérience Publique

## Introduction

L'expérience publique de Kreli est la vitrine de la plateforme : c'est ce que voit un visiteur avant même de s'inscrire. La qualité de cette expérience détermine le taux de conversion des visiteurs en utilisateurs. Asmaa a conçu et implémenté la page d'accueil animée, le catalogue de recherche avancée avec géolocalisation, les pages de détail des équipements, et tous les éléments de navigation globale (Navbar, Footer). Elle a également développé le support multilingue (4 langues dont l'arabe RTL) et les fonctionnalités de géolocalisation basées sur Leaflet et Nominatim.

---

## Objectives

1. Créer une landing page attractive avec animations et sections de contenu dynamique
2. Implémenter un catalogue de recherche full-text + filtres avancés (catégorie, prix, ville, rayon)
3. Intégrer la géolocalisation pour trouver les équipements proches de l'utilisateur
4. Afficher des pages de détail d'équipement avec galerie photos et modal de réservation
5. Assurer le support complet de 4 langues (fr, en, ar RTL, zgh Tifinagh)
6. Garantir l'accessibilité et le SEO pour toutes les pages publiques

---

## Implementation

### 1. Landing Page

La homepage (`app/page.tsx`) est un Server Component qui rend `HomeLandingClient` (Client Component). Cette séparation permet au SSR de générer le HTML initial pour le SEO, tandis que les animations et interactions sont gérées côté client.

La `HeroSection` intègre `RotatingText` — un composant UI animé qui fait défiler les types d'équipements (grues, bulldozers, tentes, etc.) pour capturer l'attention. `MoroccoHeroSection` utilise `CircularGallery` pour un effet visuel distinctif.

### 2. Catalogue avec Recherche Avancée

`CatalogueClient.tsx` est le composant principal du catalogue. Il lit les paramètres URL pour initialiser les filtres (permettant le partage de liens filtrés et le bookmarking). Les filtres sont synchronisés avec l'URL via `router.push()` et `useSearchParams()`.

La géolocalisation combine :
- `useGeolocation()` — accède au GPS du navigateur
- `useNominatim()` — reverse geocoding vers le nom de ville
- `MapPickerLeaflet` — carte interactive Leaflet pour sélection manuelle

Le backend applique deux stratégies en parallèle pour le filtre géographique :
1. Requête `$geoWithin $centerSphere` sur les matériels avec coordonnées GeoJSON
2. Regex sur `localisation` pour les villes proches calculées avec la formule de Haversine

```javascript
// materiels.controller.js
const nearbyNames = MOROCCAN_CITIES.filter((c) =>
  haversineKm({ lat, lng }, c) <= rayon
).map((c) => c.name);
query.$or = [geoClause, { localisation: { $regex: nameRegex } }];
```

### 3. Page de Détail

`materiel/[id]/page.tsx` est un Server Component qui génère les métadonnées dynamiques (titre, description, OG image) pour le SEO. `MaterielDetailClient` gère l'interface interactive.

`ReservationModal` calcule le prix en temps réel à mesure que l'utilisateur sélectionne les dates, et affiche le décompte (nb jours × prix/jour + caution) avant la confirmation.

`ContactModal` crée ou récupère une conversation existante entre le locataire et le propriétaire pour ce matériel spécifique, puis redirige vers l'interface de messagerie.

### 4. Internationalisation (i18n)

Quatre locales sont supportées avec `I18nContext.tsx`. La résolution de locale suit une cascade : préfixe URL → paramètre GET → cookie → localStorage → valeur par défaut (fr).

L'arabe déclenche automatiquement le RTL :
```typescript
useEffect(() => {
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = locale;
}, [locale]);
```

La police Cairo (`--font-arabic`) est automatiquement appliquée pour l'arabe pour une meilleure lisibilité.

### 5. Navbar et Footer

La `Navbar` est un composant global présent sur toutes les pages (layout.tsx). Elle adapte son contenu selon l'état d'authentification (via `useAuth`) : boutons Login/Signup pour les visiteurs, lien Dashboard + avatar pour les utilisateurs connectés.

---

## Challenges

- **SEO vs Interactivité** : Les pages de catalogue doivent être indexables (contenu statique) mais aussi interactives (filtres, cartes). La solution est la séparation Server Component (`page.tsx` avec metadata) + Client Component (`CatalogueClient.tsx`).
- **Géolocalisation dual-strategy** : Tous les matériels n'ont pas de coordonnées GeoJSON. La recherche combine donc requêtes géospatiales ET regex sur les noms de villes.
- **RTL et Tifinagh** : Supporter l'arabe (RTL) et le Tifinagh (caractères rares) simultanément nécessite un chargement de polices conditionnel et une gestion de `dir` au niveau du `<html>`.
- **Performance catalogue** : Avec des milliers d'équipements, les index MongoDB (`categorieId + disponible`, `prixParJour`, `nom text`, `location 2dsphere`) sont critiques pour les performances.

---

## Required Screenshots

- [ ] Landing page complète (hero + sections)
- [ ] Hero avec RotatingText en action
- [ ] Catalogue avec filtres actifs (catégorie + prix)
- [ ] MapPickerLeaflet ouverte avec rayon géographique
- [ ] Résultats filtrés par géolocalisation
- [ ] Page de détail d'équipement (galerie photos)
- [ ] ReservationModal avec calcul de prix
- [ ] ContactModal
- [ ] Page d'accueil en arabe (RTL)
- [ ] Page d'accueil en anglais
- [ ] Page About

---

## Conclusion

L'expérience publique de Kreli constitue le point d'entrée de toute la plateforme. La combinaison d'une landing page visuellement engageante, d'un catalogue de recherche puissant avec géolocalisation, et d'un support multilingue complet positionne Kreli comme une marketplace professionnelle adaptée au marché marocain. Le soin apporté au SEO et aux performances garantit une bonne indexation et une expérience fluide même sur connexions lentes.
