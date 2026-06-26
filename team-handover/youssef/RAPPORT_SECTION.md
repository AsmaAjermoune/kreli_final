# Youssef — Rapport Section: Espace Propriétaire

## Introduction

L'espace propriétaire représente le côté "offre" de la plateforme Kreli. Un propriétaire peut mettre en location son matériel professionnel, gérer les demandes de location entrantes, suivre ses revenus et communiquer avec ses locataires. La gestion du cycle de vie complet d'une location — de la mise en ligne à la restitution — est au cœur de cette responsabilité.

---

## Objectives

1. Permettre aux propriétaires de créer et gérer leurs annonces de matériel avec photos géolocalisées
2. Implémenter le workflow de validation des demandes de location (accepter/refuser)
3. Suivre les revenus nets après déduction de la commission plateforme
4. Gérer le parc d'équipements (disponibilité, état, prix)
5. Fournir des graphiques d'analyse des revenus mensuels
6. Permettre la communication en temps réel avec les locataires via la messagerie

---

## Implementation

### 1. Création d'équipement avec upload de photos

La page `ajouter/page.tsx` intègre le composant `PhotoUploader` qui gère l'upload multi-fichiers. L'upload se fait en deux étapes : d'abord un `POST /api/v1/upload` (multipart/form-data) via multer qui retourne les URLs, puis un `POST /api/v1/materiels` avec les URLs intégrées dans le corps de la requête.

La géolocalisation est optionnelle : si le propriétaire fournit lat/lng, le champ `location` GeoJSON est renseigné dans le modèle Materiel, permettant les recherches géospatiales (`2dsphere`).

```javascript
// materiels.controller.js
const materiel = await Materiel.create({
  ...body,
  proprietaireId: req.user._id,
  ...(lat && lng && { location: { type: "Point", coordinates: [lng, lat] } })
});
```

### 2. Workflow de validation des locations

Le contrôleur `acceptLocation()` effectue plusieurs actions atomiques lors de l'acceptation d'une demande :
- Passage du statut `en_attente` → `acceptee`
- Confirmation des paiements associés (`Paiement.updateMany → statut: 'confirme'`)
- Notification temps réel au locataire via Socket.IO

Le rejet (`rejectLocation()`) libère automatiquement l'équipement (`disponible: true`) et rembourse les paiements (`statut: 'rembourse'`).

### 3. Commission et calcul des revenus

La commission est lue depuis `CommissionConfig` au moment de la création de la location (snapshotté dans `Location.commissionTaux`). Cela garantit que les changements futurs de commission n'affectent pas les locations existantes.

```
montantNetProprio = montantLocation × (1 - commissionTaux / 100)
```

### 4. Tableau de bord et visualisations

Le dashboard propriétaire charge en parallèle les statistiques, les demandes en attente et le parc. Les composants `RevenueChartCard` et `DemandesCard` sont séparés pour une meilleure lisibilité du code. `RevenusChart` affiche les revenus mensuels en graphique à barres, et `StatusDonutChart` montre la répartition des statuts de locations.

### 5. Gestion du parc (ParcTable)

`ParcTable` affiche tous les matériels avec leur statut de disponibilité en temps réel. L'édition (`[id]/edit/page.tsx`) permet de modifier toutes les propriétés sauf l'identifiant propriétaire.

---

## Challenges

- **Upload multi-photos** : L'ordre des photos doit être conservé (`ordre` field). Le composant `PhotoUploader` gère le réordonnancement drag-and-drop avant l'envoi.
- **Disponibilité atomique** : Quand une location est acceptée, le matériel passe à `disponible: false`. Si la location est rejetée ou annulée, il faut re-passer à `true` — sans oublier aucun cas dans le workflow.
- **Commission snapshot** : La commission est lue depuis `CommissionConfig` lors de la création de location, pas lors du paiement, pour éviter les incohérences si le taux change entre-temps.
- **Géolocalisation optionnelle** : Le champ `location` GeoJSON doit rester optionnel (index sparse) pour ne pas bloquer les propriétaires qui ne souhaitent pas partager leur localisation exacte.

---

## Required Screenshots

- [ ] Tableau de bord propriétaire avec KPIs (revenus, matériels, en location)
- [ ] Page d'ajout d'équipement avec PhotoUploader
- [ ] Preview des photos avant envoi
- [ ] Liste des matériels (ParcTable)
- [ ] Page des demandes de location avec boutons Accepter/Refuser
- [ ] OwnerLocationRow avec actions
- [ ] Graphique des revenus mensuels (RevenusChart)
- [ ] Graphique donut des statuts (StatusDonutChart)

---

## Conclusion

L'espace propriétaire de Kreli donne aux offreurs une visibilité complète sur leur activité de location. La combinaison d'une interface intuitive pour la gestion du parc, d'un workflow de validation clair et de visualisations financières détaillées fait de cet espace un outil professionnel à part entière. La commission plateforme, transparente et configurable, garantit un modèle économique équitable.
