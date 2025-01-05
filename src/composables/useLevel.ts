import { computed, reactive, ref } from "vue";
import { levels } from "@/levels";

const level = ref(1);
const board = computed(() => levels[level.value - 1]);

export function useLevel() {
  return { level, board };
}
