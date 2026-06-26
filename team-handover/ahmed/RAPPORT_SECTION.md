# Ahmed — Rapport Section: Authentication & Authorization

## Introduction

La sécurité est le pilier fondamental de toute plateforme multi-utilisateurs. Dans le cadre du projet Kreli, la gestion de l'authentification et des autorisations constitue un enjeu critique, car la plateforme regroupe plusieurs types d'utilisateurs (locataires, propriétaires, administrateurs) avec des droits d'accès distincts. Ce module garantit que chaque utilisateur accède uniquement aux fonctionnalités qui lui sont destinées.

---

## Objectives

1. Implémenter un système d'inscription sécurisé avec validation des données et hachage des mots de passe
2. Mettre en place une authentification JWT (JSON Web Token) pour les sessions sans état
3. Assurer une gestion des rôles (locataire, propriétaire, both, admin) avec protection des routes
4. Permettre la réinitialisation du mot de passe via email
5. Protéger les layouts de tableau de bord selon le rôle de l'utilisateur connecté
6. Gérer la session côté client (localStorage + cookie) de manière cohérente

---

## Implementation

### 1. Inscription et hachage du mot de passe

Le contrôleur `auth.controller.js` valide les données d'entrée via `express-validator` avant tout traitement. Le mot de passe est haché avec `bcryptjs` (facteur de coût : 12) avant persistance dans MongoDB. Un token JWT est signé et retourné immédiatement après la création du compte.

```javascript
// auth.controller.js
const hashedPassword = await bcrypt.hash(password, 12);
const user = await User.create({ nom, email, password: hashedPassword, role });
const token = signToken(user);
res.json({ token, user });
```

### 2. JWT et gestion de session

Le token JWT encode `{ id, email, role, statut }` et expire selon la variable `JWT_EXPIRES_IN`. Côté frontend, `saveAuth()` persiste le token dans `localStorage["Kreli_token"]` ET dans un cookie HTTP `Kreli_token` (SameSite=Lax), ce qui permet au middleware Next.js de lire le statut d'authentification pour le routage de locale.

### 3. Contexte d'authentification React

`AuthContext.tsx` expose un état global partagé entre tous les composants. Lors du chargement initial, il lit le token et l'utilisateur depuis `localStorage` via `getStoredUser()` et `getToken()`.

```typescript
// AuthContext.tsx
useEffect(() => {
  setUser(getStoredUser());
  setToken(getToken());
  setIsLoading(false);
}, []);
```

### 4. Protection des layouts

Chaque sous-dashboard possède son propre `layout.tsx` qui vérifie le rôle et redirige si non autorisé :

- `admin/layout.tsx` → redirige vers `/auth/login` si `user.role !== 'admin'`
- `locataire/layout.tsx` → redirige vers `/auth/login` si non connecté
- `proprietaire/layout.tsx` → redirige vers `/auth/login` si non connecté, vers `/dashboard` si rôle incorrect

### 5. Middleware backend

`verifyToken` extrait le token du header `Authorization: Bearer <token>`, le vérifie avec `jwt.verify()`, et attache `req.user` à la requête. `requireRole(...roles)` autorise également le rôle `both` pour les routes locataire et propriétaire.

### 6. Réinitialisation du mot de passe

Un token cryptographique (32 octets hexadécimaux) est généré via `crypto.randomBytes()`, haché en SHA-256 avant stockage. L'email est envoyé via `mailer.js`. La validité est limitée à 1 heure.

---

## Challenges

- **Synchronisation localStorage / cookie** : Le middleware Next.js ne peut lire que les cookies (pas localStorage). La solution adoptée est d'écrire simultanément dans les deux lors de `saveAuth()`.
- **Rôle `both`** : Un utilisateur peut être locataire ET propriétaire. `requireRole()` gère ce cas spécialement.
- **SSR vs Client** : `getToken()` retourne `null` côté serveur (guard `typeof window === "undefined"`), évitant les erreurs d'hydratation.
- **Sécurité du token de réinitialisation** : Le token brut est envoyé par email, mais uniquement son hash SHA-256 est stocké en base, empêchant les fuites de base de données d'être exploitées.

---

## Required Screenshots

- [ ] Page d'inscription avec sélecteur de rôle (RoleSelector)
- [ ] Page de connexion
- [ ] Page de mot de passe oublié
- [ ] Email de réinitialisation reçu
- [ ] Page de réinitialisation du mot de passe
- [ ] Formulaire de changement de mot de passe (SecurityForm dans le profil)
- [ ] Redirection automatique après connexion (selon le rôle)
- [ ] Message d'erreur lors d'un accès non autorisé

---

## Conclusion

Le module d'authentification de Kreli offre une sécurité robuste grâce à la combinaison de JWT, bcrypt et d'une validation stricte des entrées. La gestion multi-rôles est transparente pour l'utilisateur final et extensible pour de futurs rôles. L'architecture sans état (stateless) facilite le déploiement distribué sur Railway.
