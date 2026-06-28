# RFC Status Guide

This document defines the lifecycle states of Request for Comments (RFCs) within the Maison Vie Operating System (MVOS) development lifecycle.

---

## 📋 Lifecycle States

### 1. Draft
* **Description**: The RFC is currently being written by a systems architect or engineer and is incomplete.
* **Implementation Rule**: **Strictly forbidden**. No coding or database modifications allowed.

### 2. Proposed
* **Description**: The RFC is finished, reviewed by peers, and submitted for official approval.
* **Implementation Rule**: **Strictly forbidden**. Coding and migrations are blocked.

### 3. Accepted
* **Description**: The project owner (Maison Vie CEO/Product Director) has reviewed the proposal and approved it.
* **Implementation Rule**: **Allowed**. Coding and database migrations may proceed in future scheduled tasks.

### 4. Rejected
* **Description**: The proposal does not fit the business roadmap or is technically unfeasible.
* **Implementation Rule**: **Strictly forbidden**. Closed permanently.

### 5. Superseded
* **Description**: The RFC has been replaced by a newer accepted design.
* **Implementation Rule**: **Strictly forbidden**. Developers must follow the replacing RFC.

---

## 🏷️ Rule Summary Table

| RFC Status | Implementation Allowed? | Next Allowed State |
| :--- | :--- | :--- |
| **Draft** | ❌ No | Proposed |
| **Proposed** | ❌ No | Accepted / Rejected |
| **Accepted** |  Yes | Superseded |
| **Rejected** | ❌ No | None |
| **Superseded** | ❌ No | None |
