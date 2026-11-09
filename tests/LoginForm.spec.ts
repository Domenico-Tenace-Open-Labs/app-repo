import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import LoginForm from "~/components/LoginForm.vue";

async function mountLogin() {
  return mountSuspended(LoginForm, { props: { loading: false, googleLoading: false } });
}

describe("LoginForm", () => {
  it("renders title and email/password fields", async () => {
    const wrapper = await mountLogin();
    expect(wrapper.text()).toContain("Login to App Repo");
    expect(wrapper.find("input[type='email']").exists()).toBe(true);
    expect(wrapper.find("input[type='password']").exists()).toBe(true);
  });

  it("emits nothing on submit when fields are empty", async () => {
    const wrapper = await mountLogin();
    await wrapper.find("form").trigger("submit");
    expect(wrapper.emitted("submit")).toBeUndefined();
  });

  it("emits credentials on valid submit", async () => {
    const wrapper = await mountLogin();
    const email = wrapper.find("input[type='email']");
    email.element.value = "mario@example.com";
    await email.trigger("input");
    const pw = wrapper.find("input[type='password']");
    pw.element.value = "secret";
    await pw.trigger("input");
    await wrapper.find("form").trigger("submit");
    expect(wrapper.emitted("submit")?.[0]?.[0]).toEqual({
      email: "mario@example.com",
      password: "secret",
    });
  });

  it("emits google when the Google button is clicked", async () => {
    const wrapper = await mountLogin();
    const google = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Google"));
    expect(google).toBeTruthy();
    await google!.trigger("click");
    expect(wrapper.emitted("google")).toBeTruthy();
  });

  it("emits register when the Sign Up link is clicked", async () => {
    const wrapper = await mountLogin();
    const signup = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Sign Up"));
    await signup!.trigger("click");
    expect(wrapper.emitted("register")).toBeTruthy();
  });
});