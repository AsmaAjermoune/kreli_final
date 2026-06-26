# Meriem — Rapport Section: Espace Locataire & Messagerie

## Introduction

L'espace locataire constitue le cœur fonctionnel de la plateforme Kreli du point de vue du client final. C'est ici que l'utilisateur suit ses locations, consulte ses dépenses, communique en temps réel avec les propriétaires, et gère ses équipements favoris. La messagerie instantanée, basée sur Socket.IO, est l'une des fonctionnalités les plus différenciatrices de la plateforme.

---

## Objectives

1. Offrir un tableau de bord locataire clair avec des KPIs (locations en attente, en cours, terminées, total dépensé)
2. Permettre au locataire de suivre l'historique complet de ses locations avec les statuts en temps réel
3. Implémenter un système de messagerie temps réel avec les propriétaires via Socket.IO
4. Gérer les favoris : ajouter/retirer des équipements depuis la liste
5. Afficher l'historique des paiements (caution + loyer)
6. Permettre l'ouverture de litiges en cas de problème
7. Afficher les notifications en temps réel (nouveaux messages, mises à jour de statut)

---

## Implementation

### 1. Tableau de bord locataire

La page principale (`dashboard/locataire/page.tsx`) charge en parallèle les statistiques, les dernières locations et les recommandations avec `Promise.all`. Les KPIs sont affichés dans des cartes animées. Un graphique de dépenses (`SpendingChart`) visualise les tendances mensuelles.

### 2. Gestion des locations

La page `dashboard/locataire/locations/page.tsx` affiche toutes les locations avec pagination. Chaque ligne (`LocationRow`) montre le statut coloré (orange = en attente, vert = en cours, gris = terminée). Les actions disponibles changent dynamiquement selon le statut : annulation possible uniquement en `en_attente`, litige possible en `en_cours`.

### 3. Messagerie temps réel

Le composant `MessagesView` est le composant le plus complexe de cet espace. Il maintient deux panneaux : la liste des conversations (triée par `dernierMsgAt`) et le panneau de chat actif. La connexion Socket.IO est gérée via le singleton `useSocket(token)`, garantissant une seule connexion par session navigateur.

```typescript
// Envoi d'un message
socket.emit("send_message", { conversationId, contenu: text });

// Réception
socket.on("receive_message", ({ conversationId, message }) => {
  setMessages(prev => [...prev, message]);
});

// Lecture
socket.emit("mark_read", { conversationId });
socket.on("messages_read", ({ conversationId }) => {
  // marquer les messages comme lus côté UI
});
```

Le filtre anti-contenu du serveur bloque les numéros de téléphone et URLs dans les messages (politique de sécurité pour protéger les revenus de la plateforme).

### 4. Notifications

`useNotifications.ts` combine polling HTTP (comptage initial) et événements Socket.IO (`new_notification`) pour un badge dynamique dans la sidebar. Les notifications sont persistées en base via `Notification.create()` côté serveur.

### 5. Favoris

Le locataire peut marquer un équipement comme favori depuis la page de détail (Asmaa), et consulter sa liste depuis `dashboard/locataire/favoris/page.tsx`. Les favoris sont stockés comme tableau d'ObjectId dans le document `User.favoris`.

---

## Challenges

- **Singleton Socket** : Un seul socket doit être maintenu pour toute la session navigateur, même si plusieurs composants appellent `useSocket()`. Le module-level singleton dans `useSocket.ts` résout ce problème.
- **Scroll auto** : Le chat doit scroller automatiquement vers le bas à chaque nouveau message, mais sans perturber la navigation dans l'historique.
- **Filtre anti-contenu** : Les messages contenant des numéros de téléphone ou URLs sont bloqués côté serveur via regex. L'événement `message_error` est utilisé pour afficher un message d'erreur à l'expéditeur.
- **Statuts des conversations** : La liste de conversations doit afficher le nombre de messages non lus. Ce comptage est calculé à la volée depuis les messages non lus (lu: false, expediteurId: autre).

---

## Required Screenshots

- [ ] Tableau de bord locataire avec KPIs
- [ ] Liste des locations avec statuts colorés
- [ ] Modal d'ouverture de litige (LitigeModal)
- [ ] Interface de messagerie (liste conversations + panneau chat)
- [ ] Message bloqué (numéro de téléphone/URL)
- [ ] Badge de notification non lue
- [ ] Page des favoris
- [ ] Tableau des paiements (TransactionsTable)

---

## Conclusion

L'espace locataire de Kreli offre une expérience complète et fluide grâce à l'intégration de la messagerie temps réel et d'un tableau de bord riche en informations. La séparation claire entre les données en attente, en cours et terminées permet au locataire de gérer efficacement ses locations. La messagerie bidirectionnelle renforce la confiance entre locataires et propriétaires en évitant tout contact direct hors plateforme.
