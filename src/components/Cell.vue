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
    !solved &&
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
      'block--empty': value.type == 'e',
      'block--a': value.type === 'a',
      'block--b': value.type === 'b',
      'block--c': value.type === 'c',
      'block--d': value.type === 'd',
      'block--conflict': conflict,
      'block--movable': value.isActive,
      'edge--top': row === 0,
      'edge--right': column === 4,
      'edge--bottom': row === 4,
      'edge--left': column === 0,
    }"
  >
    {{
      solved ? "🛢️" : value.type === "r" ? "🦝" : value.isTrashBin ? "🛢️" : ""
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
  border: 1px solid #3f3f3f;
  box-sizing: border-box;
}

.block--racoon,
.block--empty {
  pointer-events: none;
  background-color: #fff;
}

.block--a {
  background-color: #5d8736;
}

.block--b {
  background-color: #809d3c;
}

.block--c {
  background-color: #a9c46c;
}

.block--d {
  background-color: #f4ffc3;
}

.block--conflict {
  background-color: #eb5a3c;
  opacity: 0.5;
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
  box-shadow: inset 0 0 0 2px #ff9d23;
}

.edge--left {
  border-left-width: 2px;
}

.edge--right {
  border-right-width: 2px;
}

.edge--top {
  border-top-width: 2px;
}

.edge--bottom {
  border-bottom-width: 2px;
}
</style>
