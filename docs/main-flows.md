# 9. Main Flows

> From: section 9 of the original App Repo spec.

## 9.1 Registration

```txt
User fills in form (name, email, password)
  → Zod validates client-side
  → createUserWithEmailAndPassword (Firebase client SDK, only to get the ID token)
  → idToken obtained → POST /api/auth/register { idToken, name }
    → Server verifies idToken with Admin SDK
    → Server creates the users/{uid} document with Admin SDK
    → Server creates the session cookie
  → Pinia auth store updated with user data
  → Redirect to /
```

## 9.2 Google login

```txt
User clicks "Sign in with Google"
  → signInWithPopup (Firebase client SDK)
  → idToken obtained → POST /api/auth/login { idToken }
    → Server verifies idToken, creates/updates users/{uid} if first login
    → Server creates the session cookie
  → Redirect to /
```

## 9.3 Adding a tool

```txt
Authenticated user fills out the form on /tools/new
  → Zod validates client-side
  → POST /api/tools (the session cookie travels automatically)
    → Server middleware verifies the cookie
    → Zod validates server-side (same schema from shared/schemas)
    → adminDb creates the document in tools/
  → Pinia tools store invalidates the local cache
  → Redirect to /tools/:id
```

## 9.4 Edit and delete

Same pattern: the client sends the request with the cookie, the server verifies session and ownership with an explicit TypeScript check, then performs the operation with the Admin SDK. No authorization logic lives in the frontend or in the Rules anymore.

## 9.5 Star vote (toggle)

```txt
User clicks the star
  → Pinia store immediately updates local state (optimistic update)
  → POST /api/tools/:id/star
    → Server runs the transaction (see section 7): toggle vote + counter update
    → Response with { starred, starsCount }
  → If the response differs from the optimistic update, the store corrects itself
  → If the request fails, roll back the local state
```

## 9.6 Viewing bookmarks

```txt
User goes to /me/bookmarks
  → Client middleware verifies authentication (auth store)
  → GET /api/me/bookmarks (cookie included automatically)
    → Server queries stars for userId, then tools for the resulting ids
  → Pinia tools store populates the list
  → Render
```