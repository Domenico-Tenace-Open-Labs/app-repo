# 12. Deployment

> From: section 12 of the original App Repo spec.

## Production environment

```txt
Nuxt hosting with SSR support (Vercel, Netlify, or a custom Node.js node)
  └── server/api/* runs as serverless functions or as a persistent Node process
        └── Admin SDK → Firebase Authentication + Cloud Firestore
```

Unlike the "direct client" version, Firebase Hosting is no longer the most natural choice for the frontend, because the heart of the app is the Nuxt server with its API routes, not a static site. Vercel or Netlify, which support Nitro natively, remain the most direct options.

## Environment variables in production

The Admin SDK credentials (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) must be configured as secret environment variables on the hosting platform, never exposed to the client bundle.

## `package.json` scripts

```json
{
  "scripts": {
    "dev":       "nuxt dev",
    "build":     "nuxt build",
    "preview":   "nuxt preview",
    "typecheck": "nuxt typecheck",
    "lint":      "eslint .",
    "test":      "vitest"
  }
}
```