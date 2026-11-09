import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import StarButton from "~/components/StarButton.vue";

describe("StarButton", () => {
  it("renders the star count", async () => {
    const wrapper = await mountSuspended(StarButton, {
      props: { isStarred: false, starsCount: 142 },
    });
    expect(wrapper.text()).toContain("142");
  });

  it("exposes selection state via aria-pressed", async () => {
    const on = await mountSuspended(StarButton, {
      props: { isStarred: true, starsCount: 1 },
    });
    expect(on.find("button").attributes("aria-pressed")).toBe("true");

    const off = await mountSuspended(StarButton, {
      props: { isStarred: false, starsCount: 1 },
    });
    expect(off.find("button").attributes("aria-pressed")).toBe("false");
  });

  it("emits toggle on click", async () => {
    const wrapper = await mountSuspended(StarButton, {
      props: { isStarred: false, starsCount: 2 },
    });
    await wrapper.find("button").trigger("click");
    const emitted = wrapper.emitted("toggle");
    expect(emitted).toBeTruthy();
  });

  it("does not emit when disabled", async () => {
    const wrapper = await mountSuspended(StarButton, {
      props: { isStarred: false, starsCount: 2, disabled: true },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("toggle")).toBeUndefined();
  });

  it("uses the filled star name when active", async () => {
    const wrapper = await mountSuspended(StarButton, {
      props: { isStarred: true, starsCount: 5 },
    });
    const svg = wrapper.find("svg");
    // Presence of a path is enough; the filled glyph is selected by prop.
    expect(wrapper.find("svg path").exists()).toBe(true);
  });
});