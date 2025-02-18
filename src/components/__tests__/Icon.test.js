import { describe, it, expect } from "vitest";

import { shallowMount } from "@vue/test-utils";
import Icon from "../Icon.vue";

describe("Icon-Component", () => {
  it( "should show css-class 'icon--arrow-right' when icon name is 'arrow-right'", () => {
    const wrapper = shallowMount(Icon, {
      props: {
        name: "arrow-right",
      },
    });
    expect(wrapper.classes()).toContain("icon--arrow-right");
  });
});
