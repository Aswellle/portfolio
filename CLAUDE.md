# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This repository uses npm (`package-lock.json`).

```bash
npm install          # Install dependencies
npm run dev          # Start Astro development server
npm run build        # Produce the static site in dist/
npm run preview      # Serve the production build locally
```

There are currently no dedicated test, lint, or standalone type-check scripts. `npm run build` is the available validation command for application changes.

## Architecture

This is a static Astro 4 portfolio site (`output: 'static'`) with Tailwind CSS and selectively hydrated React components. Two independent app shells share the same Astro project:

1. **Public site** — fully static, one-page, `zh-CN`.
2. **Admin dashboard** (`/admin`) — client-rendered React SPA gated by Supabase Auth, deliberately isolated from the public shell.

### Public site

- `src/pages/index.astro` composes the one-page site from Astro section components (`Nav`, `Hero`, `About`, `ProjectsSection`, `Contact`, `Footer`), all rendered inside `src/layouts/Layout.astro`.
- `src/layouts/Layout.astro` imports `src/styles/global.css`, sets document metadata/OG tags, renders the shared `ScrollToTop.astro` component, and wires up an `IntersectionObserver` that toggles the `.reveal` → `.visible` scroll-in animation. Any public page should use this layout unless it needs a different document shell (see admin below).
- `src/components/` holds mostly server-rendered `.astro` sections. The only hydrated exception on the public site is `Contact.astro`, which mounts `ContactForm.tsx` with `client:load`. `ContactForm.tsx` builds its own Supabase client at submission time with `auth: { persistSession: false }` and inserts into `public.contacts`. The `persistSession: false` flag is load-bearing: supabase-js derives the localStorage auth key from the project URL alone, so a client that shares storage with `AdminApp` would pick up any `/admin` login session and the anon-only insert policy would then reject the submission with 403. Do not "simplify" this by reusing `AdminApp`'s exported client or dropping the flag — it is what keeps an admin login from silently breaking the public contact form.
- `src/data/projects.ts` is the single source of truth for portfolio project cards (`Project[]`) — `ProjectsSection.astro` maps that data through `ProjectCard.astro`. Add new projects here rather than editing the section markup.
- Live GitHub data (star counts on cards, "查看全部 N 个仓库" count) is served by Cloudflare **Pages Functions** in `functions/`: `api/stars/[owner]/[repo].ts` and `api/profile.ts` proxy the GitHub API same-origin with Cache API caching. The browser hits `/api/*` on the site's own CDN (fast for domestic visitors) and the Cloudflare edge makes the upstream GitHub call — this chain is deliberate because direct `api.github.com` requests from Chinese residential networks are slow/unreliable. `project.stars` and the hardcoded repo count remain as static fallbacks; the client script in `ProjectsSection.astro` silently keeps them if the API is unreachable. These functions use the same-origin fallback pattern and are bundled automatically by `wrangler pages deploy`.

### Admin dashboard

- `src/pages/admin/index.astro` intentionally does **not** use `Layout.astro`. It defines its own minimal HTML shell, sets `noindex, nofollow`, and mounts `AdminApp.tsx` with `client:load` as the sole entry point.
- `src/components/admin/AdminApp.tsx` creates the one browser Supabase client for the whole admin app (exported as `supabase` for reuse), owns auth session state (`checking` / `out` / `in` via `supabase.auth.getSession()` + `onAuthStateChange`), and switches between `LoginForm.tsx` and `Dashboard.tsx`. There is no route-based auth guard — access control is this state machine plus RLS policies on the backend.
- `Dashboard.tsx` renders the admin chrome (header, sidebar) and passes the shared Supabase client down to `MessagesPanel.tsx`, which lists/filters (`all` / `unread` / `starred`)/marks-read/stars/deletes contact submissions and subscribes to Postgres realtime changes on `public.contacts` (channel `admin-contacts`). It has a responsive list/detail split: single-pane with a back button on mobile (`mobileView` state), two-pane on `md+`.
- All height/flex layout for the admin UI (`.admin-root`, `.admin-body`, `.msg-panel`, `.msg-list`, `.msg-detail`, etc.) lives in a global `<style is:global>` block in `src/pages/admin/index.astro`, not in Tailwind classes on the React components. Astro scopes `<style>` blocks by rewriting selectors to `[data-astro-cid-*]`, but that attribute is only applied to elements Astro renders server-side — never to DOM nodes created inside the `client:load` React island — so scoped styles silently never match. The mount point is `astro-island`, which defaults to `display: inline` and breaks the height chain unless overridden. When changing the admin layout's structure, edit this global style block (and keep it global), not per-component Tailwind classes.

## Styling

- Tailwind scans `src/**/*.{astro,html,js,jsx,ts,tsx}`. Shared color tokens (`bg`, `accent`, `border`, `text`), breakpoints (including a custom `xs: 400px`), typography, shadows, and animations are defined in `tailwind.config.mjs` — prefer these tokens (`text-text-muted`, `shadow-card`, etc.) over ad hoc Tailwind colors when styling public-site components.
- `src/styles/global.css` contains the base theme and reusable visual classes such as `.bento-card`, `.reveal`/`.stagger-*`, `.gradient-text`, and `.tech-tag`, plus a block of mobile-specific rules: tap-highlight/touch-action resets, `env(safe-area-inset-*)` handling for notches/home bars, hidden scrollbars on touch, a `prefers-reduced-motion` override, and a forced 16px input font-size on touch devices to prevent iOS Safari auto-zoom. Preserve these interaction and accessibility rules when adjusting the UI — they were added deliberately for mobile parity, not incidentally.
- The admin dashboard is styled independently with inline Tailwind zinc/blue/violet utility classes and does not pull from the public site's `bg`/`accent`/`text` design tokens; keep that separation when touching admin components.
- `design-system/aswellle-portfolio/MASTER.md` documents the intended design tokens (palette, type, spacing) for the public site at a project level. If `design-system/pages/[page-name].md` exists for a given page it overrides the Master file — check there first before restyling a page. Note this file currently describes a dark palette that does not match the light palette actually implemented in `tailwind.config.mjs`/`global.css`; treat the shipped Tailwind config as the source of truth for existing components, and flag the mismatch to the user rather than silently reconciling it. `design-system/` is gitignored (local tooling only), so it won't exist in a fresh clone.

## Supabase

- The browser client reads `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`; copy `.env.example` to `.env` and set both values for contact and admin functionality. These are public client configuration values—do not use service-role credentials in frontend code.
- The contact form inserts into `public.contacts`. `supabase/migrations/001_contacts.sql` creates the table, applies validation constraints, enables RLS, grants required Data API permissions, and allows anonymous inserts while restricting reads to authenticated users.
- `supabase/migrations/002_admin_setup.sql` adds message-management fields and authenticated update/delete policies. Apply migrations in numeric order. Realtime delivery additionally requires adding `contacts` to the `supabase_realtime` publication as described in that migration.

## Deployment

- The site deploys to Cloudflare Pages under the project name `aswellle-portfolio`. Build with `npm run build` (outputs `dist/`), then deploy with `wrangler pages deploy dist --project-name aswellle-portfolio`. Use the `wrangler` CLI for Pages and the `gh` CLI for GitHub operations. The `functions/` directory (Pages Functions) is bundled into the same deployment automatically — no separate worker deploy step. Locally you can preview them with `npx wrangler pages dev dist`.

## Configuration

- `astro.config.mjs` defines the production site URL, emits assets under `_assets`, and enables the React and Tailwind integrations.
- TypeScript uses Astro strict settings and the `@/*` alias for `src/*`.
