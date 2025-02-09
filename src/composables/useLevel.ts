import { levels } from "@/levels";
import { ref, type Ref } from "vue";

const level: Ref<number, number> = ref(1);

const nextLevel = () => {
  const levelCount = levels.length;
  level.value = Math.min(level.value + 1, levelCount);
};

export function useLevel() {
  return { level, nextLevel };
}
