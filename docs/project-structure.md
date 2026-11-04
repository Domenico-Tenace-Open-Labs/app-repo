# 4. Project Structure

> From: section 4 of the original App Repo spec.

Structure adapted to the new `app/` organization introduced in Nuxt 4.

```txt
tool-sharing-platform/
├── app/
│   ├── components/
│   │   ├── ToolCard.vue
│   │   ├── ToolForm.vue
│   │   ├── ToolFilters.vue
│   │   ├── StarButton.vue
│   │   ├── LoginForm.vue
│   │   ├── RegisterForm.vue
│   │   └── AppHeader.vue
│   ├── pages/
│   │   ├── index.vue            # Tool list
│   │   ├── tools/
│   │   │   ├── [id].vue         # Tool detail
│   │   │   ├── new.vue          # Add tool
│   │   │   └── [id]/edit.vue    # Edit tool
│   │   ├── auth/
│   │   │   ├── login.vue
│   │   │   └── register.vue
│   │   └── me/
│   │       ├── tools.vue
│   │       └── bookmarks.vue
│   ├── stores/
│   │   ├── auth.ts              # Pinia: current user, session state
│   │   └── tools.ts             # Pinia: tool list, cache, filters
│   ├── composables/
│   │   └── useApi.ts            # $fetch wrapper with centralized error handling
│   └── middleware/
│       └── auth.ts              # Redirect if not authenticated
├── server/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register.post.ts
│   │   │   ├── login.post.ts
│   │   │   ├── google.post.ts
│   │   │   └── logout.post.ts
│   │   ├── tools/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   ├── [id].delete.ts
│   │   │   └── [id]/star.post.ts
│   │   └── me/
│   │       ├── tools.get.ts
│   │       └── bookmarks.get.ts
│   ├── middleware/
│   │   └── session.ts           # Verifies the session cookie on every request
│   └── utils/
│       ├── firebaseAdmin.ts     # Admin SDK initialization (singleton)
│       └── session.ts           # Create/verify Firebase session cookie
├── shared/
│   └── schemas/
│       └── tool.ts               # Zod schemas, importable from both app/ and server/
├── firestore.rules
├── firebase.json
├── nuxt.config.ts
└── .env
```

The `shared/` folder is an addition made more robust in Nuxt 4: the code inside is typed consistently whether imported from the client or the server, so Zod schemas written once truly work everywhere without type inconsistencies between the two contexts.