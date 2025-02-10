import { levels } from "@/levels";
import { computed, ref, type Ref } from "vue";

const level: Ref<number, number> = ref(1);

const nextLevel = () => {
  const levelCount = levels.length;
  level.value = Math.min(level.value + 1, levelCount);
};

const levelData = computed(() => levels[level.value - 1]);

export function useLevel() {
  return { level, nextLevel, levelData };
}
