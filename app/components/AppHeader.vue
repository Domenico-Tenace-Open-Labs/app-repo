<script setup lang="ts">
import type { User, PageId } from "#shared/types";

/**
 * App top navigation header (mockup: sticky bar, search, nav tabs,
 * theme toggle, profile dropdown, responsive mobile rail).
 * `activePage` semantics mirror the mockup's page state machine.
 */
const props = defineProps<{
  currentUser: User | null;
  activePage: PageId;
  searchQuery: string;
  isDarkMode: boolean;
}>();

const emit = defineEmits<{
  navigate: [page: PageId];
  "update:search-query": [value: string];
  logout: [];
  "toggle-dark": [];
}>();

const showSearch = computed(() =>
  ["discover", "bookmarks", "my-tools"].includes(props.activePage)
);

const searchPlaceholder = computed(() => {
  switch (props.activePage) {
    case "bookmarks":
      return "Search in bookmarked tools...";
    case "my-tools":
      return "Search in your shared tools...";
    default:
      return "Search in all tools...";
  }
});

function nav(destination: PageId) {
  emit("navigate", destination);
}
</script>

<template>
  <header class="topbar">
    <div class="topbar__inner d-flex align-center justify-space-between ga-3 flex-wrap">
      <div class="d-flex align-center ga-2">
        <!-- Brand -->
        <VBtn
          variant="text"
          class="text-none px-0"
          @click="nav('discover')"
        >
          <VAvatar color="primary" size="40" rounded="lg" class="mr-2">
            <AppIcon name="database" :size="22" class="text-on-primary" />
          </VAvatar>
          <span class="d-flex flex-column align-start">
            <span class="text-h6 font-weight-bold">App Repo</span>
            <span class="text-caption text-medium-emphasis">Developer Tool Registry</span>
          </span>
        </VBtn>
      </div>

      <!-- Global search -->
      <div v-if="showSearch" class="topbar__search">
        <VTextField
          :model-value="searchQuery"
          density="compact"
          variant="solo-filled"
          bg-color="surface-container"
          hide-details
          :placeholder="searchPlaceholder"
          @update:model-value="emit('update:search-query', $event as string)"
        >
          <template #prepend-inner>
            <AppIcon name="search" :size="20" class="text-medium-emphasis" />
          </template>
        </VTextField>
      </div>

      <!-- Desktop actions -->
      <div class="d-none d-md-flex align-center ga-2">
        <VBtnGroup class="topbar__tabs">
          <VBtn
            size="small"
            rounded="pill"
            :color="activePage === 'discover' ? 'primary' : undefined"
            @click="nav('discover')"
          >
            Discover
          </VBtn>
          <template v-if="currentUser">
            <VBtn
              size="small"
              rounded="pill"
              :color="activePage === 'bookmarks' ? 'primary' : undefined"
              @click="nav('bookmarks')"
            >
              <template #prepend>
                <AppIcon name="star-outline" :size="15" />
              </template>
              Bookmarks
            </VBtn>
            <VBtn
              size="small"
              rounded="pill"
              :color="activePage === 'my-tools' ? 'primary' : undefined"
              @click="nav('my-tools')"
            >
              <template #prepend>
                <AppIcon name="code" :size="15" />
              </template>
              My Tools
            </VBtn>
          </template>
        </VBtnGroup>

        <VBtn
          v-if="currentUser"
          color="primary"
          size="small"
          @click="nav('add-tool')"
        >
          <template #prepend>
            <AppIcon name="plus" :size="16" />
          </template>
          Add Tool
        </VBtn>

        <VBtn
          icon
          variant="text"
          :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          @click="emit('toggle-dark')"
        >
          <AppIcon :name="isDarkMode ? 'sun' : 'moon'" :size="22" :class="isDarkMode ? 'text-amber-darken-2' : ''" />
        </VBtn>

        <template v-if="currentUser">
          <VMenu
            :close-on-content-click="false"
            location="bottom end"
          >
            <template #activator="{ props: menuProps }">
              <VAvatar
                v-bind="menuProps"
                color="surface-container"
                size="40"
                rounded="circle"
                class="cursor-pointer"
                :aria-label="`Account menu for ${currentUser.name}`"
              >
                <VImg v-if="currentUser.avatarUrl" :src="currentUser.avatarUrl" :alt="currentUser.name" cover />
                <span v-else class="text-primary font-weight-bold text-h6">{{ currentUser.name.charAt(0).toUpperCase() }}</span>
              </VAvatar>
            </template>
            <VCard min-width="240" class="pa-2">
              <div class="px-3 py-2 border-bottom mb-1">
                <p class="text-subtitle-2 font-weight-bold text-truncate">{{ currentUser.name }}</p>
                <p class="text-caption text-medium-emphasis text-truncate">{{ currentUser.email }}</p>
              </div>
              <VList density="compact">
                <VListItem @click="nav('my-tools')">
                  <template #prepend><AppIcon name="code" :size="18" /></template>
                  My Shared Tools
                </VListItem>
                <VListItem @click="nav('bookmarks')">
                  <template #prepend>
                    <AppIcon name="star" :size="18" class="text-amber-darken-2" />
                  </template>
                  Bookmarked Stars
                </VListItem>
                <VDivider class="my-1" />
                <VListItem color="error" @click="emit('logout')">
                  <template #prepend>
                    <AppIcon name="logout" :size="18" />
                  </template>
                  Sign Out / Logout
                </VListItem>
              </VList>
            </VCard>
          </VMenu>
        </template>
        <div v-else class="d-flex ga-2">
          <VBtn variant="outlined" color="primary" size="small" @click="nav('login')">
            Sign In
          </VBtn>
          <VBtn color="primary" size="small" @click="nav('register')">
            Sign Up
          </VBtn>
        </div>
      </div>
    </div>

    <!-- Mobile bottom rail -->
    <div class="d-flex d-md-none align-center justify-space-between border-top mt-3 pt-3 flex-wrap ga-2">
      <div class="d-flex ga-1">
        <VBtn
          variant="text"
          size="small"
          :color="activePage === 'discover' ? 'primary' : undefined"
          @click="nav('discover')"
        >
          Discover
        </VBtn>
        <template v-if="currentUser">
          <VBtn
            variant="text"
            size="small"
            :color="activePage === 'bookmarks' ? 'primary' : undefined"
            @click="nav('bookmarks')"
          >
            Bookmarks
          </VBtn>
          <VBtn
            variant="text"
            size="small"
            :color="activePage === 'my-tools' ? 'primary' : undefined"
            @click="nav('my-tools')"
          >
            My Tools
          </VBtn>
        </template>
      </div>
      <div class="d-flex ga-1">
        <VBtn
          icon
          size="small"
          variant="text"
          :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          :aria-label="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          @click="emit('toggle-dark')"
        >
          <AppIcon :name="isDarkMode ? 'sun' : 'moon'" :size="20" :class="isDarkMode ? 'text-amber-darken-2' : ''" />
        </VBtn>
        <VBtn v-if="!currentUser" icon size="small" variant="text" aria-label="Sign in" @click="nav('login')">
          <AppIcon name="login" :size="20" />
        </VBtn>
        <VMenu v-else location="bottom end">
          <template #activator="{ props: menuProps }">
            <VAvatar
              v-bind="menuProps"
              color="surface-container"
              size="34"
              rounded="circle"
              class="cursor-pointer"
              :aria-label="`Account menu for ${currentUser.name}`"
            >
              <VImg v-if="currentUser.avatarUrl" :src="currentUser.avatarUrl" :alt="currentUser.name" cover />
              <span v-else class="text-primary font-weight-bold">{{ currentUser.name.charAt(0).toUpperCase() }}</span>
            </VAvatar>
          </template>
          <VCard min-width="220" class="pa-2">
            <div class="px-3 py-2 border-bottom mb-1">
              <p class="text-subtitle-2 font-weight-bold text-truncate">{{ currentUser.name }}</p>
              <p class="text-caption text-medium-emphasis text-truncate">{{ currentUser.email }}</p>
            </div>
            <VList density="compact">
              <VListItem @click="nav('my-tools')">
                <template #prepend><AppIcon name="code" :size="18" /></template>
                My Shared Tools
              </VListItem>
              <VListItem @click="nav('bookmarks')">
                <template #prepend><AppIcon name="star" :size="18" class="text-amber-darken-2" /></template>
                Bookmarked Stars
              </VListItem>
              <VDivider class="my-1" />
              <VListItem color="error" @click="emit('logout')">
                <template #prepend><AppIcon name="logout" :size="18" /></template>
                Sign Out / Logout
              </VListItem>
            </VList>
          </VCard>
        </VMenu>
      </div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgb(var(--v-theme-surface));
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  padding: 0.65rem 1.25rem;
}
.topbar__inner {
  max-width: 1280px;
  margin: 0 auto;
}
.topbar__search {
  flex: 1;
  max-width: 480px;
}
</style>