import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ToolCard from "~/components/ToolCard.vue";
import { mario, marioTool, otherTool } from "./fixtures";

const DESC_FRAGMENT = marioTool.description.replace(/\s+/g, " ").slice(0, 24);

async function mountCard(tool = marioTool, currentUser = mario) {
  return mountSuspended(ToolCard, {
    props: { tool, currentUser, isStarred: false },
  });
}

describe("ToolCard", () => {
  it("renders name, description, pricing and category", async () => {
    const wrapper = await mountCard();
    expect(wrapper.text()).toContain("Figma");
    expect(wrapper.text()).toContain(DESC_FRAGMENT);
    expect(wrapper.text()).toContain("FREEMIUM");
    expect(wrapper.text()).toContain("Design");
  });

  it("labels the owner with 'You (Owner)'", async () => {
    const wrapper = await mountCard();
    expect(wrapper.text()).toContain("You (Owner)");
  });

  it("shows the owner name when the current user is not the owner", async () => {
    const wrapper = await mountCard(marioTool, {
      ...mario,
      uid: "someone_else",
      name: "Someone Else",
    });
    expect(wrapper.text()).toContain("Mario Rossi"); // ownerName
  });

  it("emits select when the card is clicked", async () => {
    const wrapper = await mountCard();
    await wrapper.find(".tool-card").trigger("click");
    expect(wrapper.emitted("select")?.[0]?.[0]?.id).toBe("figma");
  });

  it("emits select on Enter and Space", async () => {
    const wrapper = await mountCard();
    await wrapper.find(".tool-card").trigger("keydown.enter");
    await wrapper.find(".tool-card").trigger("keydown.space");
    expect((wrapper.emitted("select") ?? []).length).toBe(2);
  });

  it("emits toggle-star (not select) when the star is clicked", async () => {
    const wrapper = await mountCard();
    await wrapper.find(".star-btn").trigger("click");
    expect(wrapper.emitted("toggle-star")).toBeTruthy();
    // Regression: star click must NOT navigate/select the tool.
    expect(wrapper.emitted("select")).toBeUndefined();
  });

  it("emits edit and delete when the owner clicks the action buttons", async () => {
    const wrapper = await mountCard();
    const buttons = wrapper.findAll(".tool-card button");
    // Owner action buttons appear after the star button.
    await buttons[buttons.length - 2].trigger("click");
    await buttons[buttons.length - 1].trigger("click");
    expect(wrapper.emitted("edit")).toBeTruthy();
    expect(wrapper.emitted("delete")).toBeTruthy();
  });

  it("does not render owner actions for a non-owner", async () => {
    const wrapper = await mountCard(otherTool);
    const buttons = wrapper.findAll(".tool-card button");
    // Only the star button should be present for a non-owner.
    expect(buttons.length).toBe(1);
  });
});