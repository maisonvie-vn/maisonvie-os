# 🏛️ MVOS Workflow Engine Specifications (005)

## 1. Event Orchestration
Workflows orchestrate events across different components (e.g. FOH bookings to Sommelier prep and Chef plating):

```
[Guest Booking Event]
        │
        ▼ (Trigger)
[Workflow Engine] ──(Queries)──> [Supabase CRM Guest Profile]
        │
        ├──(If VIP)──> [Notify Sommelier for Champagne selection]
        └──(If Allergy)──> [Alert Chef Joel for Menu Adjustments]
```

## 2. Notification Dispatch Channels
- **Edge Routines**: Supabase Edge Functions trigger external integrations (e.g., mail sending, Slack warnings).
- **Fallback Queue**: If an API dispatch fails, the event is saved to local storage or `audit_logs` for subsequent retries.
