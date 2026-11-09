import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import AppHeader from "~/components/AppHeader.vue";
import { mario } from "./fixtures";

async function mountHeader(opts: {
  currentUser?: typeof mario | null;
  activePage?: "discover" | "my-tools" | "login";
  searchQuery?: string;
  isDarkMode?: boolean;
} = {}) {
  const {
    currentUser = null,
    activePage = "discover",
    searchQuery = "",
    isDarkMode = false,
  } = opts;
  return mountSuspended(AppHeader, {
    props: { currentUser, activePage, searchQuery, isDarkMode },
  });
}

describe("AppHeader", () => {
  it("renders the brand name", async () => {
    const wrapper = await mountHeader();
    expect(wrapper.text()).toContain("App Repo");
    expect(wrapper.text()).toContain("Developer Tool Registry");
  });

  it("shows the global search on discover pages", async () => {
    const wrapper = await mountHeader({ activePage: "discover" });
    expect(wrapper.find(".topbar__search input").exists()).toBe(true);
  });

  it("hides the search on non-list pages", async () => {
    const wrapper = await mountHeader({ activePage: "login" });
    expect(wrapper.find(".topbar__search input").exists()).toBe(false);
  });

  it("emits update:search-query when typing", async () => {
    const wrapper = await mountHeader();
    const input = wrapper.find(".topbar__search input");
    input.element.value = "figma";
    await input.trigger("input");
    expect(wrapper.emitted("update:search-query")?.[0]?.[0]).toBe("figma");
  });

  it("emits toggle-dark from the theme button", async () => {
    const wrapper = await mountHeader();
    const toggle = wrapper
      .findAll("button")
      .find((b) => b.attributes("title")?.toLowerCase().includes("dark"));
    expect(toggle).toBeTruthy();
    await toggle!.trigger("click");
    expect(wrapper.emitted("toggle-dark")).toBeTruthy();
  });

  it("shows Bookmarks and My Tools tabs only when authenticated", async () => {
    const guest = await mountHeader({ currentUser: null });
    expect(guest.text().includes("Bookmarks")).toBe(false);
    expect(guest.text().includes("My Tools")).toBe(false);

    const authed = await mountHeader({ currentUser: mario });
    expect(authed.text()).toContain("Bookmarks");
    expect(authed.text()).toContain("My Tools");
  });

  it("shows Add Tool only for authenticated users", async () => {
    const guest = await mountHeader({ currentUser: null });
    expect(guest.text().includes("Add Tool")).toBe(false);
    const authed = await mountHeader({ currentUser: mario });
    expect(authed.text()).toContain("Add Tool");
  });

  it("shows Sign In / Sign Up for guests", async () => {
    const guest = await mountHeader({ currentUser: null });
    expect(guest.text()).toContain("Sign In");
    expect(guest.text()).toContain("Sign Up");
  });

  it("navigates when the brand is clicked", async () => {
    const wrapper = await mountHeader({ activePage: "my-tools" });
    const brand = wrapper
      .findAll("button")
      .find((b) => b.text().includes("App Repo"));
    await brand!.trigger("click");
    expect(wrapper.emitted("navigate")?.[0]?.[0]).toBe("discover");
  });

  it("surfaces the profile menu for authenticated users", async () => {
    const wrapper = await mountHeader({ currentUser: mario });
    // VMenu lazy-renders its content; the avatar activator is always present.
    const avatar = wrapper.find("[aria-label^='Account menu']");
    expect(avatar.exists()).toBe(true);
  });
});