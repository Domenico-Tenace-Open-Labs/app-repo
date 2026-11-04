# 7. API Server (Nuxt → Firebase Admin)

> From: section 7 of the original App Repo spec.

All endpoints live in `server/api/` and use `adminDb` to talk to Firestore.

## Conventions

- JSON responses, errors in the standard H3 format (`{ statusCode, message }`)
- Authentication via `event.context.user`, populated by the session middleware
- Endpoints that require authentication throw `401` if `event.context.user` is absent

## `GET /api/tools`

Paginated listing. No authentication required, but if a valid session is present, the response includes `isStarred` for each tool.

**Query params:** `page`, `limit`, `pricing`, `category`, `sort`, `order`, `q` (same as the previous version).

**Response `200`:**

```json
{
  "data": [
    {
      "id": "abc123",
      "name": "Figma",
      "description": "Collaborative design in the browser",
      "pricingType": "FREEMIUM",
      "category": "Design",
      "starsCount": 42,
      "isStarred": true,
      "ownerName": "Mario Rossi",
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 150 }
}
```

## `POST /api/tools` (authenticated)

```ts
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const body = await readValidatedBody(event, toolSchema.parse)

  const docRef = adminDb.collection('tools').doc()
  await docRef.set({
    ...body,
    ownerId: user.uid,
    ownerName: user.email, // or the name from the user profile
    starsCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return { id: docRef.id, ...body }
})
```

## `PUT /api/tools/:id` (authenticated, owner only)

```ts
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const id = getRouterParam(event, 'id')!
  const docRef = adminDb.collection('tools').doc(id)
  const snap = await docRef.get()

  if (!snap.exists) throw createError({ statusCode: 404, message: 'Tool not found' })
  if (snap.data()?.ownerId !== user.uid) {
    throw createError({ statusCode: 403, message: 'You are not the owner of this tool' })
  }

  const body = await readValidatedBody(event, toolSchema.partial().parse)
  await docRef.update({ ...body, updatedAt: new Date() })

  return { id, ...snap.data(), ...body }
})
```

The ownership check, previously written in Security Rules syntax, is now simply an `if` in TypeScript. Easier to read, easier to test with a normal unit test.

## `POST /api/tools/:id/star` (authenticated)

This is where the advantage of the server shows best: the vote and the counter update happen in a single transaction, without needing a separate Cloud Function reacting asynchronously.

```ts
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const toolId = getRouterParam(event, 'id')!
  const starId = `${user.uid}_${toolId}`
  const starRef = adminDb.collection('stars').doc(starId)
  const toolRef = adminDb.collection('tools').doc(toolId)

  const result = await adminDb.runTransaction(async (tx) => {
    const starSnap = await tx.get(starRef)
    const toolSnap = await tx.get(toolRef)
    if (!toolSnap.exists) throw createError({ statusCode: 404, message: 'Tool not found' })

    const alreadyStarred = starSnap.exists
    const increment = alreadyStarred ? -1 : 1

    if (alreadyStarred) {
      tx.delete(starRef)
    } else {
      tx.set(starRef, { userId: user.uid, toolId, createdAt: new Date() })
    }
    tx.update(toolRef, { starsCount: (toolSnap.data()?.starsCount ?? 0) + increment })

    return { starred: !alreadyStarred, starsCount: (toolSnap.data()?.starsCount ?? 0) + increment }
  })

  return result
})
```

Firestore's `runTransaction` guarantees that the vote and the counter always stay consistent even with concurrent requests — something that required more care with the asynchronous Cloud Function approach.

## `GET /api/me/bookmarks` (authenticated)

```ts
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const starsSnap = await adminDb.collection('stars')
    .where('userId', '==', user.uid).get()

  const toolIds = starsSnap.docs.map(d => d.data().toolId)
  if (toolIds.length === 0) return { data: [] }

  // Firestore limits "in" to 30 values: for longer lists, run batched queries
  const chunks = chunkArray(toolIds, 30)
  const tools = await Promise.all(
    chunks.map(chunk =>
      adminDb.collection('tools').where('__name__', 'in', chunk).get()
    )
  )

  return { data: tools.flatMap(snap => snap.docs.map(d => ({ id: d.id, ...d.data() }))) }
})
```