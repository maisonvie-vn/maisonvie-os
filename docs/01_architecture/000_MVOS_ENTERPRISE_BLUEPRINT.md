# 🏛️ MVOS Enterprise Blueprint

## 1. Architectural Blueprint
The **Maison Vie Operating System (MVOS)** serves as the operations interface and automation backbone for our neoclassical restaurant and villa. 

```
[Next.js Client (Vietnamese FOH UI)] 
                │
                ▼ (Auth & Queries)
       [Supabase REST/Auth APIs]
                │
         (RLS Constraints)
                ▼
      [Supabase PostgreSQL DB]
```

## 2. Governance Directives
- User-facing text must remain in Vietnamese.
- Codebases, schemas, APIs, and configuration files must stay in English.
- Secrets must reside strictly in `.env.local`.
