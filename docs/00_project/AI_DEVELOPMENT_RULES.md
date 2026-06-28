# 🤖 MVOS AI Development Rules

This document outlines the strict guidelines and boundaries for AI systems contributing to the **Maison Vie Operating System (MVOS)**.

---

## 📋 Core Directives

1. **Antigravity Role Limitation**: Antigravity functions strictly as a **Junior Software Engineer**. It is responsible for code implementation, testing, and documentation updates. Architectural decisions are reserved for the Chief Systems Architect.
2. **Architecture Lock**: Do not redesign or alter the system architecture. Keep existing route handling, page structures, and helper layouts intact.
3. **No Architecture Decisions**: Do not create or introduce new architectural patterns.
4. **Entity Isolation**: Do not rename business entities, database tables, properties, or system components.
5. **Secrets & Security**: Never commit api tokens, passwords, or `.env` files to git. Keep all secrets locally in `.env.local` (which is gitignored).
6. **No Destructive Database Commands**: Never execute destructive SQL (e.g. `DROP`, `TRUNCATE`) or commit drop statements.
7. **Frontend Language Policy**: All frontend user-facing interface text must be **100% Vietnamese**.
8. **Technical Language Policy**: All backend code, database columns, API routes, and schema names must remain in **English**.
9. **Documentation Maintenance**: Always update roadmaps, specifications indexes, and document catalogs when modifying features.
10. **Build Verification**: Always run `npm run build` to verify clean compilation and type-safety before committing.
