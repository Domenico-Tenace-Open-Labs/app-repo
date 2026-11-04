<script setup lang="ts">
import type { Tool, User, PricingType } from "#shared/types";

/**
 * Tool card as in the mockup (category/pricing badges, owner label,
 * description clamp, tags, star + owner actions).
 * Pure presentational: all interactions bubble up via events.
 */
const props = defineProps<{
  tool: Tool;
  currentUser: User | null;
  isStarred: boolean;
}>();

const emit = defineEmits<{
  select: [tool: Tool];
  "toggle-star": [tool: Tool];
  edit: [tool: Tool];
  delete: [tool: Tool];
}>();

const isOwner = computed(() => props.currentUser?.uid === props.tool.ownerId);

/** Mockup `getCategoryTheme` mapping → Vuetify color strings. */
const CATEGORY_COLORS: Record<string, string> = {
  Development: "blue",
  Design: "purple",
  Database: "cyan",
  Hosting: "pink",
  Management: "amber",
};

const categoryColor = computed(
  () => CATEGORY_COLORS[props.tool.category] ?? "grey"
);

const PRICING_COLORS: Record<PricingType, string> = {
  FREE: "green",
  FREEMIUM: "light-blue",
  SUBSCRIPTION: "indigo",
  PAID: "amber",
};

const pricingColor = computed(() => PRICING_COLORS[props.tool.pricingType]);
</script>

<template>
  <VHover v-slot="{ isHovering, props: hoverProps }">
    <VCard
      v-bind="hoverProps"
      class="tool-card"
      :class="{ 'tool-card--hover': isHovering }"
      role="button"
      :aria-label="`View ${tool.name}`"
      tabindex="0"
      @click="emit('select', tool)"
      @keydown.enter="emit('select', tool)"
      @keydown.space.prevent="emit('select', tool)"
    >
      <!-- Top: category + pricing badges -->
      <div class="d-flex align-center justify-space-between mb-3">
        <VChip size="x-small" label :color="`${categoryColor}-lighten-4`" class="text-none">
          {{ tool.category || "General" }}
        </VChip>
        <VChip size="x-small" label :color="`${pricingColor}-accent-4`" class="text-none">
          {{ tool.pricingType }}
        </VChip>
      </div>

      <!-- Title + creator -->
      <div class="mb-1">
        <span class="text-h6 font-weight-bold tool-card__title">
          {{ tool.name }}
        </span>
        <p class="text-caption text-medium-emphasis mt-0.5">
          Added by
          <span class="font-weight-medium" :class="isOwner ? 'text-primary' : ''">
            {{ isOwner ? "You (Owner)" : tool.ownerName || "Developer" }}
          </span>
        </p>
      </div>

      <!-- Description -->
      <p class="tool-card__desc text-body-2 text-medium-emphasis mb-4">
        {{ tool.description }}
      </p>

      <!-- Tags -->
      <div v-if="tool.tags?.length" class="d-flex flex-wrap align-center gap-1 mb-4">
        <AppIcon name="tag" :size="14" class="text-medium-emphasis mr-1" />
        <VChip
          v-for="(tag, idx) in tool.tags.slice(0, 3)"
          :key="`${tool.id}_tag_${idx}`"
          size="x-small"
          color="surface-container"
          class="tool-card__tag"
        >
          #{{ tag }}
        </VChip>
        <span
          v-if="tool.tags.length > 3"
          class="text-caption font-weight-semibold text-primary"
        >
          +{{ tool.tags.length - 3 }} more
        </span>
      </div>

      <!-- Footer: star + owner actions -->
      <VDivider class="mb-2" />
      <div class="d-flex align-center justify-space-between pt-1">
        <StarButton
          :is-starred="isStarred"
          :stars-count="tool.starsCount"
          @click.stop="emit('toggle-star', tool)"
        />

        <div v-if="isOwner" class="d-flex align-center ga-1">
          <VBtn
            icon
            size="small"
            variant="text"
            color="primary"
            title="Edit details"
            @click.stop="emit('edit', tool)"
          >
            <AppIcon name="edit" :size="16" />
          </VBtn>
          <VBtn
            icon
            size="small"
            variant="text"
            color="error"
            title="Delete tool"
            @click.stop="emit('delete', tool)"
          >
            <AppIcon name="trash" :size="16" />
          </VBtn>
        </div>
      </div>
    </VCard>
  </VHover>
</template>

<style scoped>
.tool-card {
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  overflow: hidden;
}
.tool-card--hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.tool-card__title {
  cursor: pointer;
  transition: color 0.2s;
}
.tool-card__title:hover {
  color: rgb(var(--v-theme-primary));
}
.tool-card__desc {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.tool-card__tag:hover {
  background-color: rgb(var(--v-theme-primary-container)) !important;
}
</style>