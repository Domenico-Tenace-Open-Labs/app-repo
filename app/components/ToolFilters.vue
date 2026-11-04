<script setup lang="ts">
import type { PricingType, SortBy } from "#shared/types";
import { CATEGORIES } from "#shared/types";

/**
 * Filters panel as in the mockup: category pills, pricing pills and sort control.
 * Controlled component — state lives in the parent, emitted upward.
 */
const props = defineProps<{
  selectedCategory: string | null;
  selectedPricing: PricingType | null;
  sortBy: SortBy;
}>();

const emit = defineEmits<{
  "update:selected-category": [value: string | null];
  "update:selected-pricing": [value: PricingType | null];
  "update:sort-by": [value: SortBy];
}>();

const isCategoryActive = (cat: string | null) => props.selectedCategory === cat;
const isPricingActive = (p: PricingType | null) => props.selectedPricing === p;

const pricingOptions: { label: string; value: PricingType | null }[] = [
  { label: "All pricing", value: null },
  { label: "Free", value: "FREE" },
  { label: "Freemium", value: "FREEMIUM" },
  { label: "Subscription", value: "SUBSCRIPTION" },
  { label: "Paid", value: "PAID" },
];
</script>

<template>
  <VCard
    class="tool-filters pa-5"
    color="surface-container"
    variant="flat"
  >
    <!-- Categories -->
    <div class="d-flex align-center ga-2 mb-3">
      <AppIcon name="tune" :size="18" class="text-primary" />
      <span class="text-subtitle-2 font-weight-bold">Categories</span>
    </div>
    <div class="d-flex flex-wrap ga-1 mb-3">
      <VChip
        size="small"
        label
        :class="isCategoryActive(null) ? 'tool-filters__active' : undefined"
        :aria-pressed="isCategoryActive(null)"
        @click="emit('update:selected-category', null)"
      >
        All Categories
      </VChip>
      <VChip
        v-for="cat in CATEGORIES"
        :key="cat"
        size="small"
        label
        :class="isCategoryActive(cat) ? 'tool-filters__active' : undefined"
        :aria-pressed="isCategoryActive(cat)"
        @click="emit('update:selected-category', cat)"
      >
        {{ cat }}
      </VChip>
    </div>

    <VDivider class="my-3" />

    <!-- Pricing + Sort -->
    <div class="d-flex flex-column flex-md-row align-md-center justify-space-between ga-4">
      <div>
        <span class="text-caption font-weight-bold text-uppercase text-medium-emphasis tracking-widest">
          Pricing Model
        </span>
        <div class="d-flex flex-wrap ga-1 mt-2">
          <VChip
            v-for="opt in pricingOptions"
            :key="opt.label"
            size="small"
            class="rounded-lg"
            :class="isPricingActive(opt.value) ? 'tool-filters__active' : undefined"
            :aria-pressed="isPricingActive(opt.value)"
            @click="emit('update:selected-pricing', opt.value)"
          >
            {{ opt.label }}
          </VChip>
        </div>
      </div>

      <!-- Sort control -->
      <div class="d-flex align-center ga-2">
        <AppIcon name="swap-vertical" :size="18" class="text-primary" />
        <span class="text-caption font-weight-semibold text-medium-emphasis">Sort by:</span>
        <VSelect
          :model-value="sortBy"
          :items="[
            { title: '⭐ Stars (Popularity)', value: 'stars' },
            { title: '📅 Newest (Created Date)', value: 'newest' },
          ]"
          density="compact"
          variant="outlined"
          hide-details
          class="tool-filters__sort"
          @update:model-value="emit('update:sort-by', $event as SortBy)"
        />
      </div>
    </div>
  </VCard>
</template>

<style scoped>
.tool-filters__sort {
  max-width: 230px;
}
.tool-filters__active {
  background: rgb(var(--v-theme-primary-container)) !important;
  color: rgb(var(--v-theme-on-primary-container)) !important;
  border-color: rgba(249, 137, 45, 0.35) !important;
  font-weight: 700;
}
</style>