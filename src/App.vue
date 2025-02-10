<script setup lang="ts">
import Board from "@/components/Board.vue";
import { useLevel } from "@/composables/useLevel";
import { levels } from "./levels";

const { level, levelData } = useLevel();
const levelCount = levels.length;
const hasTouchScreenSupport = window.matchMedia("(hover: none)").matches;
</script>

<template>
  <select
    v-model="level"
    name="level-select"
    id="level-select"
    class="level-select"
  >
    <option v-for="lv in levelCount" :value="lv" :key="lv">
      Level {{ lv.toString() }} ({{ levelData.difficulty }} -
      {{ levelData.turns }})
    </option>
  </select>

  <div
    :class="{
      game: true,
      'game--touch': hasTouchScreenSupport,
    }"
  >
    <Board :level="level" />
  </div>
</template>
<style lang="scss">
select {
  border-radius: 0;
  border: none;
  padding-top: 6px;
  padding-bottom: 6px;
  font-size: 16px;
  text-align: center;
}

.game {
  background: $gradientBackground;
  display: flex;
  flex-direction: column;
  flex: 1;
  border-top: 2px solid $colorBlack;
}
</style>
