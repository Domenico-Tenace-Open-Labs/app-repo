# App Repo — Technical Documentation

Documentation set for **App Repo**, a *Tool Sharing Platform* built with **Nuxt 4** (SSR/CSR) and the **`app/`** directory convention. This is the technical design / roadmap; the codebase is currently at scaffolding stage and this doc defines the target architecture.

> Originally the single Notion page "📦 App Repo" (under `Progetti / Elenco Progetti`); now split into topic files. **Status: "In phase of refactoring".**

## Documents

| File | Covers |
| --- | --- |
| [overview.md](overview.md) | Project purpose, main features, user roles |
| [tech-stack.md](tech-stack.md) | Frontend + backend/infrastructure technologies |
| [architecture.md](architecture.md) | Server-centric architecture, why it changed, what is lost |
| [project-structure.md](project-structure.md) | `app/`, `server/`, `shared/` directory layout |
| [data-model.md](data-model.md) | Firestore collections: `users`, `tools`, `stars` |
| [authentication.md](authentication.md) | ID-token → httpOnly session-cookie flow, Admin SDK, env vars |
| [api-server.md](api-server.md) | Nitro `server/api/*` endpoints, conventions, transactions |
| [firestore-security.md](firestore-security.md) | Cloud Firestore Security Rules approach |
| [main-flows.md](main-flows.md) | Primary end-to-end flows (register, login, CRUD, star, bookmarks) |
| [components-and-stores.md](components-and-stores.md) | Pages, Pinia stores, key components |
| [validation-and-errors.md](validation-and-errors.md) | Shared Zod schemas, HTTP error codes, client error handling |
| [deployment.md](deployment.md) | Production hosting, env secrets, `package.json` scripts |
| [non-functional-requirements.md](non-functional-requirements.md) | Performance, security, cost, scalability |

## Recommended reading order

Start with [overview.md](overview.md) → [architecture.md](architecture.md) → [project-structure.md](project-structure.md), then dig into the rest as needed.

---

## Quick reference

- **Framework:** Nuxt 4 (Nitro server), new `app/` structure
- **Language:** TypeScript (client / server / shared contexts)
- **State:** Pinia · **UI:** Vuetify · **Validation:** Zod · **Tests:** Vitest
- **Backend:** Nuxt server API → **Firebase Admin SDK** → Auth + Cloud Firestore (no Cloud Functions, no direct client DB access)
- **Auth:** Client Firebase SDK only to mint an ID token → server returns an **httpOnly session cookie** used for all further requests
- **Deploy target:** SSR-capable Node host (Vercel / Netlify), not Firebase Hosting