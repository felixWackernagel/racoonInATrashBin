<script setup lang="ts">
import type { Block } from "@/types";
import { computed } from "vue";

interface Props {
  row: number;
  column: number;
  value: Block;
}
const props = defineProps<Props>();

const solved = computed(() => {
  if (props.value.conflictingBlock === null) {
    return false;
  }

  return props.value.conflictingBlock.type === "r" && props.value.isTrashBin;
});

const conflict = computed(() => {
  if (props.value.conflictingBlock === null) {
    return false;
  }

  return (
    props.value.isActive &&
    !solved.value &&
    props.value.conflictingBlock.type !== props.value.type
  );
});

const symbol = computed(() => {
  if (solved.value) return "📦";
  if (props.value.type === "r") return "🦝";
  if (props.value.isTrashBin) return "🪤";
  if (conflict.value) return "❌";
  return "";
});
</script>

<template>
  <div
    :class="{
      block: true,
      'block--racoon': value.type === 'r',
      'trash-bin': value.isTrashBin,
      'block--empty': value.type === 'e',
      'block--a': value.type === 'a',
      'block--b': value.type === 'b',
      'block--c': value.type === 'c',
      'block--d': value.type === 'd',
      'block--movable': value.isActive,
    }"
  >
    {{ symbol }}
  </div>
</template>

<style lang="scss">
.block {
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  position: relative;
  box-shadow: inset 0 0 10px 0 $colorBlockScrim;

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid var(--border-color);
  }
}

.block--racoon,
.block--empty {
  pointer-events: none;
  background-color: $colorNonBlock;
}

.block--a {
  background-color: $colorBlockA;
}

.block--b {
  background-color: $colorBlockB;
}

.block--c {
  background-color: $colorBlockC;
}

.block--d {
  background-color: $colorBlockD;
}

.block--a:has(~ .block--a:hover),
.block--a:hover ~ .block--a,
.block--b:has(~ .block--b:hover),
.block--b:hover ~ .block--b,
.block--c:has(~ .block--c:hover),
.block--c:hover ~ .block--c,
.block--d:has(~ .block--d:hover),
.block--d:hover ~ .block--d,
.block:not(.block--racoon):not(.block--empty):hover,
.block--movable {
  --border-color: #{$colorBlockBorder};
}
</style>
