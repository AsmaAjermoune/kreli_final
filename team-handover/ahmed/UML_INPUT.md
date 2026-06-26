# Ahmed — UML Input (Auth & Authorization)

## Classes

### AuthUser (TypeScript — frontend/src/lib/api.ts)
```
AuthUser {
  _id: string
  nom: string
  email: string
  role: "locataire" | "proprietaire" | "both" | "admin"
  statut: string
  photo?: string
  telephone?: string
  adresse?: string
  createdAt?: string
}
```

### AuthResponse (frontend/src/lib/api.ts)
```
AuthResponse {
  token: string
  user: AuthUser
}
```

### AuthContextType (frontend/src/context/AuthContext.tsx)
```
AuthContextType {
  user: AuthUser | null
  token: string | null
  login(token: string, user: AuthUser): void
  logout(): void
  updateUser(user: AuthUser): void
  isLoading: boolean
}
```

### User (MongoDB Model — backend/src/models/User.js)
```
User {
  _id: ObjectId
  nom: String [required]
  email: String [required, unique, lowercase]
  password: String [bcrypt hash]
  telephone: String
  photo: String
  adresse: String
  role: Enum["locataire", "proprietaire", "admin", "both"]
  statut: Enum["actif", "suspendu", "bloque"]
  favoris: [ObjectId → Materiel]
  resetPasswordToken: String
  resetPasswordExpires: Date
  createdAt: Date
}
```

---

## Relationships

```
AuthProvider ──provides──► AuthContext ──consumed by──► useAuth()
useAuth() ──read by──► Protected Layouts (admin/locataire/proprietaire)
AuthContext.login() ──calls──► saveAuth() (auth.ts)
saveAuth() ──writes──► localStorage + cookie
Frontend auth.ts ──reads token──► api.ts (Authorization header)
api.ts ──sends Bearer token──► Backend verifyToken middleware
verifyToken ──decodes──► JWT payload → req.user
req.user ──checked by──► requireRole() middleware
```

---

## Sequence Actors

- **User** (browser)
- **LoginPage** / **SignupPage** / **ResetPage**
- **AuthContext** (React context)
- **api.ts** (fetch layer)
- **Express Router** (auth.routes.js)
- **AuthController** (auth.controller.js)
- **verifyToken** middleware
- **User Model** (MongoDB)
- **JWT** (jsonwebtoken)
- **bcrypt**
- **Mailer** (mailer.js)

---

## Endpoints

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | /api/v1/auth/register | None | { nom, email, password, role } | { token, user } |
| POST | /api/v1/auth/login | None | { email, password } | { token, user } |
| GET | /api/v1/auth/me | verifyToken | — | { user } |
| PUT | /api/v1/auth/profile | verifyToken | { currentPassword?, newPassword?, nom?, telephone? } | { token, user } |
| POST | /api/v1/auth/forgot-password | None | { email } | { message } |
| POST | /api/v1/auth/reset-password | None | { token, newPassword } | { message } |

---

## States (User statut lifecycle)

```
[actif] ──admin suspend──► [suspendu]
[actif] ──admin block──► [bloque]
[suspendu] ──admin reactivate──► [actif]
[bloque] ──admin reactivate──► [actif]

Token validation:
  statut === 'suspendu' | 'bloque' → 403 Forbidden (even with valid JWT)
```

---

## Exchanged Data

### Registration Request
```json
{
  "nom": "Youssef Alami",
  "email": "youssef@example.com",
  "password": "SecurePass1",
  "role": "proprietaire",
  "telephone": "+212600000000"
}
```

### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a...",
    "nom": "Youssef Alami",
    "email": "youssef@example.com",
    "role": "proprietaire",
    "statut": "actif"
  }
}
```

### JWT Payload
```json
{
  "id": "64a...",
  "email": "youssef@example.com",
  "role": "proprietaire",
  "statut": "actif",
  "iat": 1700000000,
  "exp": 1700604800
}
```
