# SPEC_001: MVOS Enterprise Architecture Specification

This document defines the core enterprise architecture specifications for the Maison Vie Operating System (MVOS).

---

## 1. System Components
MVOS coordinates hospitality operations using decoupled service modules:
- **Presentation Layer**: Next.js 15 Client Interface.
- **Database Engine**: Supabase PostgreSQL.
- **Access Controller**: PostgreSQL Row Level Security (RLS) policies.
- **Integration Engine**: Autonomous background runners (offline/local-first).

---

## 2. Technical Scope
- Enforces data security by isolating browser client tokens from high-privilege service role clients.
- Implements declarative business rules parsed by AI agent frameworks.
- Maintains standard operating procedures (SOP) catalogs.
