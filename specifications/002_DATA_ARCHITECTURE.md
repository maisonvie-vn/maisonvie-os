# 🏛️ MVOS Data Architecture (002)

## 1. Relational Database Model
The core database model resides inside PostgreSQL under Supabase. The relations enforce domain boundaries:

```
[auth.users] (Supabase Auth)
     │ (1:1)
[user_profiles] ──(N:1)──> [roles] ──(N:1)──> [departments]
     │                       ▲
     │ (N:1)                 │ (N:N via role_permissions)
[documents] <────────────────┘
  ├── [document_versions] (Audit Trail)
  └── [sop_documents] (Review Times)
```

## 2. Row Level Security (RLS) Design
To guarantee information privacy, RLS policies are applied:
- **`departments`**, **`roles`**, **`permissions`**: Open read access for all authenticated employees.
- **`user_profiles`**: Authenticated read access for all profiles; update restricted to profile owner (`auth.uid() = id`).
- **`documents`**: Read access for all; insert/update restricted to owner (`auth.uid() = owner_id`).
