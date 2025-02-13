import { levels } from "@/levels";
import { computed, ref, type Ref } from "vue";

const level: Ref<number, number> = ref(0);

const nextLevel = () => {
  const currentLevel = level.value;
  const nextLevel = currentLevel + 1;
  const lastLevel = levels.length;
  level.value = Math.min(nextLevel, lastLevel);
};

const levelData = computed(() => levels[level.value]);

export function useLevel() {
  return { level, levelData, nextLevel };
}
