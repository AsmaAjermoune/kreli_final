# Sara — Rapport Section: Panneau d'Administration

## Introduction

L'administration d'une marketplace multi-acteurs requiert une vision globale et des outils de contrôle puissants. Le panneau d'administration de Kreli donne à l'équipe de gestion une visibilité complète sur toutes les transactions, tous les utilisateurs et toutes les disputes de la plateforme. C'est le module qui garantit la conformité, la qualité des listings et la résolution équitable des conflits.

---

## Objectives

1. Fournir un tableau de bord administratif avec des métriques globales en temps réel
2. Gérer les comptes utilisateurs (suspension, blocage, suppression)
3. Modérer les équipements listés (mise en avant, suppression)
4. Maintenir le catalogue de catégories d'équipements
5. Arbitrer les litiges entre locataires et propriétaires
6. Superviser tous les paiements et corriger les anomalies manuellement
7. Configurer le taux de commission de la plateforme

---

## Implementation

### 1. Tableau de bord administratif

La page principale (`dashboard/admin/page.tsx`) charge en parallèle trois types de statistiques : statistiques générales, statistiques des litiges et statistiques des paiements. Des alertes dynamiques signalent les litiges ouverts et les paiements en attente nécessitant une action immédiate.

```typescript
// admin/page.tsx
Promise.all([getAdminStats(), getAdminLitigesStats(), getAdminPaiementsStats()])
  .then(([s, l, p]) => {
    setStats(s);
    setLitigesOuverts(l.ouverts);
    setPaiementsEnAttente(p.enAttente);
  });
```

Les animations `framer-motion` créent un effet de stagger sur les éléments du dashboard pour une expérience fluide.

### 2. Gestion des utilisateurs

La liste des utilisateurs est paginée et filtrable par rôle et statut. Les actions de modération (suspension, blocage) sont immédiates et prennent effet dès la prochaine requête API de l'utilisateur concerné, car `verifyToken` vérifie le `statut` en base à chaque appel.

Règles de sécurité critiques :
- Un admin ne peut pas se supprimer lui-même
- Le dernier admin ne peut pas être supprimé

### 3. Gestion des catégories

Les catégories organisent le catalogue. Chaque catégorie peut avoir une image téléchargée via multer. La suppression est protégée : si des matériels actifs utilisent la catégorie, la suppression est refusée.

### 4. Arbitrage des litiges

Le workflow d'arbitrage est en deux étapes :
1. **Assignation** : l'admin prend en charge le litige (`statut: 'en_cours'`, `adminId: req.user._id`)
2. **Résolution** : l'admin saisit sa décision et sa résolution → le système met à jour automatiquement le statut de la location, la disponibilité du matériel, et le statut de la caution. Des notifications sont envoyées aux deux parties via Socket.IO.

### 5. Supervision des paiements

L'admin peut corriger manuellement les statuts de paiement (confirmer, rembourser). Cette fonctionnalité est essentielle pour gérer les cas exceptionnels non couverts par le workflow automatique (paiements en espèces, litiges financiers).

### 6. Configuration de la commission

Le taux de commission est unique et configurable depuis l'interface admin. Il est snapshotté dans chaque location au moment de sa création — les modifications n'affectent que les nouvelles locations.

---

## Challenges

- **Données croisées** : Les statistiques admin nécessitent des agrégations MongoDB complexes (`$group`, `$match`, `$sum`) sur plusieurs collections. Des index appropriés sont nécessaires pour maintenir les performances.
- **Cascade de suppression** : La suppression d'un utilisateur doit nettoyer ses matériels, annuler ses locations actives et notifier les contreparties. Cette cascade doit être transactionnelle.
- **Litiges multi-acteurs** : La résolution d'un litige affecte simultanément Location (statut), Materiel (disponibilité), Paiement (caution) et envoie des notifications aux deux parties — une chaîne d'effets à coordonner soigneusement.
- **Sécurité admin** : Toutes les routes admin utilisent `requireRole("admin")`. Il est critique que ce middleware soit appliqué sans exception.

---

## Required Screenshots

- [ ] Tableau de bord admin avec KPIs et alertes
- [ ] Liste des utilisateurs avec filtres et actions de modération
- [ ] Formulaire de création/édition de catégorie
- [ ] Liste des litiges avec filtres de statut
- [ ] Détail d'un litige (location, matériel, locataire, raison)
- [ ] Modal de résolution de litige
- [ ] Liste des paiements avec statuts
- [ ] Toggle featured sur un matériel
- [ ] Accès rapide aux 5 sections depuis le dashboard

---

## Conclusion

Le panneau d'administration de Kreli centralise toutes les fonctions de gouvernance de la plateforme dans une interface claire et efficace. La gestion des litiges en deux étapes (assignation puis résolution) garantit qu'aucun conflit n'est traité à la légère. La configuration de commission flexible permet d'ajuster le modèle économique sans modification de code.
