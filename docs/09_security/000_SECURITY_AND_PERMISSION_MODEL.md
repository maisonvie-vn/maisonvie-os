# 🛡️ MVOS Security & Permission Model

This document outlines the security controls, Row Level Security (RLS) rules, and authorization layers of the Maison Vie Operating System (MVOS).

---

## 1. Authentication Layer
All user accounts are authenticated through Supabase Authentication. JWT tokens are verified automatically on each client-to-server transaction.

---

## 2. Row Level Security (RLS) Policy Design
Every table inside the MVOS schema must have Row Level Security enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`). RLS rules guarantee that:
- **Authenticated Read**: All logged-in employees can browse corporate departments, active roles, approved procedures, and agents.
- **Profile Lockdown**: Users can only update their own `user_profiles` details. Bypassing this requires the administrative server client.
- **Document Management**: Only the document creator/owner has permissions to issue updates or insert new revisions, maintaining ownership sanity.

---

## 3. Client Isolation & Server Keys
- **Browser Client (`lib/supabase/client.ts`)**: Uses the anon public key. Operates entirely within the authenticated user session. Suitable for client components and public pages.
- **Server Client (`lib/supabase/server.ts`)**: Bypasses user policies only during admin-authorized procedures by using the `SUPABASE_SERVICE_ROLE_KEY`. This key must never be sent to or loaded by browser components.
