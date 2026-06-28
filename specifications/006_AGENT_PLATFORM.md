# 🏛️ MVOS Agent Platform Specifications (006)

## 1. Autonomous Agent Directory
AI Agents are registered as operational nodes inside the `ai_agents` table.

### Agent Types
1. **Reservation Router**: Analyzes incoming bookings, flags VIP statuses, and assigns tables.
2. **SOP Validator**: Reviews logs to ensure that FOH and kitchen routines match standard operating procedures.
3. **Ambient Guard**: Monitors room temperature, lighting levels, and acoustic telemetry inputs.

## 2. Activity Telemetry
Each agent updates its status (`ACTIVE`, `INACTIVE`, `ERROR`) and writes logs containing:
- **`agent_id`**: Reference key of the active agent.
- **`timestamp`**: Time of execution.
- **`log_message`**: Text log of actions performed.
- **`payload`**: JSON execution payload details.
