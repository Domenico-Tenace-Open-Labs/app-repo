<script setup lang="ts">
import type { Category, Tool, ToolInput, PricingType } from "#shared/types";
import { CATEGORIES } from "#shared/types";

/**
 * Shared create/edit tool form. Mirrors the mockup field validation and the
 * `toolSchema` constraints in `docs/validation-and-errors.md`:
 *   name 2–150 · description 10–1000 · url http(s) · tags ≤ 10.
 * Generic: parent passes the item to edit (or null for create) and handles submit.
 */
const props = defineProps<{
  initialTool?: Tool | null;
  submitting?: boolean;
}>();

const emit = defineEmits<{
  submit: [payload: ToolInput];
  cancel: [];
}>();

const name = ref(props.initialTool?.name ?? "");
const description = ref(props.initialTool?.description ?? "");
const url = ref(props.initialTool?.url ?? "");
const pricingType = ref<PricingType>(props.initialTool?.pricingType ?? "FREE");
const category = ref<Category>(toCategory(props.initialTool?.category));
const tagsInput = ref(props.initialTool?.tags?.join(", ") ?? "");

const TOOL_FIELDS = ["name", "description", "url"] as const;
type ToolField = (typeof TOOL_FIELDS)[number];
const fieldErrors = reactive<Partial<Record<ToolField, string>>>({});

/**
 * `Tool.category` is a free-form string in the data model; keep only known options.
 */
function toCategory(value: string | undefined): Category {
  return value !== undefined && CATEGORIES.includes(value as Category)
    ? (value as Category)
    : CATEGORIES[0];
}

/**
 * Accessor used by the template: direct `fieldErrors[field]` property access in
 * template expressions makes vue-tsc emit wrong code here (`.value` on a
 * non-ref), so the errors surface through this function instead.
 */
function errorFor(field: ToolField): string | undefined {
  return fieldErrors[field];
}

function clearErrors() {
  for (const field of TOOL_FIELDS) fieldErrors[field] = undefined;
}

/** Presence of an error = key set to a message; `undefined` means valid. */
function hasErrors(): boolean {
  return TOOL_FIELDS.some((field) => fieldErrors[field] !== undefined);
}

/** Reset form when the edited tool changes (create ↔ edit). */
watch(
  () => props.initialTool,
  (tool) => {
    name.value = tool?.name ?? "";
    description.value = tool?.description ?? "";
    url.value = tool?.url ?? "";
    pricingType.value = tool?.pricingType ?? "FREE";
    category.value = toCategory(tool?.category);
    tagsInput.value = tool?.tags?.join(", ") ?? "";
    clearErrors();
  }
);

function validateName() {
  const v = name.value.trim();
  if (v.length < 2) return "Name must be at least 2 characters long";
  if (v.length > 150) return "Name cannot exceed 150 characters";
  return "";
}
function validateDescription() {
  const v = description.value.trim();
  if (v.length < 10) return "Description must be at least 10 characters long";
  if (v.length > 1000) return "Description cannot exceed 1000 characters";
  return "";
}
function validateUrl() {
  const v = url.value.trim();
  if (!v) return "";
  try {
    const { protocol } = new URL(v);
    if (protocol !== "http:" && protocol !== "https:")
      return "Only http:// and https:// URLs are supported";
    return "";
  } catch {
    return "Please enter a valid website URL (e.g. https://example.com)";
  }
}

function onRules(errorKey: ToolField, validator: () => string) {
  const err = validator();
  fieldErrors[errorKey] = err || undefined;
}

function handleSubmit() {
  // validate all fields
  onRules("name", validateName);
  onRules("description", validateDescription);
  onRules("url", validateUrl);

  if (hasErrors()) return;

  const tags = tagsInput.value
    .split(/[\s,]+/)
    .map((t) => t.trim().replace(/^#/, ""))
    .filter(Boolean)
    .slice(0, 10);

  emit("submit", {
    name: name.value.trim(),
    description: description.value.trim(),
    url: url.value.trim(),
    pricingType: pricingType.value,
    category: category.value,
    tags,
  });
}
</script>

<template>
  <VCard class="tool-form" variant="flat">
    <h2 class="text-h6 font-weight-bold mb-1">
      {{ initialTool ? `Edit "${initialTool.name}"` : "Share a New Developer Tool" }}
    </h2>
    <p class="text-caption text-medium-emphasis mb-5">
      <template v-if="initialTool">
        Update the fields below to keep the pricing structure, category, or url up to date.
      </template>
      <template v-else>
        Contribute a useful utility, open-source library, or SaaS with other developers in the community.
      </template>
    </p>

    <form class="d-flex flex-column ga-4" novalidate @submit.prevent="handleSubmit">
      <!-- Name -->
      <div>
        <span class="text-caption font-weight-bold text-uppercase tracking-wide mb-1 d-block">
          Tool Name <span class="text-error">*</span>
        </span>
        <VTextField
          v-model="name"
          placeholder="e.g. Supabase, Tailwind Play, Postman"
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          :error="!!errorFor('name')"
          :error-messages="errorFor('name')"
          @input="onRules('name', validateName)"
        />
        <p v-if="!errorFor('name')" class="text-caption text-medium-emphasis mt-1">
          Between 2 and 150 characters.
        </p>
      </div>

      <!-- Category + Pricing -->
      <div class="d-flex flex-column flex-md-row gx-4 gy-4">
        <div class="flex-grow-1">
          <span class="text-caption font-weight-bold text-uppercase tracking-wide mb-1 d-block">
            Category
          </span>
          <VSelect
            v-model="category"
            :items="CATEGORIES"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </div>
        <div class="flex-grow-1">
          <span class="text-caption font-weight-bold text-uppercase tracking-wide mb-1 d-block">
            Pricing Model
          </span>
          <VSelect
            v-model="pricingType"
            :items="[
              { title: 'FREE - 100% Free forever', value: 'FREE' },
              { title: 'FREEMIUM - Free tiers / paid upgrades', value: 'FREEMIUM' },
              { title: 'SUBSCRIPTION - Recurring fee', value: 'SUBSCRIPTION' },
              { title: 'PAID - One-time checkout price', value: 'PAID' },
            ]"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </div>
      </div>

      <!-- URL -->
      <div>
        <span class="text-caption font-weight-bold text-uppercase tracking-wide mb-1 d-block">
          Website URL
          <span class="text-caption text-medium-emphasis text-lowercase font-weight-regular">(optional)</span>
        </span>
        <VTextField
          v-model="url"
          placeholder="e.g. https://supabase.com"
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          :error="!!errorFor('url')"
          :error-messages="errorFor('url')"
          @input="onRules('url', validateUrl)"
        >
          <template #prepend-inner>
            <AppIcon name="link" :size="16" class="text-medium-emphasis" />
          </template>
        </VTextField>
        <p v-if="!errorFor('url')" class="text-caption text-medium-emphasis mt-1">
          Must start with http:// or https://
        </p>
      </div>

      <!-- Description -->
      <div>
        <span class="text-caption font-weight-bold text-uppercase tracking-wide mb-1 d-block">
          Description <span class="text-error">*</span>
        </span>
        <VTextarea
          v-model="description"
          placeholder="Describe what this tool is used for and who benefits from it..."
          rows="4"
          variant="outlined"
          density="comfortable"
          :error="!!errorFor('description')"
          :error-messages="errorFor('description')"
          @input="onRules('description', validateDescription)"
        />
        <div class="d-flex justify-space-between text-caption text-medium-emphasis mt-1">
          <span>Explain core developer benefits. At least 10 characters.</span>
          <span :class="description.length > 1000 ? 'text-error font-weight-medium' : ''">
            {{ description.length }}/1000 chars
          </span>
        </div>
      </div>

      <!-- Tags -->
      <div>
        <span class="text-caption font-weight-bold text-uppercase tracking-wide mb-1 d-block">
          Tags / Labels
          <span class="text-caption text-medium-emphasis text-lowercase font-weight-regular">(optional)</span>
        </span>
        <VTextField
          v-model="tagsInput"
          placeholder="e.g. postgres, auth, web, editor"
          variant="outlined"
          density="comfortable"
          hide-details
        >
          <template #prepend-inner>
            <AppIcon name="tag" :size="16" class="text-medium-emphasis" />
          </template>
        </VTextField>
        <p class="text-caption text-medium-emphasis mt-1">
          Separate tags with commas or spaces. Maximum 10 tags.
        </p>
      </div>

      <!-- Actions -->
      <div class="d-flex justify-end ga-3 pt-2">
        <VBtn variant="outlined" color="primary" @click="emit('cancel')">
          Cancel
        </VBtn>
        <VBtn
          type="submit"
          color="primary"
          :loading="submitting"
          class="px-5"
        >
          <template #prepend>
            <AppIcon name="check" :size="16" />
          </template>
          {{ initialTool ? "Update Tool" : "Publish Tool" }}
        </VBtn>
      </div>
    </form>
  </VCard>
</template>

<style scoped>
.tool-form {
  padding: 2rem;
}
</style>