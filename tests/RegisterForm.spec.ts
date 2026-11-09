import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import RegisterForm from "~/components/RegisterForm.vue";

async function mountRegister() {
  return mountSuspended(RegisterForm, { props: { loading: false, googleLoading: false } });
}

describe("RegisterForm", () => {
  it("renders name, email and password fields", async () => {
    const wrapper = await mountRegister();
    expect(wrapper.text()).toContain("Create your Account");
    expect(wrapper.findAll("input").length).toBe(3);
  });

  it("emits nothing when required fields are empty", async () => {
    const wrapper = await mountRegister();
    await wrapper.find("form").trigger("submit");
    expect(wrapper.emitted("submit")).toBeUndefined();
  });

  it("emits registration data on submit", async () => {
    const wrapper = await mountRegister();
    const [name, email, password] = wrapper.findAll("input");
    name.element.value = "Mario Rossi";
    await name.trigger("input");
    email.element.value = "mario@example.com";
    await email.trigger("input");
    password.element.value = "longenough";
    await password.trigger("input");
    await wrapper.find("form").trigger("submit");
    expect(wrapper.emitted("submit")?.[0]?.[0]).toEqual({
      name: "Mario Rossi",
      email: "mario@example.com",
      password: "longenough",
    });
  });

  it("does not submit a too-short password", async () => {
    const wrapper = await mountRegister();
    const [name, email, password] = wrapper.findAll("input");
    name.element.value = "Mario";
    await name.trigger("input");
    email.element.value = "mario@example.com";
    await email.trigger("input");
    password.element.value = "123";
    await password.trigger("input");
    await wrapper.find("form").trigger("submit");
    // handleSubmit gates on the min-6 rule, so nothing is emitted.
    expect(wrapper.emitted("submit")).toBeUndefined();
  });

  it("emits google when the Google button is clicked", async () => {
    const wrapper = await mountRegister();
    const google = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Google"));
    await google!.trigger("click");
    expect(wrapper.emitted("google")).toBeTruthy();
  });

  it("emits login when the Sign In link is clicked", async () => {
    const wrapper = await mountRegister();
    const signin = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Sign In"));
    await signin!.trigger("click");
    expect(wrapper.emitted("login")).toBeTruthy();
  });
});