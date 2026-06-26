# Ahmed — Frontend ↔ Backend Flow (Auth)

## 1. Registration Flow

```
UI: signup/page.tsx
  → RoleSelector (choose locataire | proprietaire | both)
  → form submit: POST /api/v1/auth/register
      Body: { nom, email, password, role, telephone? }

API (api.ts): fetch POST /auth/register

Controller: auth.controller.js → register()
  1. Validate body (registerValidation with express-validator)
  2. Normalize email (lowercase)
  3. Check duplicate email → User.findOne({ email })
  4. bcrypt.hash(password, 12)
  5. User.create({ nom, email, hashedPassword, role, telephone })
  6. signToken(user) → jwt.sign({ id, email, role, statut }, JWT_SECRET)
  7. res.json({ token, user })

Model: User.js
  Fields: nom, email, password, role, statut, telephone, photo, adresse

UI: receives { token, user }
  → saveAuth(token, user) → localStorage["Kreli_token"] + cookie
  → AuthContext.login(token, user)
  → redirect to /dashboard
```

---

## 2. Login Flow

```
UI: login/page.tsx
  → form submit: POST /api/v1/auth/login
      Body: { email, password }

Controller: auth.controller.js → login()
  1. loginValidation
  2. User.findOne({ email })
  3. bcrypt.compare(password, user.password)
  4. Check statut !== 'suspendu' | 'bloque'
  5. signToken(user) → JWT
  6. res.json({ token, user })

UI: receives { token, user }
  → saveAuth(token, user)
  → useAuth().login(token, user)
  → redirect based on role:
      admin      → /dashboard/admin
      proprietaire → /dashboard/proprietaire
      locataire  → /dashboard/locataire
      both       → /dashboard/locataire (default)
```

---

## 3. Password Reset Flow

```
UI: forgot-password/page.tsx
  → POST /api/v1/auth/forgot-password  { email }

Controller: auth.controller.js → forgotPassword()
  1. User.findOne({ email })
  2. crypto.randomBytes(32).toString("hex") → resetToken
  3. user.resetPasswordToken = SHA256(resetToken)
  4. user.resetPasswordExpires = now + 1 hour
  5. user.save()
  6. sendMail(buildResetPasswordEmail(email, token))

Service: mailer.js → sends email with reset link

UI: reset-password/page.tsx (reads ?token= from URL)
  → POST /api/v1/auth/reset-password  { token, newPassword }

Controller: auth.controller.js → resetPassword()
  1. Hash incoming token → compare with DB
  2. Check resetPasswordExpires > now
  3. bcrypt.hash(newPassword, 12)
  4. user.password = hashed
  5. user.resetPasswordToken = undefined
  6. user.save()
  7. res.json({ message: "Mot de passe réinitialisé" })
```

---

## 4. Token Verification (every protected request)

```
Frontend: api.ts → getToken() from localStorage → adds Authorization: Bearer <token>

Middleware: auth.middleware.js → verifyToken()
  1. Extract "Bearer <token>" from Authorization header
  2. jwt.verify(token, JWT_SECRET) → decoded { id, email, role, statut }
  3. Attach req.user = decoded
  4. Check statut !== 'suspendu' | 'bloque'

Middleware: requireRole(...roles)
  1. Check req.user.role ∈ roles
  2. Special: role === 'both' is authorized for 'locataire' AND 'proprietaire' routes
```

---

## 5. Profile Update Flow

```
UI: locataire/profile/page.tsx OR proprietaire/profile/page.tsx
  → ProfileHeader: displays current user data (from useAuth())
  → SecurityForm: change password
      PUT /api/v1/auth/profile  { currentPassword, newPassword }

Controller: auth.controller.js → updateProfile()
  1. verifyToken middleware validates JWT
  2. Find user by req.user._id
  3. bcrypt.compare(currentPassword, user.password)
  4. bcrypt.hash(newPassword, 12)
  5. user.password = hashed → user.save()
  6. re-sign JWT → res.json({ token, user })

UI: updateUser(user) → refreshes AuthContext state
```

---

## 6. Socket Auth (shared with Meriem)

```
frontend/src/hooks/useSocket.ts
  → io(SOCKET_URL, { auth: { token } })

backend/src/socket/index.js
  → io.use((socket, next) => {
      jwt.verify(socket.handshake.auth.token, JWT_SECRET)
      socket.userId = decoded.id
    })
```
