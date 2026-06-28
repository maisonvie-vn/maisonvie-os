# SPEC_004: MVOS Master Data Architecture Specification

This specification governs the storage structure, relational constraints, and schema mappings of core system entities.

---

## 1. Master Data Entities
All transaction records must map to one of the following schemas:
- **`departments`**: Root divisions list.
- **`roles`**: Employee role descriptors.
- **`permissions` & `role_permissions`**: Access criteria mapping.
- **`user_profiles`**: User metadata linked to authenticated logins.
- **`documents`**: Document identifiers, versions, and states.
- **`sop_documents`**: Specific metadata for standard operating procedures.
- **`business_rules`**: JSONB schema configurations for operational boundaries.
- **`ai_agents`**: Active status, logs, and telemetry mappings for background agents.
- **`audit_logs`**: System audit records tracking modification history.
