<script setup lang="ts">
interface Props {
  value: number;
  conflict: boolean;
  moveable: boolean;
  active: boolean;
  solved: boolean;
}
const props = defineProps<Props>();
</script>

<template>
  <div
    :class="{
      racoon: value === 1,
      'trash-bin': value < 0,
      empty: value === 0,
      block: Math.abs(value) > 1,
      'block--a': Math.abs(value) === 2,
      'block--b': Math.abs(value) === 3,
      'block--c': Math.abs(value) === 4,
      'block--d': Math.abs(value) === 5,
      'block--conflict': conflict,
      'block--moveable': moveable,
      'block--active': active,
    }"
  >
    {{ solved ? "🍔" : value === 1 ? "🦝" : value < 0 ? "🛢️" : "" }}
  </div>
</template>

<style>
.racoon,
.empty {
  pointer-events: none;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.block {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
  opacity: 0;
}

.block--conflict {
  background-color: #eb5a3c;
}

.block--moveable {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  box-shadow: inset 0 0 0 2px #ff9d23;
}
</style>
