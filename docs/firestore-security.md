# 8. Firestore Security Rules

> From: section 8 of the original App Repo spec.

With all writes passing through the server via the Admin SDK (which bypasses the Rules by definition), the Security Rules become a safety net rather than the first line of defense. Their main purpose now is to block any direct access to Firestore that does not go through the server — in case the public keys are used improperly, or in case of future bugs that re-introduce client-side reads/writes.

```javascript
// firestore.rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // No direct client access: everything goes through the server with the Admin SDK.
    // The only exceptions would be public reads if, in the future, the client SDK
    // is re-introduced for certain queries — to evaluate case by case.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

This is an intentionally strict choice: given that the architecture requires that *everything* goes through the server, there is no reason to leave gaps in the Rules. If some direct client read is ever wanted in the future (for example for realtime), only that specific path is opened up selectively.