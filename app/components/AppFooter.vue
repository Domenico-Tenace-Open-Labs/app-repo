<script setup lang="ts">
/**
 * App footer (mockup: brand mark, credits line, "Ready" status pill).
 * Generic presentational component.
 */
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__inner d-flex flex-column flex-md-row align-center justify-space-between ga-4">
      <div class="d-flex align-center ga-2">
        <div class="d-flex align-center justify-center app-footer__brand">
          <AppIcon name="database" :size="16" class="text-primary" />
        </div>
        <span class="font-weight-bold text-medium-emphasis text-body-2">
          App Repo Spec Mockup
        </span>
      </div>

      <p class="text-caption text-medium-emphasis text-center ma-0">
        Crafted strictly in accordance with Google Material Design 3 Spec. All data safely persisted in browser LocalStorage.
      </p>

      <div class="d-flex align-center ga-2 px-3 py-1 rounded-pill app-footer__status">
        <span class="text-caption font-mono">Status:</span>
        <span class="app-footer__dot" aria-hidden="true" />
        <span class="text-caption font-weight-bold text-success text-lowercase">Ready</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: 3rem;
  padding: 2rem 1.25rem;
  background: rgb(var(--v-theme-surface-container));
  border-top: 1px solid rgb(var(--v-theme-surface-variant));
}
.app-footer__inner {
  max-width: 1280px;
  margin: 0 auto;
}
.app-footer__brand {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: rgb(var(--v-theme-primary-container));
}
.app-footer__status {
  border: 1px solid rgb(var(--v-theme-outline-variant));
  background: rgb(var(--v-theme-surface));
}
.app-footer__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(var(--v-theme-success));
}
</style>