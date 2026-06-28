# 📖 Maison Vie OS Documentation

Welcome to the documentation folder for the Maison Vie Operating System (maisonvie-os).

## Structure
- `/app`: App router pages (`/`, `/dashboard`, `/docs`, `/sop`, `/admin`)
- `/components`: Reusable UI components
- `/lib`: Helper libraries and services (e.g. Supabase client)
- `/database`: Database schemas, migrations, and seed scripts
- `/prompts`: LLM prompts used by the system agents
- `/workflows`: Automated workflow configurations and orchestration files
- `/agents`: Autonomous agents definitions and scripts

## Getting Started
1. Copy `.env.example` to `.env.local`
2. Fill in the Supabase URL and Anon key
3. Run the development server with `npm run dev`
