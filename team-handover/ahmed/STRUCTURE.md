# Ahmed — Authentication & Authorization

## Responsibility Overview
Ahmed owns the full authentication and authorization system: user registration, login, JWT token lifecycle, password reset, role-based access control, and all auth-guarded layouts.

---

## Pages

| Page | Path |
|------|------|
| Login | `frontend/src/app/auth/login/page.tsx` |
| Signup | `frontend/src/app/auth/signup/page.tsx` |
| Forgot Password | `frontend/src/app/auth/forgot-password/page.tsx` |
| Reset Password | `frontend/src/app/auth/reset-password/page.tsx` |
| Locataire Profile | `frontend/src/app/dashboard/locataire/profile/page.tsx` |
| Proprietaire Profile | `frontend/src/app/dashboard/proprietaire/profile/page.tsx` |

---

## Components

| Component | Path | Role |
|-----------|------|------|
| RoleSelector | `frontend/src/app/auth/signup/RoleSelector.tsx` | Role picker on registration |
| ProfileHeader (locataire) | `frontend/src/app/dashboard/locataire/profile/ProfileHeader.tsx` | Display user info |
| SecurityForm (locataire) | `frontend/src/app/dashboard/locataire/profile/SecurityForm.tsx` | Change password |
| ProfileHeader (proprietaire) | `frontend/src/app/dashboard/proprietaire/profile/ProfileHeader.tsx` | Display user info |
| SecurityForm (proprietaire) | `frontend/src/app/dashboard/proprietaire/profile/SecurityForm.tsx` | Change password |
| Providers | `frontend/src/components/Providers.tsx` | Wraps AuthProvider + I18nProvider |

---

## Hooks

| Hook | Path | Purpose |
|------|------|---------|
| useAuth | `frontend/src/context/AuthContext.tsx` (exported) | Access current user, login, logout, updateUser |

---

## Contexts

| Context | Path | Purpose |
|---------|------|---------|
| AuthContext | `frontend/src/context/AuthContext.tsx` | Global auth state (user, token, login, logout) |

---

## Protected Layouts (Auth Guards)

| Layout | Path | Protection |
|--------|------|------------|
| Admin Layout | `frontend/src/app/dashboard/admin/layout.tsx` | Redirects non-admin to `/auth/login` |
| Locataire Layout | `frontend/src/app/dashboard/locataire/layout.tsx` | Redirects unauthenticated users |
| Proprietaire Layout | `frontend/src/app/dashboard/proprietaire/layout.tsx` | Redirects unauthenticated users |

---

## Library Utilities

| File | Path | Purpose |
|------|------|---------|
| auth.ts | `frontend/src/lib/auth.ts` | saveAuth, clearAuth, getToken, getStoredUser, isLoggedIn |
| api.ts (AuthUser, AuthResponse types) | `frontend/src/lib/api.ts` | Shared auth types |

---

## Backend APIs

| File | Path | Purpose |
|------|------|---------|
| auth.controller.js | `backend/src/controllers/auth.controller.js` | register, login, me, updateProfile, forgotPassword, resetPassword |
| auth.routes.js | `backend/src/routes/auth.routes.js` | POST /register, POST /login, GET /me, PUT /profile, POST /forgot-password, POST /reset-password |
| auth.middleware.js | `backend/src/middleware/auth.middleware.js` | verifyToken, requireRole |
| users.controller.js | `backend/src/controllers/users.controller.js` | Admin user management (suspend, block, delete) |
| users.routes.js | `backend/src/routes/users.routes.js` | Admin user CRUD |

---

## Models

| Model | Path | Auth-relevant Fields |
|-------|------|---------------------|
| User | `backend/src/models/User.js` | email, password (bcrypt), role, statut, resetPasswordToken, resetPasswordExpires |

---

## Services / Utils

| File | Path | Purpose |
|------|------|---------|
| mailer.js | `backend/src/utils/mailer.js` | Sends reset-password emails |
| email.service.js | `backend/src/services/email.service.js` | Email template helpers |

---

## Dependencies

- `bcryptjs` — password hashing
- `jsonwebtoken` — JWT sign/verify
- `express-validator` — input validation
- `nodemailer` / `@sendgrid/mail` — reset email delivery
- `crypto` (Node built-in) — reset token generation
- `socket.io` — JWT also used for socket auth handshake (shared with Meriem)
