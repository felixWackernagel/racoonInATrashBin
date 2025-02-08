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
    {{
      solved
        ? "📦"
        : value.type === "r"
          ? "🦝"
          : value.isTrashBin
            ? "🪤"
            : conflict
              ? "❌"
              : ""
    }}
  </div>
</template>

<style>
.block {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
  position: relative;
  box-shadow: inset 0 0 10px 0 rgba(255, 255, 255, 0.4);
}

.block::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid var(--border-color);
}

.block--racoon,
.block--empty {
  pointer-events: none;
  background-color: #fff;
}

.block--a {
  background-color: #578fca;
}

.block--b {
  background-color: #809d3c;
}

.block--c {
  background-color: #d2665a;
}

.block--d {
  background-color: #8174a0;
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
  --border-color: #fada7a;
}

</style>
