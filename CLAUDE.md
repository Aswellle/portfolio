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

This is a static Astro 4 portfolio site (`output: 'static'`) with Tailwind CSS and selectively hydrated React components.

- `src/pages/index.astro` composes the public one-page site from Astro section components inside `src/layouts/Layout.astro`.
- `src/layouts/Layout.astro` imports `src/styles/global.css`, establishes document metadata, renders the shared `ScrollToTop` component, and initializes intersection-observer reveal animations. Public pages should use this layout unless they need a different document shell.
- `src/components/` contains mostly server-rendered Astro sections. `src/components/Contact.astro` mounts `ContactForm.tsx` with `client:load`; `ContactForm.tsx` creates its browser Supabase client at submission time and inserts public contact messages.
- `src/data/projects.ts` is the single source of truth for portfolio project cards. `ProjectsSection.astro` maps that data through `ProjectCard.astro`.
- `src/pages/admin/index.astro` deliberately has its own HTML shell, excludes itself from search indexing, imports global Tailwind styles directly, and mounts the client-side React admin application.
- `src/components/admin/AdminApp.tsx` creates the browser Supabase client, owns session state, and switches between `LoginForm.tsx` and `Dashboard.tsx`. The dashboard passes that client to `MessagesPanel.tsx`, which lists, filters, updates, deletes, and subscribes to realtime changes on contact submissions.

## Styling

- Tailwind scans `src/**/*.{astro,html,js,jsx,ts,tsx}`. Shared color tokens, breakpoints, typography, shadows, and animations are defined in `tailwind.config.mjs`.
- `src/styles/global.css` contains the base theme and reusable visual classes such as `.bento-card`, `.reveal`, and `.tech-tag`, plus mobile, reduced-motion, and iOS input-size behavior. Preserve these interaction and accessibility rules when adjusting the UI.

## Supabase

- The browser client reads `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`; copy `.env.example` to `.env` and set both values for contact and admin functionality. These are public client configuration values—do not use service-role credentials in frontend code.
- The contact form inserts into `public.contacts`. `supabase/migrations/001_contacts.sql` creates the table, applies validation constraints, enables RLS, grants required Data API permissions, and allows anonymous inserts while restricting reads to authenticated users.
- `supabase/migrations/002_admin_setup.sql` adds message-management fields and authenticated update/delete policies. Apply migrations in numeric order. Realtime delivery additionally requires adding `contacts` to the `supabase_realtime` publication as described in that migration.

## Configuration

- `astro.config.mjs` defines the production site URL, emits assets under `_assets`, and enables the React and Tailwind integrations.
- TypeScript uses Astro strict settings and the `@/*` alias for `src/*`.
