import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import AppIcon from "~/components/AppIcon.vue";

describe("AppIcon", () => {
  it("renders an svg with the expected viewBox", async () => {
    const wrapper = await mountSuspended(AppIcon, {
      props: { name: "search" },
    });
    const svg = wrapper.find("svg");
    expect(svg.exists()).toBe(true);
    expect(svg.attributes("viewBox")).toBe("0 0 24 24");
    expect(svg.attributes("fill")).toBe("currentColor");
  });

  it("renders the path of the requested icon", async () => {
    const wrapper = await mountSuspended(AppIcon, {
      props: { name: "check" },
    });
    // A path must exist and carry a non-empty `d`.
    const path = wrapper.find("svg path");
    expect(path.exists()).toBe(true);
    expect(path.attributes("d")?.length ?? 0).toBeGreaterThan(10);
  });

  it("is decorative and hidden to assistive tech", async () => {
    const wrapper = await mountSuspended(AppIcon, {
      props: { name: "star" },
    });
    const svg = wrapper.find("svg");
    expect(svg.attributes("aria-hidden")).toBe("true");
    expect(svg.attributes("focusable")).toBe("false");
  });

  it("maps numeric size to px", async () => {
    const wrapper = await mountSuspended(AppIcon, {
      props: { name: "star", size: 20 },
    });
    const svg = wrapper.find("svg");
    expect(svg.attributes("width")).toBe("20px");
    expect(svg.attributes("height")).toBe("20px");
  });

  it("passes through a string size unchanged", async () => {
    const wrapper = await mountSuspended(AppIcon, {
      props: { name: "star", size: "1.25rem" },
    });
    const svg = wrapper.find("svg");
    expect(svg.attributes("width")).toBe("1.25rem");
  });
});