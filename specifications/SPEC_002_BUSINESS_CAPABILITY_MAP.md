# SPEC_002: MVOS Business Capability Map Specification

## 1. Executive Summary
The **Maison Vie Business Capability Map** defines the structural capabilities necessary to operate the Maison Vie French neoclassical villa and fine dining restaurant. This model outlines the "what" the business does rather than the "how" or "who", creating an objective reference map for architecture, technical development, and agent automations.

---

## 2. Capability Levels

- **Level 0 (Maison Vie Enterprise)**: The entire neoclassical fine dining and luxury hospitality operation.
- **Level 1 (Core Domains)**: Major business segments (e.g. Guest & Reservation, FOH Service, Kitchen, Inventory).
- **Level 2 (Business Capabilities)**: Specific business assets/skills (e.g. VIP seating allocation, recipe scaling, VAT log reconciliation).
- **Level 3 (Operational Processes)**: Executable standard operating procedures (e.g. welcoming a guest, conducting daily inventory audits).

---

## 3. Core Domains Architecture

### 3.1. Guest & Reservation
- **Purpose**: Manage guest profiles, dietary restrictions, and table reservation booking workflows.
- **Key Capabilities**: Reservation taking, guest profiling, dietary profiling, VIP prioritization.
- **Main Data Objects**: `reservations`, `guests`, `allergens`, `vip_preferences`.
- **Related Documents**: [SOP-01: VIP Guest Arrival & Reception](file:///e:/maisonvie-os/app/sop/page.tsx).
- **Future AI Agents**: `Reservation Router Agent` (autonomous booking parser and assigner).
- **KPIs**: Seating optimization rate (>95%), customer review score (>4.8/5).
- **Risks if not standardized**: Double bookings, unlogged severe allergies, VIP table allocation errors.

### 3.2. FOH Service
- **Purpose**: Manage front-of-house customer touchpoints, seating queues, and room environment control.
- **Key Capabilities**: Seating management, room temperature control, lighting management, acoustic control.
- **Main Data Objects**: `tables`, `dining_sections`, `ambient_logs`.
- **Related Documents**: [SOP-03: Ambient Controls & Neoclassical Standards](file:///e:/maisonvie-os/app/sop/page.tsx).
- **Future AI Agents**: `Ambient Guard Agent` (regulates room light and climate limits).
- **KPIs**: Service timing consistency, climate target compliance (22°C steady).
- **Risks if not standardized**: Poor room ambiance, service bottlenecks during peak hours.

### 3.3. Kitchen & Production
- **Purpose**: Coordinate preparation, cook execution, plating, and culinary quality control.
- **Key Capabilities**: Course timing coordination, plating verification, allergy routing.
- **Main Data Objects**: `orders`, `kitchen_tickets`, `cook_stations`.
- **Related Documents**: [SOP-02: Kitchen & Chef Coordination](file:///e:/maisonvie-os/app/sop/page.tsx).
- **Future AI Agents**: `Production Plating Assigner Agent` (monitors plating speed).
- **KPIs**: Ticket prep time consistency, zero cross-contamination occurrences.
- **Risks if not standardized**: Slow course service, preparation errors on allergy tables.

### 3.4. Menu & Recipe
- **Purpose**: Standardize tasting menus, ingredient compositions, and recipe adjustments.
- **Key Capabilities**: Menu revision, recipe costing, scaling ingredients.
- **Main Data Objects**: `menus`, `recipes`, `ingredients`.
- **Related Documents**: `SPEC_003_DEPARTMENT_ARCHITECTURE.md`.
- **Future AI Agents**: `Recipe Costing Optimizer Agent` (recalculates ingredient costs).
- **KPIs**: Menu margin accuracy, recipe adherence rate (100%).
- **Risks if not standardized**: Uncontrolled food cost variance, inconsistent recipe execution.

### 3.5. Inventory & Purchasing
- **Purpose**: Coordinate storage, ingredient tracking, purchase requisitions, and stock audits.
- **Key Capabilities**: Stock level auditing, automated low-stock warnings, vendor management.
- **Main Data Objects**: `inventory_items`, `purchase_orders`, `vendors`.
- **Related Documents**: `000_MASTER_DATA_PRINCIPLES.md`.
- **Future AI Agents**: `Auto-Purchasing Agent` (submits stock orders when thresholds drop).
- **KPIs**: Inventory variance rate (<0.5%), order fulfillment rate (100%).
- **Risks if not standardized**: Stockouts of critical ingredients, ingredient spoilage.

### 3.6. Accounting & VAT
- **Purpose**: Manage finance flows, VAT collection, daily reports, and billing systems.
- **Key Capabilities**: VAT ledger generation, daily cash reconciliation, expense logging.
- **Main Data Objects**: `invoices`, `transactions`, `tax_ledgers`.
- **Related Documents**: `000_PROJECT_CHARTER_v0.1.md`.
- **Future AI Agents**: `VAT Reconciliation Agent` (validates transactions against receipts).
- **KPIs**: Audit compliance rate (100%), cash reconciliation variance ($0.0).
- **Risks if not standardized**: Regulatory tax fines, missing billing audits.

### 3.7. HR & Training
- **Purpose**: Coordinates staff shifts, hiring checks, training checklists, and standard testing.
- **Key Capabilities**: Shift scheduling, training verification, compliance testing.
- **Main Data Objects**: `employees`, `shifts`, `training_records`.
- **Related Documents**: `000_SECURITY_AND_PERMISSION_MODEL.md`.
- **Future AI Agents**: `Shift Scheduler Agent` (resolves shift conflict).
- **KPIs**: Staff retention rate, SOP compliance test score average (>90%).
- **Risks if not standardized**: Understaffing, staff unaware of neoclassical service rules.

### 3.8. Marketing & CRM
- **Purpose**: Maintain long-term relationships with VIP customers, track preferences, and deploy promotions.
- **Key Capabilities**: VIP preferences tracking, marketing campaign dispatch, feedback collection.
- **Main Data Objects**: `customer_profiles`, `campaigns`, `feedback_entries`.
- **Related Documents**: `AI_DEVELOPMENT_RULES.md`.
- **Future AI Agents**: `CRM Router Agent` (analyzes feedback and sends custom emails).
- **KPIs**: Guest repeat rate (>40%), survey response rate.
- **Risks if not standardized**: Poor guest retention, untracked VIP customer preferences.

### 3.9. Quality & Compliance
- **Purpose**: Perform sanitization audits, health checks, and verify structural safety of neoclassical assets.
- **Key Capabilities**: Hygiene auditing, maintenance tracking, fire safety verification.
- **Main Data Objects**: `compliance_audits`, `maintenance_logs`, `checklists`.
- **Related Documents**: `001_mvos_foundation_schema.sql`.
- **Future AI Agents**: `Compliance Audit Agent` (scans logs for missed checks).
- **KPIs**: Government health rating (Grade A), compliance audit scores.
- **Risks if not standardized**: Food safety issues, building maintenance degradation.

### 3.10. Document & Knowledge
- **Purpose**: Maintain corporate documents, repository structures, and version controls.
- **Key Capabilities**: Versioning, category filtering, document review alerts.
- **Main Data Objects**: `documents`, `document_versions`, `sop_documents`.
- **Related Documents**: `001_MVOS_REPOSITORY_STRUCTURE.md`.
- **Future AI Agents**: `SOP Validator Agent` (verifies document metadata properties).
- **KPIs**: Review compliance rate (100%), document search latency.
- **Risks if not standardized**: Outdated procedures used by staff, lost technical diagrams.

### 3.11. AI & Automation
- **Purpose**: Monitor autonomous agent platform health, rule evaluations, and logs telemetry.
- **Key Capabilities**: Agent runtime health checks, JSON rule evaluations, alert routing.
- **Main Data Objects**: `ai_agents`, `business_rules`, `audit_logs`.
- **Related Documents**: `DEVELOPMENT_PROCESS.md`.
- **Future AI Agents**: `Agent Telemetry Watchdog` (restarts failed agents).
- **KPIs**: Agent uptime (>99.9%), alert validation latency.
- **Risks if not standardized**: Unmonitored agent crashes, failure to validate critical rules.

### 3.12. CEO & Governance
- **Purpose**: Track long-term business roadmap tasks, corporate strategies, and executive approvals.
- **Key Capabilities**: Strategic goal tracking, executive approval audits, budget mapping.
- **Main Data Objects**: `sprints`, `strategic_goals`, `approvals`.
- **Related Documents**: `SPRINT_0_1_FOUNDATION_TASKS.md`.
- **Future AI Agents**: `Maturity Model Evaluator Agent` (tracks roadmap compliance).
- **KPIs**: Strategic goals hit rate (>90%), sprint task completion rate.
- **Risks if not standardized**: Misalignment between systems development and business objectives.
