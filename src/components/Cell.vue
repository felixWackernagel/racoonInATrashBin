<script setup lang="ts">
import {computed} from "vue";

interface Props {
  row: number;
  column: number;
  value: number;
  movable: boolean;
  underlyingCellValue?: number;
  active: boolean;
  solved: boolean;
}
const props = defineProps<Props>();

const conflict = computed(() => {
  return props.movable && !props.solved &&
  Math.abs( props.underlyingCellValue ) >= 1 &&
  Math.abs(props.underlyingCellValue) !== Math.abs(props.value)
});
</script>

<template>
  <div
    :class="{
      block: true,
      'block--racoon': value === 1,
      'trash-bin': value < 0,
      'block--empty': value === 0,
      'block--a': Math.abs(value) === 2,
      'block--b': Math.abs(value) === 3,
      'block--c': Math.abs(value) === 4,
      'block--d': Math.abs(value) === 5,
      'block--conflict': conflict,
      'block--movable': movable,
      'block--active': active,
      'edge--top': row === 0,
      'edge--right': column === 4,
      'edge--bottom': row === 4,
      'edge--left': column === 0
    }"
  >
    {{ solved ? "🍔" : value === 1 ? "🦝" : value < 0 ? "🛢️" : "" }}
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

.block--active {
  background-color: transparent;
  font-size: 0;
  pointer-events: none;
}

.block--conflict {
  background-color: #eb5a3c;
  opacity: 0.5;
}

.block--movable {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
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
