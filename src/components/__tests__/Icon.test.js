import { test, expect } from "vitest";

import { mount } from "@vue/test-utils";
import Icon from "@/components/Icon.vue";

test("Test Icon Component", async () => {
  const wrapper = mount(Icon, {
    props: {
      name: "arrow-right",
    },
  });
  expect(wrapper.text()).toContain("icon--arrow-right");
});
