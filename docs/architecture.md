# 3. Overall Architecture

> From: section 3 of the original App Repo spec.

The central point of this version of the spec: **the client never talks to Firestore directly**. Every read and write goes through the Nuxt server, which uses the Firebase Admin SDK.

```txt
┌─────────────┐      HTTP requests       ┌──────────────────┐      Admin SDK      ┌────────────┐
│   Browser    │ ─────────────────────────▶│   Server Nuxt     │────────────────────▶│  Firebase   │
│ (Vue + Pinia)│◀───────────────────────── │  (Nitro, /server/)│◀────────────────────│ Auth/Firestore │
└─────────────┘      JSON responses       └──────────────────┘                     └────────────┘
```

## Why this changes things vs. a "direct client" setup

With the client SDK (discarded in this version), security relied almost entirely on Firestore Security Rules, written in a dedicated language and separate from the rest of the application logic. With the Admin SDK on the server, the Admin SDK bypasses the Rules by definition, so the server itself must enforce the checks: who can modify what, who can see what — in plain TypeScript, next to the rest of the business logic.

The Security Rules still remain as a safety net (see [firestore-security.md](firestore-security.md)), but their role is reduced: they are no longer the first line of defense — the server is.

## What is lost

No more client-side `onSnapshot` for realtime updates: the client has no direct channel to Firestore. If the tool list ever needs "live" updates, it must be implemented explicitly server-side (polling, Server-Sent Events, or a WebSocket channel) — it is no longer free as it was with the client SDK. For this project, where realtime is not an explicit requirement, that is not a problem.