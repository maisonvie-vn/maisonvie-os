# SPEC_005: MVOS Permission Architecture Specification

This specification defines the role-based access control (RBAC) rules and RLS configurations.

---

## 1. Access Levels & RLS Rules
Authorization is enforced using Row Level Security (RLS):
- **Read Permissions**: Authenticated employees are granted read permissions on departments, roles, and approved documents.
- **Write Permissions**: Restricted to owners/creators of documents and profiles.
- **Admin Bypass**: Server actions requiring high-level credentials use the server client instance, which bypasses RLS policies securely.
