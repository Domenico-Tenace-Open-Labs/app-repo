# 6. Authentication

> From: section 6 of the original App Repo spec.

The flow changes radically compared to the "direct client" version: now the client authenticates with Firebase on the client side **only to obtain an ID token**, which it then exchanges with the server to obtain an **httpOnly session cookie**. From that point on, every subsequent request uses the cookie, not the client Firebase SDK.

## Why this double step

Firebase Authentication still requires an initial credential exchange (email/password or Google popup) that happens via the client SDK, because Firebase handles the cryptographic side of login. But once the ID token is obtained, the client sends it **only once** to the server, which verifies it with the Admin SDK and creates a long-lived session cookie. From then on, the client no longer touches the Firebase SDK: it works only with the cookie, exactly as it would with any traditional session system.

## `server/utils/firebaseAdmin.ts`

```ts
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })

export const adminAuth = getAuth(app)
export const adminDb = getFirestore(app)
```

## `server/api/auth/login.post.ts`

```ts
import { adminAuth } from '../../utils/firebaseAdmin'

export default defineEventHandler(async (event) => {
  const { idToken } = await readBody(event)

  // Verify the ID token obtained from the client via the Firebase SDK
  const decoded = await adminAuth.verifyIdToken(idToken)

  // Create a long-lived session cookie (e.g. 2 weeks)
  const expiresIn = 14 * 24 * 60 * 60 * 1000
  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })

  setCookie(event, 'session', sessionCookie, {
    maxAge: expiresIn / 1000,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  })

  return { uid: decoded.uid }
})
```

## `server/middleware/session.ts`

```ts
import { adminAuth } from '../utils/firebaseAdmin'

export default defineEventHandler(async (event) => {
  const sessionCookie = getCookie(event, 'session')
  if (!sessionCookie) return

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie)
    event.context.user = { uid: decoded.uid, email: decoded.email }
  } catch {
    // Invalid or expired cookie: the user remains unauthenticated;
    // individual endpoints decide if that is enough to reject the request
  }
})
```

## Client composable `app/composables/useApi.ts` (Firebase client side, login only)

```ts
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

export const loginWithCredentials = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(getAuth(), email, password)
  const idToken = await cred.user.getIdToken()
  return $fetch('/api/auth/login', { method: 'POST', body: { idToken } })
}

export const loginWithGoogle = async () => {
  const cred = await signInWithPopup(getAuth(), new GoogleAuthProvider())
  const idToken = await cred.user.getIdToken()
  return $fetch('/api/auth/login', { method: 'POST', body: { idToken } })
}
```

This is the only place in the frontend where the client Firebase SDK is still used, and only for login itself: no direct reads or writes to Firestore from the browser.

## Client middleware (`app/middleware/auth.ts`)

```ts
export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()
  if (!authStore.user) {
    return navigateTo('/auth/login')
  }
})
```

## Environment variables

```txt
# Client side (initial login via Firebase SDK)
NUXT_PUBLIC_FIREBASE_API_KEY=...
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NUXT_PUBLIC_FIREBASE_PROJECT_ID=...

# Server side (Admin SDK, never expose to the client)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

The `NUXT_PUBLIC_*` variables are public by nature; the other three must be treated as secrets (hosting provider environment variables, never committed).