import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ToolForm from "~/components/ToolForm.vue";
import type { Tool } from "#shared/types";
import { marioTool } from "./fixtures";

async function mountForm(initialTool?: Tool | null) {
  return mountSuspended(ToolForm, {
    props: { initialTool: initialTool ?? null, submitting: false },
  });
}

/** Set a field by its unique placeholder (robust vs. VSelect's extra inputs). */
async function setByPlaceholder(wrapper: ReturnType<typeof mountForm>, placeholderFrag: string, value: string) {
  const field = wrapper
    .findAll("input")
    .find((i) => (i.attributes("placeholder") ?? "").includes(placeholderFrag));
  expect(field, `input with placeholder '${placeholderFrag}' not found`).toBeTruthy();
  field!.element.value = value;
  await field!.trigger("input");
}

async function setDescription(wrapper: ReturnType<typeof mountForm>, value: string) {
  const ta = wrapper.find("textarea");
  ta.element.value = value;
  await ta.trigger("input");
}

describe("ToolForm", () => {
  it("renders the create title when no tool is provided", async () => {
    const wrapper = await mountForm();
    expect(wrapper.text()).toContain("Share a New Developer Tool");
  });

  it("renders the edit title with the tool name when editing", async () => {
    const wrapper = await mountForm(marioTool);
    expect(wrapper.text()).toContain('Edit "Figma"');
    expect((wrapper.find("input").element as HTMLInputElement).value).toBe("Figma");
  });

  it("emits nothing and shows an error for an invalid short name", async () => {
    const wrapper = await mountForm();
    await wrapper.find("form").trigger("submit");
    expect(wrapper.emitted("submit")).toBeUndefined();
    expect(wrapper.text()).toContain("Name must be at least 2 characters long");
  });

  it("shows a description error when description is under 10 chars", async () => {
    const wrapper = await mountForm();
    await setByPlaceholder(wrapper, "e.g. Supabase", "Valid Name Here Enough");
    await setDescription(wrapper, "short");
    await wrapper.find("form").trigger("submit");
    expect(wrapper.text()).toContain("Description must be at least 10 characters");
  });

  it("rejects a url with a non-http(s) protocol", async () => {
    const wrapper = await mountForm();
    await setByPlaceholder(wrapper, "e.g. Supabase", "Named Tool");
    await setDescription(wrapper, "A sufficiently long description for a good tool.");
    await setByPlaceholder(wrapper, "https://", "ftp://nope.com");
    await wrapper.find("form").trigger("submit");
    expect(wrapper.text()).toContain("Only http:// and https:// URLs are supported");
  });

  it("emits a normalized submit payload for valid input", async () => {
    const wrapper = await mountForm();
    await setByPlaceholder(wrapper, "e.g. Supabase", "Supabase");
    await setDescription(wrapper, "Open source Firebase alternative with Postgres.");
    await setByPlaceholder(wrapper, "https://", "https://supabase.com");
    await wrapper.find("form").trigger("submit");
    expect(wrapper.emitted("submit")?.[0]?.[0]).toMatchObject({
      name: "Supabase",
      url: "https://supabase.com",
      category: "Development",
    });
  });

  it("parses tags into a trimmed, non-empty array", async () => {
    const wrapper = await mountForm();
    await setByPlaceholder(wrapper, "e.g. Supabase", "Notion");
    await setDescription(wrapper, "A workspace tool for collaborative teams.");
    await setByPlaceholder(wrapper, "https://", "https://notion.so");
    await setByPlaceholder(wrapper, "e.g. postgres", "#wiki, database,,docs");
    await wrapper.find("form").trigger("submit");
    const submitted = wrapper.emitted("submit")?.[0]?.[0] as { tags: string[] };
    expect(submitted.tags).toEqual(["wiki", "database", "docs"]);
  });

  it("emits cancel when Cancel is clicked", async () => {
    const wrapper = await mountForm();
    const cancel = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Cancel"));
    expect(cancel).toBeTruthy();
    await cancel!.trigger("click");
    expect(wrapper.emitted("cancel")).toBeTruthy();
  });
});