# Ahmed — Component Tree (Auth & Authorization)

```
app/
└── layout.tsx (root)
    └── Providers                            [frontend/src/components/Providers.tsx]
        ├── AuthProvider                     [frontend/src/context/AuthContext.tsx]
        │   └── useAuth() hook — consumed by all protected layouts
        └── I18nProvider                     [frontend/src/context/I18nContext.tsx] (shared with Asmaa)

auth/
├── login/
│   └── page.tsx                            [frontend/src/app/auth/login/page.tsx]
│       └── uses: useAuth() → login()
│       └── calls: POST /api/v1/auth/login
│
├── signup/
│   └── page.tsx                            [frontend/src/app/auth/signup/page.tsx]
│       └── RoleSelector                    [frontend/src/app/auth/signup/RoleSelector.tsx]
│           └── props: value, onChange → sets role (locataire|proprietaire|both)
│       └── calls: POST /api/v1/auth/register
│
├── forgot-password/
│   └── page.tsx                            [frontend/src/app/auth/forgot-password/page.tsx]
│       └── calls: POST /api/v1/auth/forgot-password
│
└── reset-password/
    └── page.tsx                            [frontend/src/app/auth/reset-password/page.tsx]
        └── calls: POST /api/v1/auth/reset-password

dashboard/
├── admin/
│   └── layout.tsx                          [auth guard: role === 'admin']
│       └── AdminSidebar                    [frontend/src/components/dashboard/AdminSidebar.tsx] (Sara)
│
├── locataire/
│   ├── layout.tsx                          [auth guard: isLoggedIn()]
│   │   └── LocataireSidebar               [frontend/src/components/dashboard/LocataireSidebar.tsx] (Meriem)
│   └── profile/
│       ├── page.tsx
│       ├── ProfileHeader.tsx               → displays user avatar, name, email, role
│       └── SecurityForm.tsx                → change password form
│           └── calls: PUT /api/v1/auth/profile (password change)
│
└── proprietaire/
    ├── layout.tsx                          [auth guard: role === 'proprietaire' || 'both']
    │   └── ProprietaireSidebar            [frontend/src/components/dashboard/ProprietaireSidebar.tsx] (Youssef)
    └── profile/
        ├── page.tsx
        ├── ProfileHeader.tsx               → displays user avatar, name, email, role
        └── SecurityForm.tsx                → change password form
            └── calls: PUT /api/v1/auth/profile (password change)
```

---

## Key Imports

### AuthContext.tsx
```typescript
import type { AuthUser } from "@/lib/api";
import { saveAuth, clearAuth, getStoredUser, getToken } from "@/lib/auth";
```

### login/page.tsx
```typescript
import { useAuth } from "@/context/AuthContext";
// calls login(token, user) after API response
```

### Protected layout pattern (all 3 dashboards)
```typescript
const { user, isLoading } = useAuth();
useEffect(() => {
  if (!isLoading && !user) router.push("/auth/login");
}, [user, isLoading]);
```

### auth.middleware.js
```javascript
const jwt = require("jsonwebtoken");
// verifyToken → attaches req.user = { _id, id, email, role, statut }
// requireRole(...roles) → checks req.user.role
```
