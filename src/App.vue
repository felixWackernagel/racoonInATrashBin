<script setup lang="ts">
import Board from "@/components/Board.vue";
import { useLevel } from "@/composables/useLevel";
import { levels } from "./levels";

const { level } = useLevel();

// the first level in levels means "the game is off"
const levelCount = levels.length - 1;
</script>

<template>
  <select v-model="level" name="level-select">
    <option value="0" disabled>Select a Level</option>
    <option v-for="lv in levelCount" :value="lv" :key="lv">
      Level {{ lv.toString() }} ({{ levels[lv].difficulty }} -
      {{ levels[lv].turns }})
    </option>
  </select>

  <div class="game">
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
