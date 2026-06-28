# 🏛️ MVOS Layer Architecture

This document describes the layered organization of the Maison Vie Operating System (MVOS).

---

## 1. System Layers

### 1. Presentation Layer (`/app`, `/components`)
- Vietnamese user interface for hostesses, managers, and service leads.
- Styled using Tailwind CSS v4 with neoclassical dark themes.

### 2. Service Layer (`/lib`)
- Client and server client instances.
- Handles authorization scopes, database connections, and i18n dictionaries.

### 3. Data & Storage Layer (`/database`)
- Schema declarations and SQL scripts.
- Supabase storage buckets and tables.

### 4. Agent & Automation Layer (`/agents`, `/workflows`, `/prompts`)
- Autonomous runners evaluating SOP checks and logging status changes.
