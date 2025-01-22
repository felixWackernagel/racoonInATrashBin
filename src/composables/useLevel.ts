import { ref, type Ref } from "vue";

const level: Ref<number, number> = ref(1);

export function useLevel() {
  return { level };
}
