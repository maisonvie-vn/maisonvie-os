# 🤖 MVOS AI Development Rules

This rulebook defines the strict boundaries, architectural patterns, and execution constraints for autonomous AI agents and language models contributing code to the **Maison Vie Operating System (MVOS)**.

---

## 1. Safety & Data Lockdown (Zero Data Loss)
- **Production Restrictions**: AI agents are strictly forbidden from connecting to production Supabase database containers or production endpoints in local development modes.
- **No Destructive SQL**: Statements containing `DROP DATABASE`, `DROP SCHEMA`, `DROP TABLE`, or `TRUNCATE` are prohibited. Database schema upgrades must use `CREATE TABLE IF NOT EXISTS` with additive modifications only.
- **Secrets Protocol**: Never commit private variables, tokens, or `.env` files to git. Document variable requirements in `.env.example` and keep credentials inside `.env.local`.

---

## 2. Design System & Aesthetics (Neoclassical Dark)
Every interface rendered by MVOS must adhere to the French Neoclassical layout definitions in [globals.css](file:///e:/maisonvie-os/app/globals.css):
- **Core Hex Codes**:
  - Background (Nền): `#102B2A` (deep forest green)
  - Cards/Panels (Phụ): `#042726` (dark forest green)
  - Text (Chữ): `#ffffff` (pure white text for high contrast readability)
  - Accents (Accent Brass): `#A8884E` (brass gold tone)
- **Typography**: Editorial header serif font (`Cormorant Garamond`) + functional clean sans-serif body text (`Inter`).
- **Styling Styles**: Use subtle borders (`.neo-border`) and glassmorphic blur frames (`.glass-panel`) for dashboard panels.

---

## 3. Mandatory Verification Loop
Before proposing a commit or finalizing a task:
1. **TypeScript & Lint Validation**: Run local build checks to verify zero syntax, type, or styling issues:
   ```bash
   npm run build
   ```
2. **Git Tracking Status**: Check local changes before committing:
   ```bash
   git status
   ```

---

## 4. Deployment Pipeline
All deployments occur through integration pipelines:
- **GitHub is the Source of Truth**: All verified changes must be pushed to the `main` branch of `https://github.com/maisonvie-vn/maisonvie-os.git`.
- **Vercel Integration**: Production releases are triggered automatically when commits land on the `main` branch. Direct manual CLI production builds are restricted unless specifically instructed.
