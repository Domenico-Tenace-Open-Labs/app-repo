import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import AppFooter from "~/components/AppFooter.vue";

describe("AppFooter", () => {
  it("renders the brand name", async () => {
    const wrapper = await mountSuspended(AppFooter);
    expect(wrapper.text()).toContain("App Repo");
  });

  it("renders the Ready status pill", async () => {
    const wrapper = await mountSuspended(AppFooter);
    expect(wrapper.text()).toContain("Ready");
  });
});