# 🏛️ MVOS Rule Engine Specifications (004)

## 1. Declarative Business Rules
Operational limits, villa ambient standards, and seating criteria are declared as JSON payloads inside the `business_rules` table:

```json
{
  "rule_id": "ambient_temp_check",
  "conditions": {
    "target_room": "Salon Privé",
    "target_temp_celsius": 22.0
  },
  "constraints": {
    "min_allowed": 21.0,
    "max_allowed": 23.5
  }
}
```

## 2. Execution Triggers
- **Sensor Sync**: Local operational scripts push ambient telemetry data.
- **Evaluation Loop**: The AI Agent compares telemetry inputs against constraints inside `business_rules`.
- **Escalation**: If a boundary is violated, an entry is added to `audit_logs` and an edge routine triggers notifications to the FOH Operations Lead.
