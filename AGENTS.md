# Repository Guidelines

## Project Overview

Aswellle Portfolio — a bilingual (Chinese/English) personal portfolio site built as a static Astro 4 site with selectively hydrated React islands. Deployed to Cloudflare Pages with edge-cached GitHub API proxies. Features a public-facing static site and an isolated admin SPA for managing contact form submissions via Supabase.

- **Live domain**: Configured via `site` in `astro.config.mjs`
- **Cloudflare project**: `aswellle-portfolio`

---

## Architecture & Data Flow

### Dual-App Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Cloudflare Pages                        │
│  ┌──────────────────┐    ┌────────────────────────────┐ │
│  │  Public Site      │    │  Admin SPA (/admin)        │ │
│  │  (static, zh-CN)  │    │  (React, auth-gated)       │ │
│  │                    │    │                            │ │
│  │  - Nav             │    │  - LoginForm               │ │
│  │  - Hero            │    │  - Dashboard               │ │
│  │  - ProjectsSection │    │  - MessagesPanel           │ │
│  │  - About           │    │                            │ │
│  │  - Contact         │    └──────────┬─────────────────┘ │
│  │  - Footer          │               │                   │
│  └────────┬───────────┘               │                   │
│           │                           │                   │
│  ┌────────▼───────────────────────────▼─────────────────┐ │
│  │  Cloudflare Pages Functions (Edge)                    │ │
│  │  - /api/stars/:owner/:repo  → GitHub stars proxy     │ │
│  │  - /api/profile             → GitHub repo count      │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Supabase (Postgres)  │
              │  - contacts table     │
              │  - auth (admin)       │
              │  - realtime           │
              └───────────────────────┘
```

### Data Flow

1. **Public site**: Static Astro components → GitHub API proxies (edge-cached) for live star counts
2. **Contact form**: `ContactForm.tsx` → Supabase anon insert (with `persistSession: false` to avoid auth collision)
3. **Admin**: `AdminApp.tsx` → Supabase auth → `MessagesPanel.tsx` subscribes to Realtime `postgres_changes` for live contact management

---

## Key Directories

| Path | Purpose |
|------|---------|
| `src/components/` | Public-facing Astro components + React islands |
| `src/components/admin/` | Admin SPA React components (AdminApp, Dashboard, LoginForm, MessagesPanel) |
| `src/data/projects.ts` | Single source of truth for project data (`Project` interface + `projects` array) |
| `src/pages/` | Astro page routes (`/` and `/admin/`) |
| `src/layouts/` | Layout templates (Layout.astro) |
| `src/styles/` | Global CSS with theme tokens and animations |
| `functions/api/` | Cloudflare Pages Functions (GitHub API proxies) |
| `supabase/migrations/` | Database schema migrations |
| `design-system/` | Documentation-only design system (gitignored, local tooling) |
| `public/` | Static assets (favicon) |

---

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Build for production → dist/
npm run build

# Preview production build locally
npm run preview

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name aswellle-portfolio
```

> **Note**: No test, lint, or typecheck scripts are defined. `npm run build` is the primary validation command.

---

## Code Conventions & Common Patterns

### Component Patterns

- **Astro components** (`.astro`): Default-exported, use `Astro.props` with destructuring. Props defined via `export interface Props`.
- **React islands** (`.tsx`): Default-exported, receive `supabase: SupabaseClient` prop for admin components.
- **Client directives**: Use `client:load` for React islands that need immediate hydration.

```typescript
// Astro component props pattern
export interface Props {
  project: Project;
  index?: number;
}

const { project, index } = Astro.props;
```

```tsx
// React island props pattern (admin)
export default function MessagesPanel({ supabase }: { supabase: SupabaseClient }) { ... }
```

### Naming Conventions

- **Components**: PascalCase files (`ProjectCard.astro`, `ContactForm.tsx`)
- **Data files**: camelCase (`projects.ts`)
- **Types**: PascalCase interfaces (`Project`, `Badge`, `Contact`)
- **CSS classes**: Tailwind utilities + custom `.bento-card`, `.gradient-text`, `.reveal`

### State Management

- **Admin auth**: Module-level Supabase client in `AdminApp.tsx`, auth state machine (`'checking' | 'out' | 'in'`)
- **Contact form**: Local `useState`, isolated Supabase client with `persistSession: false`
- **Realtime**: `MessagesPanel.tsx` subscribes to `postgres_changes` on `contacts` table

### Error Handling

- **API proxies**: Cache API with TTL, retry logic on frontend
- **Contact form**: 2-attempt retry on insert failure
- **Admin auth**: Loading/error states in `LoginForm.tsx`

### Styling

- **Source of truth**: `tailwind.config.mjs` defines the shipped light theme (NOT the design-system docs)
- **CSS variables**: Defined in `src/styles/global.css` (`--accent: #2563EB`)
- **Mobile a11y**: Safe-area insets, 16px input font-size, `reduced-motion` support in `global.css`
- **Prefer Tailwind tokens** over ad-hoc color values

---

## Important Files

| File | Purpose |
|------|---------|
| `src/pages/index.astro` | Home route — composes all public sections |
| `src/pages/admin/index.astro` | Admin route — full HTML doc with `noindex,nofollow`, inline `<style is:global>` |
| `src/components/admin/AdminApp.tsx` | Admin root — auth state machine, session gating |
| `src/data/projects.ts` | Project data single source of truth |
| `src/layouts/Layout.astro` | Base layout template |
| `astro.config.mjs` | Astro config — integrations, adapter, site URL |
| `tailwind.config.mjs` | Design tokens — colors, fonts, shadows, animations |
| `functions/api/stars/[owner]/[repo].ts` | GitHub stars proxy (1h cache) |
| `functions/api/profile.ts` | GitHub repo count proxy (6h cache) |
| `supabase/migrations/001_contacts.sql` | Contacts table schema + RLS |
| `supabase/migrations/002_admin_setup.sql` | Admin columns + auth policies |

---

## Runtime/Tooling Preferences

| Aspect | Choice |
|--------|--------|
| **Runtime** | Node.js (Astro build) + Cloudflare Pages Functions (edge) |
| **Package manager** | npm |
| **Framework** | Astro 4 with React integration |
| **Styling** | Tailwind CSS v4 |
| **Backend** | Supabase (Postgres + Auth + Realtime) |
| **Deployment** | Cloudflare Pages via Wrangler CLI |
| **Path alias** | `@/*` → `src/*` (configured in `tsconfig.json`) |
| **TypeScript** | Strict mode (extends `astro/tsconfigs/strict`) |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `PUBLIC_SUPABASE_URL` | Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

---

## Testing & QA

- **No test framework configured** — `npm run build` is the primary validation
- **Manual QA checklist**:
  - Public site renders in zh-CN
  - GitHub star counts load via `/api/stars` proxy
  - Contact form submits successfully
  - Admin login/logout flow works
  - MessagesPanel receives realtime updates
  - Mobile responsive (safe-area, touch targets)
  - `prefers-reduced-motion` respected

---

## Architecture Decisions & Gotchas

1. **`persistSession: false`** in `ContactForm.tsx` is load-bearing — prevents auth collision with admin SPA
2. **Admin layout** requires inline `<style is:global>` in `admin/index.astro` (flex column, 100vh)
3. **Design-system docs** (`design-system/aswellle-portfolio/MASTER.md`) describe an aspirational dark theme that does NOT match the shipped light theme — `tailwind.config.mjs` is the source of truth
4. **No `wrangler.toml`** — deployment uses `--project-name` flag
5. **Realtime publication** for `contacts` table must be set up manually in Supabase dashboard (not in migrations)
