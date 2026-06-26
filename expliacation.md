# Explication des composants — Frontend Kreli

Ce document liste **tous les composants React** du frontend (`frontend/src`) avec une brève explication en français.

Les composants sont regroupés par dossier. Dans Next.js, seuls les fichiers `page.tsx` et `layout.tsx` sont des routes ; les autres fichiers `.tsx` sont des composants co-localisés (réutilisables ou propres à une page).

---

## 1. Composants globaux — `components/`

Composants partagés dans toute l'application.

| Composant | Rôle |
|-----------|------|
| `Navbar.tsx` | Barre de navigation principale : logo, liens, sélecteur de langue, menu utilisateur, cloche de notifications (temps réel). |
| `Footer.tsx` | Pied de page du site : liens, mentions légales, réseaux sociaux. |
| `Providers.tsx` | Enveloppe l'app avec les contextes globaux (authentification, i18n, etc.). |
| `HeroSearch.tsx` | Barre de recherche de la section d'accueil (recherche de matériel). |
| `AnimatedSection.tsx` | Conteneur qui anime l'apparition de son contenu au défilement (avec un délai optionnel). |
| `CookieBanner.tsx` | Bandeau de consentement aux cookies. |
| `TestimonialsSection.tsx` | Section « témoignages » de la page d'accueil. |
| `TestimonialsSlider.tsx` | Carrousel défilant des avis clients. |

---

## 2. Composants d'interface (UI) — `components/ui/`

Briques visuelles de base, principalement issues de **shadcn/ui** (Radix UI + Tailwind), plus quelques composants visuels personnalisés.

### Primitives shadcn/ui (réutilisables partout)

| Composant | Rôle |
|-----------|------|
| `button.tsx` | Bouton (plusieurs variantes et tailles). |
| `input.tsx` | Champ de saisie texte. |
| `label.tsx` | Étiquette de champ de formulaire. |
| `checkbox.tsx` | Case à cocher. |
| `switch.tsx` | Interrupteur on/off. |
| `slider.tsx` | Curseur de sélection (ex. fourchette de prix). |
| `select.tsx` | Liste déroulante de sélection. |
| `dropdown-menu.tsx` | Menu déroulant (actions, options). |
| `popover.tsx` | Petite fenêtre flottante ancrée à un élément. |
| `dialog.tsx` | Fenêtre modale (boîte de dialogue). |
| `sheet.tsx` | Panneau latéral coulissant. |
| `tooltip.tsx` | Info-bulle au survol. |
| `accordion.tsx` | Sections repliables (FAQ, filtres). |
| `collapsible.tsx` | Bloc unique repliable/dépliable. |
| `tabs.tsx` | Onglets de navigation entre vues. |
| `card.tsx` | Carte (conteneur stylisé avec en-tête/contenu). |
| `table.tsx` | Tableau de données. |
| `badge.tsx` | Étiquette/pastille (statut, catégorie). |
| `avatar.tsx` | Photo de profil (avec repli sur initiales). |
| `alert.tsx` | Message d'alerte (info, succès, erreur). |
| `progress.tsx` | Barre de progression. |
| `skeleton.tsx` | Placeholder de chargement (effet « squelette »). |
| `separator.tsx` | Trait de séparation. |
| `scroll-area.tsx` | Zone défilable avec barre stylisée. |
| `navigation-menu.tsx` | Menu de navigation avec sous-menus. |

### Composants visuels personnalisés

| Composant | Rôle |
|-----------|------|
| `RotatingText.tsx` | Texte animé qui change de mot en boucle (effet d'accroche). |
| `action-search-bar.tsx` | Barre de recherche avec actions/suggestions intégrées. |
| `stagger-testimonials.tsx` | Témoignages animés en cascade (apparition décalée). |
| `modem-animated-footer.tsx` | Pied de page animé décoratif. |
| `CircularGallery.jsx` | Galerie d'images circulaire animée (WebGL). |
| `GlassSurface.jsx` | Surface à effet « verre » (glassmorphism). |
| `CircularGallery.d.ts` / `GlassSurface.d.ts` | Fichiers de **types TypeScript** pour les deux composants `.jsx` ci-dessus (pas de logique). |

---

## 3. Composants du tableau de bord — `components/dashboard/`

Partagés entre les espaces locataire, propriétaire et admin.

| Composant | Rôle |
|-----------|------|
| `DashboardUI.tsx` | **Bibliothèque d'UI du dashboard** : briques communes (cartes, en-têtes, statistiques, boutons, badges de statut, champs, pagination, états vides, squelettes…). Source unique du design. |
| `LocataireSidebar.tsx` | Menu latéral de l'espace locataire. |
| `ProprietaireSidebar.tsx` | Menu latéral de l'espace propriétaire. |
| `AdminSidebar.tsx` | Menu latéral de l'espace administrateur. |
| `MessagesView.tsx` | Messagerie temps réel (liste des conversations + fil de discussion), partagée par locataire et propriétaire. |
| `RevenusChart.tsx` | Graphique en barres des revenus (propriétaire). |
| `SpendingChart.tsx` | Graphique des dépenses (locataire). |
| `StatusDonutChart.tsx` | Graphique en anneau de répartition par statut des locations. |

---

## 4. Composants du catalogue — `components/catalogue/`

| Composant | Rôle |
|-----------|------|
| `LocationFilter.tsx` | Filtre géographique : ville, rayon et sélection sur carte. |
| `MapPickerLeaflet.tsx` | Carte interactive (Leaflet) pour choisir un point et un rayon de recherche. |

---

## 5. Composants de la page d'accueil — `components/landing/`

| Composant | Rôle |
|-----------|------|
| `HomeLandingClient.tsx` | Conteneur client qui assemble toutes les sections de la page d'accueil. |
| `HeroSection.tsx` | Section d'en-tête principale (accroche + recherche). |
| `MoroccoHeroSection.tsx` | Variante de hero thématique « Maroc ». |
| `CategorySection.tsx` | Section des catégories de matériel. |
| `FeaturedSection.tsx` | Section du matériel mis en avant (vedette). |
| `HowItWorksSection.tsx` | Section « Comment ça marche » (étapes). |
| `CTASection.tsx` | Section d'appel à l'action (inscription / publication). |

---

## 6. Composants co-localisés par page — `app/`

Composants propres à une page, placés dans le dossier de cette page.

### Page « À propos » — `app/about/`

| Composant | Rôle |
|-----------|------|
| `AboutClient.tsx` | Contenu client de la page « À propos » (animations au défilement). |
| `AboutValues.tsx` | Bloc des valeurs de l'entreprise. |
| `AboutTeam.tsx` | Bloc de présentation de l'équipe. |

### Inscription — `app/auth/signup/`

| Composant | Rôle |
|-----------|------|
| `RoleSelector.tsx` | Sélecteur de rôle à l'inscription (locataire / propriétaire / les deux). |

### Catalogue — `app/catalogue/`

| Composant | Rôle |
|-----------|------|
| `CatalogueClient.tsx` | Logique principale du catalogue (recherche, filtres, résultats, pagination). |
| `CatalogueFilters.tsx` | Panneau de filtres (catégorie, prix, disponibilité…). |
| `ProductCard.tsx` | Carte d'un matériel dans la grille de résultats. |
| `CataloguePagination.tsx` | Pagination des résultats. |

### Détail d'un matériel — `app/materiel/[id]/`

| Composant | Rôle |
|-----------|------|
| `MaterielDetailClient.tsx` | Page de détail d'un matériel (photos, description, prix, actions). |
| `ReservationModal.tsx` | Fenêtre modale de réservation/location. |
| `ContactModal.tsx` | Fenêtre modale pour contacter le propriétaire. |
| `SimilarMateriels.tsx` | Grille de matériels similaires. |

### Espace locataire — `app/dashboard/locataire/`

| Composant | Rôle |
|-----------|------|
| `DashboardCards.tsx` | Cartes du tableau de bord locataire (ligne de location + recommandations). |
| `locations/LocationRow.tsx` | Ligne d'une location dans la liste « Mes locations ». |
| `locations/LitigeModal.tsx` | Fenêtre modale d'ouverture d'un litige. |
| `paiements/TransactionsTable.tsx` | Tableau de l'historique des transactions. |
| `profile/ProfileHeader.tsx` | En-tête du profil (infos + photo). |
| `profile/SecurityForm.tsx` | Formulaire de sécurité (changement de mot de passe). |

### Espace propriétaire — `app/dashboard/proprietaire/`

| Composant | Rôle |
|-----------|------|
| `DemandesCard.tsx` | Carte des demandes de location à traiter. |
| `ParcTable.tsx` | Tableau du parc de matériel du propriétaire. |
| `RevenueChartCard.tsx` | Carte contenant le graphique de revenus. |
| `ajouter/PhotoUploader.tsx` | Téléversement des photos lors de l'ajout d'un matériel. |
| `locations/OwnerLocationRow.tsx` | Ligne d'une location côté propriétaire (avec actions accepter/refuser…). |
| `profile/ProfileHeader.tsx` | En-tête du profil propriétaire. |
| `profile/SecurityForm.tsx` | Formulaire de sécurité (mot de passe) côté propriétaire. |

### Espace administrateur — `app/dashboard/admin/`

Cet espace n'a pas de composants co-localisés dédiés : ses pages utilisent directement `AdminSidebar`, `DashboardUI` et les composants partagés (voir sections 1 à 3).

---

## 7. Contextes (fournisseurs globaux) — `context/`

Composants « Provider » qui exposent un état global via le contexte React, plus leur hook d'accès.

| Composant | Rôle |
|-----------|------|
| `AuthContext.tsx` | `AuthProvider` : gère l'utilisateur connecté et le token ; hook `useAuth()` pour y accéder. |
| `I18nContext.tsx` | `I18nProvider` : gère la langue active (fr, en, ar), le sens RTL et les traductions ; hook `useI18n()` et fonction `t()`. |

Ces deux providers sont assemblés dans `Providers.tsx` (section 1).

---

## 8. Pages et layouts (composants de route) — `app/`

Dans Next.js (App Router), chaque `page.tsx` est une page (composant de route) et chaque `layout.tsx` enveloppe les pages d'une section. Les fichiers spéciaux (`loading`, `error`, `not-found`) sont des écrans d'état.

### Racine

| Fichier | Rôle |
|---------|------|
| `app/layout.tsx` | Layout racine : polices, `Providers`, `Navbar`, `Footer`, métadonnées. |
| `app/page.tsx` | Page d'accueil (rend `HomeLandingClient`). |
| `app/loading.tsx` | Écran de chargement global. |
| `app/error.tsx` | Écran d'erreur global. |
| `app/not-found.tsx` | Page 404. |

### Pages publiques

| Fichier | Rôle |
|---------|------|
| `app/about/page.tsx` | Page « À propos ». |
| `app/catalogue/page.tsx` | Page catalogue. |
| `app/materiel/[id]/page.tsx` | Page de détail d'un matériel. |
| `app/auth/login/page.tsx` | Connexion. |
| `app/auth/signup/page.tsx` | Inscription. |
| `app/auth/forgot-password/page.tsx` | Mot de passe oublié. |
| `app/auth/reset-password/page.tsx` | Réinitialisation du mot de passe. |

### Tableau de bord — redirections

| Fichier | Rôle |
|---------|------|
| `app/dashboard/page.tsx` | Redirige vers le bon espace selon le rôle. |
| `app/dashboard/messages/page.tsx` | Redirige vers la messagerie de l'espace adapté au rôle. |

### Espace locataire — `app/dashboard/locataire/`

| Fichier | Rôle |
|---------|------|
| `layout.tsx` | Layout + protection d'accès (locataire). |
| `page.tsx` | Accueil du tableau de bord locataire. |
| `favoris/page.tsx` | Liste des favoris. |
| `locations/page.tsx` | Mes locations. |
| `paiements/page.tsx` | Mes paiements / transactions. |
| `messages/page.tsx` | Messagerie. |
| `profile/page.tsx` | Profil. |

### Espace propriétaire — `app/dashboard/proprietaire/`

| Fichier | Rôle |
|---------|------|
| `layout.tsx` | Layout + protection d'accès (propriétaire). |
| `page.tsx` | Accueil du tableau de bord propriétaire. |
| `ajouter/page.tsx` | Ajouter un matériel. |
| `materiels/page.tsx` | Mon parc de matériel. |
| `materiels/[id]/edit/page.tsx` | Modifier un matériel. |
| `locations/page.tsx` | Locations reçues. |
| `revenus/page.tsx` | Revenus. |
| `messages/page.tsx` | Messagerie. |
| `profile/page.tsx` | Profil. |

### Espace administrateur — `app/dashboard/admin/`

| Fichier | Rôle |
|---------|------|
| `layout.tsx` | Layout + protection d'accès (admin). |
| `page.tsx` | Tableau de bord admin. |
| `users/page.tsx` | Gestion des utilisateurs. |
| `materiels/page.tsx` | Gestion du matériel. |
| `locations/page.tsx` | Gestion des locations. |
| `paiements/page.tsx` | Gestion des paiements. |
| `litiges/page.tsx` | Gestion des litiges. |
| `categories/page.tsx` | Gestion des catégories. |

---

## Résumé

- **Globaux** : Navbar, Footer, Providers, HeroSearch, AnimatedSection, CookieBanner, TestimonialsSection, TestimonialsSlider.
- **UI** : primitives shadcn/ui (boutons, champs, modales, tableaux…) + composants visuels animés.
- **Dashboard** : sidebars par rôle, messagerie, graphiques et bibliothèque d'UI commune (`DashboardUI`).
- **Catalogue / Landing** : filtres + carte, et les sections de la page d'accueil.
- **Co-localisés** : composants spécifiques aux pages À propos, inscription, catalogue, détail matériel et tableaux de bord.
