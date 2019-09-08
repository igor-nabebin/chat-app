import { shallowMount } from "@vue/test-utils";
import LoginPage from "@/components/LoginPage";

import * as authAPI from "@/api/auth";

let wrapper;
authAPI.login = jest.fn().mockImplementation(({ username }) => ({
  username,
  token: "token"
}));

const mocks = {
  $router: {
    push: jest.fn()
  }
};

jest.spyOn(Storage.prototype, "setItem");

describe("LoginPage.vue", () => {
  beforeEach(() => {
    wrapper = shallowMount(LoginPage, { mocks });
  });
  afterEach(() => {
    mocks.$router.push.mockReset();
    global.localStorage.setItem.mockReset();
    wrapper.destroy();
  });
  it("setting username and token to localStorage on login", done => {
    const nameInput = wrapper.find("#username");
    nameInput.element.value = "test_username";
    nameInput.trigger("input");
    const passwordInput = wrapper.find("#password");
    passwordInput.element.value = "password";
    passwordInput.trigger("input");
    const form = wrapper.find("form");
    form.trigger("submit");
    wrapper.vm.$nextTick(() => {
      expect(global.localStorage.setItem).toHaveBeenCalledTimes(2);
      expect(global.localStorage.setItem).toHaveBeenNthCalledWith(
        1,
        "token",
        "token"
      );
      expect(global.localStorage.setItem).toHaveBeenNthCalledWith(
        2,
        "username",
        "test_username"
      );
      done();
    });
  });
  it("redirects to chatPage on login", done => {
    const nameInput = wrapper.find("#username");
    nameInput.element.value = "test_username";
    nameInput.trigger("input");
    const passwordInput = wrapper.find("#password");
    passwordInput.element.value = "password";
    passwordInput.trigger("input");
    const form = wrapper.find("form");
    form.trigger("submit");
    wrapper.vm.$nextTick(() => {
      expect(mocks.$router.push).toHaveBeenCalledTimes(1);
      expect(mocks.$router.push).toHaveBeenCalledWith({ name: "chatPage" });
      done();
    });
  });
});
