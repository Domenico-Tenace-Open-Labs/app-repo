# 5. Data Model (Firestore)

> From: section 5 of the original App Repo spec.

The model is conceptually the same as described in the previous version; the only difference is that all reads/writes now pass through the server, so this document only recalls the key decisions without repeating everything.

## Collection `users`

```txt
users/{uid}
├── email:      string
├── name:       string
├── avatarUrl:  string | null
└── createdAt:  timestamp
```

`{uid}` corresponds to the Firebase Authentication UID.

## Collection `tools`

```txt
tools/{toolId}
├── name:         string
├── description:  string
├── url:          string | null
├── pricingType:  "FREE" | "PAID" | "SUBSCRIPTION" | "FREEMIUM"
├── category:     string | null
├── tags:         string[]
├── ownerId:      string
├── ownerName:    string          # denormalized, avoids a lookup for every card in the list
├── starsCount:   number          # denormalized, now updated directly by the server
├── createdAt:    timestamp
└── updatedAt:    timestamp
```

## Collection `stars`

```txt
stars/{starId}
├── userId:    string
├── toolId:    string
└── createdAt: timestamp
```

The document ID remains deterministic: `starId = "${userId}_${toolId}"`. With the client SDK this also served to enforce uniqueness via Security Rules; now that writes go through the server, uniqueness is still guaranteed by construction (same ID = same document), but the "have you already voted?" check is done by the server with an explicit query before writing, making the behavior more readable in the application code rather than implicit in the ID.