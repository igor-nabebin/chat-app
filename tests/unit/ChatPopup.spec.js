import { shallowMount } from "@vue/test-utils";
import ChatPopup from "@/components/ChatPopup";

let wrapper;
const mocks = {
  sockets: {
    subscribe: jest.fn(),
    unsubscribe: jest.fn()
  },
  $socket: {
    emit: jest.fn()
  }
};

describe("ChatPopup.vue", () => {
  beforeEach(() => {
    wrapper = shallowMount(ChatPopup, { mocks });
    const chatIcon = wrapper.find(".chat-collapsed");
    chatIcon.trigger("click");
  });
  afterEach(() => {
    wrapper.destroy();
    mocks.sockets.subscribe.mockReset();
    mocks.sockets.unsubscribe.mockReset();
    mocks.$socket.emit.mockReset();
  });
  it("subscribe to socket.io events on create", () => {
    expect(mocks.sockets.subscribe).toHaveBeenCalledTimes(2);
    expect(mocks.sockets.subscribe.mock.calls[0][0]).toBe("message");
    expect(mocks.sockets.subscribe.mock.calls[1][0]).toBe("command");
  });
  it("unsubscribe to socket.io events on component destroy", () => {
    wrapper.destroy();
    expect(mocks.sockets.unsubscribe).toHaveBeenCalledTimes(2);
    expect(mocks.sockets.unsubscribe.mock.calls[0][0]).toBe("message");
    expect(mocks.sockets.unsubscribe.mock.calls[1][0]).toBe("command");
  });
  it("adds message on income message event", done => {
    wrapper.vm.onSocketMessage({
      author: "author",
      message: "message"
    });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.messages).toHaveLength(1);
      const messages = wrapper.findAll(".message");
      expect(
        messages
          .at(0)
          .find(".msg-author")
          .text()
      ).toBe("author:");
      expect(
        messages
          .at(0)
          .find(".msg-text")
          .text()
      ).toBe("message");
      done();
    });
  });
  it("handles income command events", done => {
    wrapper.vm.onSocketCommand({
      command: { type: "date", data: "2018-01-01T14:32:33.921Z" }
    });
    wrapper.vm.$nextTick(() => {
      const commandEl = wrapper.find(".command");
      expect(commandEl.name()).toBe("DateWidget");
      done();
    });
  });
  it("emits message event to the server on outgoing message submit", () => {
    const msgInput = wrapper.find(".msg-input");
    msgInput.element.value = "outgoing message";
    const form = wrapper.find(".footer-form");
    form.trigger("submit");
    expect(mocks.$socket.emit).toHaveBeenCalledTimes(1);
    expect(mocks.$socket.emit).toHaveBeenCalledWith("message", {
      author: "User",
      message: "outgoing message"
    });
  });
  it("adds message to the chat window on outgoing message submit", done => {
    const msgInput = wrapper.find(".msg-input");
    msgInput.element.value = "outgoing message";
    const form = wrapper.find(".footer-form");
    form.trigger("submit");
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.messages).toHaveLength(1);
      const messages = wrapper.findAll(".message");
      expect(
        messages
          .at(0)
          .find(".msg-author")
          .text()
      ).toBe("User:");
      expect(
        messages
          .at(0)
          .find(".msg-text")
          .text()
      ).toBe("outgoing message");
      done();
    });
  });
  it("emits command event to the server on outgoing command request button click", () => {
    const reqCommandBtn = wrapper.find(".command-btn");
    reqCommandBtn.trigger("click");
    expect(mocks.$socket.emit).toHaveBeenCalledTimes(1);
    expect(mocks.$socket.emit).toHaveBeenCalledWith("command");
  });
});
