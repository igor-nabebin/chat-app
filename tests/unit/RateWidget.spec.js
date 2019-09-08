import { shallowMount } from "@vue/test-utils";
import RateWidget from "@/components/widgets/RateWidget";

let wrapper;

describe("RateWidget.vue", () => {
  beforeEach(() => {
    wrapper = shallowMount(RateWidget, {
      propsData: {
        fromRate: 1,
        toRate: 5
      }
    });
  });
  afterEach(() => {
    wrapper.destroy();
  });
  it("generates valid buttons depends on props", () => {
    const buttons = wrapper.findAll(".command-btn");
    const buttonLabels = [...buttons.wrappers].map(btn => btn.text());
    expect(buttonLabels).toEqual(["1", "2", "3", "4", "5"]);
  });
  it("emits proper event on button click", () => {
    const buttons = wrapper.findAll(".command-btn");
    [...buttons.wrappers].forEach(btn => btn.trigger("click"));
    expect(wrapper.emitted().send).toEqual([[1], [2], [3], [4], [5]]);
  });
});
