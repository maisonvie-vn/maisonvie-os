# 🏛️ MVOS Security Specifications (007)

## 1. Authentication Layer
All access controls are bound to Supabase Authentication. JWT tokens are verified on all endpoints:

- **Tokens**: Verified automatically in client-to-server operations.
- **Session Duration**: Default session limits apply.

## 2. Client Isolation Policies
To prevent key leaks:
- **Client Client (`lib/supabase/client.ts`)**: Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Enforces RLS policies on the client browser.
- **Server Client (`lib/supabase/server.ts`)**: Uses the private `SUPABASE_SERVICE_ROLE_KEY`. Restricted to server-side components (Route Handlers, Server Actions). Never exposed to browser scripts.
- **Git Safeguards**: `.env.local` is listed in `.gitignore` to prevent credential leakage.
