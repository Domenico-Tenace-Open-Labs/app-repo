# AGENTS.md

## What this is

Nuxt 4 web app (`app/` dir layout) — "Tool Sharing Platform": users register, share/rate dev tools, bookmark favorites. **Scaffolding-stage**: only `app/layouts/default.vue` + `app/pages/index.vue` exist; most app yet to build.

**Authoritative target design** in **`docs/`** (see `docs/README.md` index — full tech spec, originally Notion page "📦 App Repo"). Read before building features — it's roadmap. Architectural bedrock, verify before diverging:

- **Client never talks to Firestore directly.** All reads/writes through Nitro `server/api/*` routes via **Firebase Admin SDK** (`firebase-admin`). Business logic + authorization on server, not Security Rules.
- Auth: client Firebase Auth (email/password + Google) only to mint ID token → server swaps for **httpOnly session cookie** → later requests use cookie. Server stateless.
- Shared Zod schemas in `shared/schemas/` validate client (form UX) + server (real authority). Server returns plain HTTP codes (400/401/403/404/409/500); `useApi` maps errors centrally.
- Env prod: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (server-only, never client bundle).
- Target pages: `/`, `/tools/:id`, `/tools/new`, `/tools/:id/edit`, `/auth/{login,register}`, `/me/{tools,bookmarks}`; Pinia stores `app/stores/{auth,tools}.ts`.

Note: spec later mentions Tailwind for `ToolCard`, but actual UI lib is **Vuetify** — trust code (`nuxt.config.ts`), not prose.

## Commands (pnpm only — never npm; commit `27220d9` moved off npm)

- `pnpm dev` — dev server
- `pnpm build` — `nuxt build` (SSR production build → `.output/`)
- `pnpm generate` — `nuxt generate` (static export to `.output/public/`)
- `pnpm preview` — serve build locally
- `postinstall` runs `nuxt prepare` (run manually after adding deps).

**No `lint`, `typecheck`, or `test` script wired** despite `vitest` devDependency. Without adding: typecheck via `pnpm nuxt typecheck` (generated `tsconfig.json` references `.nuxt/*.tsconfig` — plain `tsc` won't work). Add `lint`/`test` scripts yourself; don't assume they exist.

## Stack & conventions (all set in `nuxt.config.ts` — not per-file)

- **Vuetify** via `vuetify-nuxt-module`. Custom light/dark themes + **global component defaults** (`VBtn`, `VSelect`, `VChip`, `VTextField`, `VCard`) centralized in `nuxt.config.ts`. Primary color `#fa892d`. Extend styles there; don't scatter overrides in components.
- **Pinia**: `defineStore` auto-imported via `imports.presets` (no manual import). Prefer Pinia stores over `useState` for shared data.
- **PWA** (`@vite-pwa/nuxt`): `registerType: "autoUpdate"`, `devOptions.enabled: true`, `navigateFallback: "/pages/index.vue"` (source-path oddity; leave unless PWA work). Icons in `public/`.

## Structure & gotchas

- Generated dirs `.nuxt/`, `.output/`, `node_modules/` gitignored. **`dist` gitignored symlink to `.output/public`** — don't create real `dist/`; point deploy/output tooling at `.output/public`.
- `public/` holds PWA icons, `logo.svg`, `robots.txt`. `.github/` only FUNDING.yml + issue templates — no CI workflows.
- `pnpm-workspace.yaml` leftover placeholder `allowBuilds: esbuild: set this to true or false` — **not** valid pnpm key (pnpm uses `onlyBuiltDependencies`), ignore. pnpm 10 may block postinstall build scripts (e.g. esbuild) during install.
- No `.env` committed; only `FIREBASE_*` secrets needed for backend work.
- Git: branch `master`, small conventional-ish commits (e.g. `feat - [FE] ...`, `fix:`, `[DEV] ...`).