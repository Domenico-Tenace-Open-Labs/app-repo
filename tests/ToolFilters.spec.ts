import { describe, it, expect } from "vitest";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ToolFilters from "~/components/ToolFilters.vue";
import { CATEGORIES } from "#shared/types";

function mountFilters() {
  return mountSuspended(ToolFilters, {
    props: { selectedCategory: null, selectedPricing: null, sortBy: "stars" },
  });
}

describe("ToolFilters", () => {
  it("renders every category pill", async () => {
    const wrapper = await mountFilters();
    for (const cat of CATEGORIES) {
      expect(wrapper.text()).toContain(cat);
    }
  });

  it("renders all pricing options plus 'All pricing'", async () => {
    const wrapper = await mountFilters();
    for (const label of ["All pricing", "Free", "Freemium", "Subscription", "Paid"]) {
      expect(wrapper.text()).toContain(label);
    }
  });

  it("emits update:selected-category when a category chip is clicked", async () => {
    const wrapper = await mountFilters();
    await clickChip(wrapper, "Design");
    const e = wrapper.emitted("update:selected-category");
    expect(e?.[0]?.[0]).toBe("Design");
  });

  it("emits null when 'All Categories' is clicked", async () => {
    const wrapper = await mountFilters();
    await clickChip(wrapper, "All Categories");
    expect(wrapper.emitted("update:selected-category")?.[0]?.[0]).toBeNull();
  });

  it("emits update:selected-pricing when a pricing chip is clicked", async () => {
    const wrapper = await mountFilters();
    await clickChip(wrapper, "Freemium");
    expect(wrapper.emitted("update:selected-pricing")?.[0]?.[0]).toBe("FREEMIUM");
  });

  it("emits update:sort-by when the select changes", async () => {
    const wrapper = await mountFilters();
    const select = wrapper.findComponent({ name: "VSelect" });
    await select.vm.$emit("update:model-value", "newest");
    expect(wrapper.emitted("update:sort-by")?.[0]?.[0]).toBe("newest");
  });
});

/** Click the chip whose rendered text matches `label`. */
async function clickChip(wrapper: VueWrapper, label: string) {
  const chip = wrapper
    .findAll(".v-chip")
    .find((c) => c.text().trim() === label);
  expect(chip, `chip "${label}" not found`).toBeTruthy();
  await chip!.trigger("click");
}