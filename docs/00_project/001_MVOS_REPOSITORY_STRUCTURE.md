# 📂 MVOS Repository Structure

This document outlines the standard folder mapping and file organization guidelines for Maison Vie Operating System (MVOS).

---

## 🏛️ Directory Organization

```
/maisonvie-os
├── /app             # Application routes, pages, and layouts (Next.js App Router)
│   ├── /admin       # Administrative sandbox, env diagnostics & database status
│   ├── /dashboard   # Live operational statistics & FOH seatings feed
│   ├── /documents   # Document Library & SOP catalog interface
│   └── /sop         # Standard Operating Procedure list rendering
│
├── /components      # Shared layout blocks, buttons, tables, and navbars
│
├── /lib             # Third-party configuration objects and clients
│   └── /supabase    # Client and Server Supabase database clients
│
├── /database        # PostgreSQL schema creation files and SQL migrations
│
├── /docs            # Master documentation, sprints roadmap, and charter logs
│
├── /prompts         # Templates and version control logs for LLM agents
│
├── /workflows       # Task orchestration files, deploy logs, and script pipelines
│
└── /agents          # Execution loops for background autonomous agents
```

---

## 🛠️ Code Conventions
1. **App Router**: Put all user-facing pages inside `/app` in lowercase folders with a `page.tsx` file.
2. **Environment Isolation**: Never commit keys to the repo. Keep them strictly inside `.env.local` and define names inside `.env.example`.
3. **Data Integrity**: Place SQL schema definitions under `/database` naming them sequentially (e.g. `001_mvos_foundation_schema.sql`).
