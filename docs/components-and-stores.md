# 10. Components, Pages, and Pinia Stores

> From: section 10 of the original App Repo spec.

## Pages

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Tool list with filters |
| `/tools/:id` | Public | Tool detail |
| `/tools/new` | Authenticated | Add-tool form |
| `/tools/:id/edit` | Authenticated (owner) | Edit-tool form |
| `/auth/login` | Guest | Login |
| `/auth/register` | Guest | Registration |
| `/me/tools` | Authenticated | My tools |
| `/me/bookmarks` | Authenticated | My bookmarks |

## Pinia stores

**`stores/auth.ts`**

```ts
export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ uid: string; email: string; name: string } | null>(null)

  const fetchSession = async () => {
    try {
      user.value = await $fetch('/api/auth/me')
    } catch {
      user.value = null
    }
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  return { user, fetchSession, logout }
})
```

**`stores/tools.ts`**

```ts
export const useToolsStore = defineStore('tools', () => {
  const tools = ref<Tool[]>([])
  const meta = ref({ page: 1, total: 0 })

  const fetchTools = async (filters: ToolFilters) => {
    const res = await $fetch('/api/tools', { query: filters })
    tools.value = res.data
    meta.value = res.meta
  }

  const toggleStar = async (toolId: string) => {
    const tool = tools.value.find(t => t.id === toolId)
    if (!tool) return

    // Optimistic update
    const wasStarred = tool.isStarred
    tool.isStarred = !wasStarred
    tool.starsCount += wasStarred ? -1 : 1

    try {
      const res = await $fetch(`/api/tools/${toolId}/star`, { method: 'POST' })
      tool.isStarred = res.starred
      tool.starsCount = res.starsCount
    } catch {
      // Rollback
      tool.isStarred = wasStarred
      tool.starsCount += wasStarred ? 1 : -1
    }
  }

  return { tools, meta, fetchTools, toggleStar }
})
```

With Pinia, state is centralized and traceable in the devtools, unlike `useState`, which is better suited for simple cases. For an app with multiple pages that share tool and user data, it is the more solid choice.

## Key components

**`ToolCard.vue`**: card with name, description, pricing badge, star counter, and the `StarButton`. *(Repo note: the UI actually configured is Vuetify — see `nuxt.config.ts` — not Tailwind.)*

**`ToolForm.vue`**: form shared between creation and editing, with Zod validation on submit.

**`StarButton.vue`**: calls `useToolsStore().toggleStar()`; all the optimistic-update and rollback logic lives in the store, keeping the component simple.