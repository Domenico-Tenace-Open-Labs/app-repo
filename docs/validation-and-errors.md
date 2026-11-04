# 11. Validation and Error Handling

> From: section 11 of the original App Repo spec.

## Shared schema (`shared/schemas/tool.ts`)

```ts
import { z } from 'zod'

export const pricingTypeSchema = z.enum(['FREE', 'PAID', 'SUBSCRIPTION', 'FREEMIUM'])

export const toolSchema = z.object({
  name:        z.string().min(2).max(150),
  description: z.string().min(10).max(1000),
  url:         z.string().url().optional().or(z.literal('')),
  pricingType: pricingTypeSchema,
  category:    z.string().max(100).optional(),
  tags:        z.array(z.string().max(30)).max(10).optional(),
})

export type ToolInput = z.infer<typeof toolSchema>
```

Thanks to the `shared/` folder of Nuxt 4, this schema can be imported both from `app/components/ToolForm.vue` (client validation, for immediate feedback) and from `server/api/tools/index.post.ts` (server validation, which is what really matters now that the client no longer writes directly to Firestore).

## HTTP error codes

| Code | When |
| --- | --- |
| 400 | Invalid body (Zod fails server-side) |
| 401 | Missing or invalid session cookie |
| 403 | Authenticated user but not the resource owner |
| 404 | Resource not found |
| 409 | Conflict (e.g. email already registered) |
| 500 | Unexpected internal error |

## Client error handling

The `useApi.ts` composable centralizes reading the errors returned by the Nuxt server (no more Firebase codes to translate client-side, since now it is the server that talks to Firebase):

```ts
export const useApi = () => {
  const handleError = (error: any) => {
    const message = error?.data?.message ?? 'An error occurred, try again'
    // show the message in a toast, log, etc.
    return message
  }
  return { handleError }
}
```