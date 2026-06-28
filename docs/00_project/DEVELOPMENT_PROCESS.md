# 🔄 MVOS Development Process

This document outlines the formal development lifecycle for the Maison Vie Operating System (MVOS). All contributions from Junior Software Engineers must flow through these 5 sequential phases:

```
[1. Specification] 
       │
       ▼
[2. Implementation Ticket] 
       │
       ▼
[3. Acceptance Criteria] 
       │
       ▼
[4. Review Checklist] 
       │
       ▼
[5. Release Notes]
```

---

## 📋 Lifecycle Phases

### 1. Specification
- **Owner**: Chief Systems Architect.
- **Goal**: Define the technical requirements, table structures, API properties, and visual standards for a feature.

### 2. Implementation Ticket
- **Owner**: Junior Software Engineer.
- **Goal**: Translate the architectural specification into discrete coding tasks (e.g. database migrations, page layouts, client connectors).

### 3. Acceptance Criteria
- **Owner**: QA / Junior Software Engineer.
- **Goal**: Establish verifiable, binary conditions of success (e.g. "Page /documents loads in < 500ms," "Supabase client initializes without console warnings").

### 4. Review Checklist
- **Owner**: Peer Review / Junior Software Engineer.
- **Goal**: Check off verification gates before staging code:
  - Run `npm run build` locally.
  - Inspect `git status`.
  - Confirm RLS policies are enabled on new tables.
  - Verify that no secrets are committed.

### 5. Release Notes
- **Owner**: Release Manager / Junior Software Engineer.
- **Goal**: Summarize changes, database modifications, and client version bumps. Publish changes to GitHub to trigger Vercel deployment.
