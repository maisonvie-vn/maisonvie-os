# 💾 MVOS Master Data Principles

This document establishes the guidelines for managing, altering, and synchronizing database records inside the Maison Vie Operating System (MVOS).

---

## 1. Single Source of Truth (SSOT)
All system records (user profiles, department mappings, active agent statuses, reservation workflows, and SOP documents) must reside inside the Supabase PostgreSQL database instances. Local states are used for UI feedback, but all persistent state transitions must flow through Supabase database client triggers.

---

## 2. Table Dependency Architecture
The database structure is organized into relational dependencies:
1. **Infrastructure**: `departments` → `roles` → `permissions` → `role_permissions`
2. **Users**: `user_profiles` (mapped 1:1 with `auth.users` via foreign key reference)
3. **Registry**: `documents` → `document_versions` & `sop_documents`
4. **Logic & Automation**: `business_rules` & `ai_agents`
5. **System History**: `audit_logs`

---

## 3. Strict Audit Tracking
Every transaction changing document statuses (e.g. from `DRAFT` to `APPROVED`), modifications in user permissions, or agent status flips must register a row in the `audit_logs` table. This contains:
- `user_id`: Operator initiating the change.
- `action`: Type of action (`CREATE`, `UPDATE`, `DELETE`).
- `target_table` & `target_id`: Database coordinates of the changed record.
- `details`: JSON payload of prior and new states.
