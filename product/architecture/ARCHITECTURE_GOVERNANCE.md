# MVOS Architecture Governance

## 1. Purpose
The Maison Vie Operating System (MVOS) is a unified operating system governing high-end neoclassical restaurant operations. Because these workflows directly manage VIP customers, table capacities, and kitchen service lines, all architectural changes must be strictly governed to protect the following business-critical workflows:
* **Reservation Workflow**
* **Email Draft Workflow**
* **CEO Dashboard**
* **Continuous Learning**
* **Future Inventory, Finance, and HR systems**

---

## 2. Architecture Change Definition
An architecture-level change is defined as any modification that alters or extends the structural layers of MVOS, including:
* **Database Schema**: Adding, modifying, or deleting tables, columns, constraints, or schemas.
* **Security Model**: Modifying PostgreSQL Row Level Security (RLS) rules or policies.
* **Authentication & Session**: Modifying user sign-in, sign-out, or session context access.
* **Routing Structure**: Altering primary directory routes or route handlers in the app.
* **Core Domain Model**: Extending or changing the core entities like reservations, emails, or learning events.
* **Cross-Module Data Ownership**: Data tenancy partitioning (e.g. multi-branch identifiers).
* **External Integration**: Introducing third-party API platforms or services (e.g. POS, Gmail, Google Reviews).
* **Background Jobs & Triggers**: Adding background processing queues, triggers, or automated crons.
* **AI/Automation Decision Logic**: Introducing AI agents, recommendation algorithms, or automated decision flows.
* **Shared Component Architecture**: Structural changes to the Navbar, main layouts, or globals CSS.

---

## 3. RFC Requirement
Any change defined as an architecture-level change requires a formal **Request for Comments (RFC)** document submitted before implementation.
* An RFC in the **Draft** or **Proposed** state does not permit any coding or database modifications.
* Implementation is only permitted once the RFC has been explicitly marked as **Accepted** by the project owner.

---

## 4. Decision Owner
The project business owner (Maison Vie CEO/Product Director) holds the final decision authority on all business-impacting architecture changes.
* RFC approval must come from the project owner before implementation begins.
* Systems architects and junior software engineers may propose technical RFCs but cannot self-approve implementations.

---

## 5. Implementation Gate
No task or feature ticket may implement structural schema or runtime tenancy changes unless the task description references a signed and **Accepted** RFC.
* Any task that attempts to implement code for a Proposed RFC must halt execution, log a governance blocker, and report the status.

---

## 6. Protected Current System Modules
The following core modules are protected and must not be modified or broken by proposed changes:
* **MVOS Studio Foundation**
* **Reservation Foundation & Workflow**
* **Email Foundation & Draft Workflow**
* **CEO Dashboard Foundation**
* **Continuous Learning Foundation**

---

## 7. Language Policy
* **Frontend UI**: Strictly Vietnamese (`vi.ts` mapping).
* **Codebase, Database, and API**: Strictly English naming conventions, parameters, and comments.
* **Technical Documentation**: Bilingual (English for architectural specifications, Vietnamese for operational guidelines).

---

## 8. Validation Rules
All implementation tasks must run the available validation pipelines before committing:
* `npm run lint` (ESLint checks)
* `npm run typecheck` (TypeScript checks)
* `npm run build` (Next.js production build compiler)
* `npm test` (Unit/integration testing suites, if available)

If a validation command is unavailable, it must be documented as such in the task log.

---

## 9. Scope Control
Technical tasks must adhere strictly to the scope of their assigned ticket. If additional architecture requirements are discovered during implementation, the engineer must create a new RFC proposal instead of silently expanding task scope.
