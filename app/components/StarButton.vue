<script setup lang="ts">
/**
 * Star/bookmark toggle. Generic + presentational: emits `toggle` on click.
 * Vuetify button styled to the M3 palette (filled amber when active).
 */
withDefaults(
  defineProps<{
    isStarred: boolean;
    starsCount: number;
    disabled?: boolean;
  }>(),
  { disabled: false }
);

const emit = defineEmits<{
  toggle: [];
}>();
</script>

<template>
  <VBtn
    variant="tonal"
    density="comfortable"
    size="small"
    rounded="pill"
    color="on-surface-variant"
    :disabled="disabled"
    :aria-pressed="isStarred"
    :title="isStarred ? 'Remove Bookmark' : 'Bookmark tool'"
    class="star-btn"
    @click="emit('toggle')"
  >
    <template #prepend>
      <AppIcon
        :name="isStarred ? 'star' : 'star-outline'"
        :size="18"
        :class="isStarred ? 'text-amber-darken-2' : undefined"
      />
    </template>
    <span class="text-caption font-weight-bold tabular-nums">{{ starsCount }}</span>
  </VBtn>
</template>

<style scoped>
.star-btn {
  border: 1px solid transparent;
}
.star-btn[aria-pressed="true"] {
  background-color: #fff8e1 !important;
  border-color: rgba(255, 193, 7, 0.4);
  color: #f57f17;
}
</style>