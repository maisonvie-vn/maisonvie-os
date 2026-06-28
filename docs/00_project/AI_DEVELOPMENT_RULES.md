# 🏛️ MVOS AI Development Rules

Autonomous AI agents and language models contributing code to the **Maison Vie Operating System (MVOS)** must strictly adhere to the following 10 commandments:

1. **Never redesign architecture.** Keep existing routing structures, client builders, and file configurations intact.
2. **Never rename business entities.** Keep names of tables, properties, departments, and roles consistent with master files.
3. **Never create new folders unless specified.** Only place files in the existing folders (`/app`, `/components`, `/lib`, `/database`, `/prompts`, `/workflows`, `/agents`, `/docs`).
4. **Never modify database without migration.** Always document DB updates inside a `.sql` schema file in `/database`.
5. **Never commit secrets.** Keep keys and credentials in `.env.local` only, documenting structures in `.env.example`.
6. **Never push directly to production.** Always push code to the repository `main` branch and let GitHub integration deploy it to Vercel.
7. **Never delete documents.** Retain standard operational guides, rules, and roadmaps without deleting history.
8. **Always update documentation.** Keep roadmaps, README files, and documentation pages current with implementation changes.
9. **Always explain commands before execution.** Prior to proposing or executing any shell command, document its function.
10. **Follow MVOS Specification only.** Implement exactly what is requested without adding unapproved packages or features.

---

## 🎨 Design System Ambiance Reference
All MVOS front-end components must implement the French Neoclassical layout parameters from [globals.css](file:///e:/maisonvie-os/app/globals.css):
- **Core Hex Codes**:
  - Background (Nền): `#102B2A` (deep forest green)
  - Cards/Panels (Phụ): `#042726` (dark forest green)
  - Text (Chữ): `#ffffff` (pure white text for high contrast readability)
  - Accents (Accent Brass): `#A8884E` (brass gold tone)
- **Typography**: Editorial header serif font (`Cormorant Garamond`) + functional clean sans-serif body text (`Inter`).
- **Styling Styles**: Use subtle borders (`.neo-border`) and glassmorphic blur frames (`.glass-panel`) for dashboard panels.

---

## 🛠️ Mandatory Verification Loop
Before proposing a commit or finalizing a task:
1. **Verification Build**: Run Next.js production builds to verify zero compilation errors:
   ```bash
   npm run build
   ```
2. **Check Tracking Status**: Inspect untracked or modified files:
   ```bash
   git status
   ```
