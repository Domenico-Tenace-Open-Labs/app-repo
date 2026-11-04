# 13. Non-Functional Requirements

> From: section 13 of the original App Repo spec.

## Performance

- Public pages use SSR: data arrives already in the HTML payload on first load
- No native realtime (see [architecture.md](architecture.md)): if needed in the future, it must be designed explicitly
- The denormalized fields (`ownerName`, `starsCount`) avoid multiple reads server-side

## Security

- The Admin SDK credentials never leave the server
- The session cookie is `httpOnly` and `secure`, not accessible from client-side JavaScript
- Every authorization check (ownership, authentication) lives in the server code, not in the client and not in the Rules
- The Security Rules are deliberately locked down (`allow read, write: if false`) as a safety net

## Cost

Staying on Firestore and Firebase Authentication, the free Spark plan remains sufficient for launch. The Nuxt server hosting (Vercel/Netlify) has a generous free plan for small projects, to verify based on expected traffic.

## Scalability

The Nuxt server is stateless (the session lives in the cookie, not in memory), so it scales horizontally without issues on any serverless platform. The Firestore `in` query limit of 30 values (section 7, bookmarks endpoint) still applies and must be handled with batched queries if necessary.