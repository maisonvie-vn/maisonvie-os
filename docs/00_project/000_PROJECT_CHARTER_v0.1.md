# 🏛️ MVOS Project Charter (v0.1)

## 1. Executive Summary
The **Maison Vie Operating System (MVOS)** is an integrated management platform and autonomous automation framework designed to run all departments of the Maison Vie French Neoclassical Villa and Restaurant. 

By unifying guest customer relationship management (CRM), table reservations, kitchen service lines, automated Deno Edge Functions, and standard operating procedures (SOP), MVOS establishes a premium, coordinated standard for high-end luxury hospitality operations.

---

## 2. Strategic Objectives
- **Operational Standardization**: Automate FOH (Front of House) checklists, dining ambient regulations (music, temperature, lighting), and reservations routing.
- **AI Agent Automation**: Deploy background agents to validate service rules, check CRM guest details, and notify Sommeliers/Chefs of VIP seating.
- **Privacy & Security**: Enforce rigid data security through PostgreSQL Row Level Security (RLS) on all patient and customer records.

---

## 3. Technology Stack Overview
- **Frontend App**: Next.js 15 (App Router), React 19, TypeScript
- **Ambiance Design**: Tailwind CSS v4, custom neoclassical variables, Google serif fonts
- **Data & Auth**: Supabase JS (Auth, Storage, PostgreSQL)
- **Deployment Pipeline**: Local-First -> GitHub Git -> Vercel Production
