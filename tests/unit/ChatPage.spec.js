import { shallowMount } from "@vue/test-utils";
import ChatPage from "@/components/ChatPage";

let wrapper;

const mocks = {
  $router: {
    push: jest.fn()
  }
};

jest.spyOn(Storage.prototype, "removeItem");
jest.spyOn(Storage.prototype, "getItem");

describe("ChatPage.vue", () => {
  beforeEach(() => {
    wrapper = shallowMount(ChatPage, { mocks });
  });
  afterEach(() => {
    mocks.$router.push.mockReset();
    global.localStorage.removeItem.mockReset();
    global.localStorage.getItem.mockReset();
    wrapper.destroy();
  });
  it("setting username on page create", () => {
    expect(global.localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(global.localStorage.getItem).toHaveBeenCalledWith("username");
  });
  it("clearing localStorage on logout", () => {
    const logoutBtn = wrapper.find(".logout-btn");
    logoutBtn.trigger("click");
    expect(global.localStorage.removeItem).toHaveBeenCalledTimes(2);
    expect(global.localStorage.removeItem).toHaveBeenNthCalledWith(
      1,
      "username"
    );
    expect(global.localStorage.removeItem).toHaveBeenNthCalledWith(2, "token");
  });
  it("redirecting to login page on logout", () => {
    const logoutBtn = wrapper.find(".logout-btn");
    logoutBtn.trigger("click");
    expect(mocks.$router.push).toHaveBeenCalledTimes(1);
    expect(mocks.$router.push).toHaveBeenCalledWith({ name: "loginPage" });
  });
});
