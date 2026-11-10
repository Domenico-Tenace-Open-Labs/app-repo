# 2. Tech Stack

> From: section 2 of the original App Repo spec.

## Frontend

| Technology | Purpose |
| --- | --- |
| Nuxt 4 | Main framework (SSR/CSR), new `app/` structure |
| TypeScript | Static typing, with the context separation introduced in Nuxt 4 (client/server/shared) |
| Pinia | State management |
| Vuetify | Styling + components |
| Zod | Form validation |
| Vitest | Automated tests |

## Backend / infrastructure

| Service | Purpose |
| --- | --- |
| Nuxt server (Nitro) | Application layer: receives requests from the frontend, applies business and authorization checks, talks to Firebase via the Admin SDK |
| Firebase Authentication | Email/password and Google OAuth login (verified server-side with the Admin SDK) |
| Cloud Firestore | NoSQL database for users, tools, stars |
| Firebase Storage | User avatar storage (optional) |

There are no more Cloud Functions: the logic that previously lived there (e.g. updating the star counter) now lives in the Nuxt server endpoints, in the same language and in the same repository as the rest of the backend.

> Note: the UI library actually configured in this repo is Vuetify (see `nuxt.config.ts`). Some later prose in the original spec mentions Tailwind for `ToolCard`; trust the code, not that prose.