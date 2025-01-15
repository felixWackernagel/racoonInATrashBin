<script setup lang="ts">
import { computed } from "vue";
import { useLevel } from "@/composables/useLevel";
import { useBoard } from "@/composables/useBoard";
import Cell from "@/components/Cell.vue";

const { level } = useLevel();
const {
  boardState,
  activateOrDeactivatePart,
  moveUp,
  moveDown,
  moveLeft,
  moveRight,
  rotate,
} = useBoard();

const className = computed(() => `level-${level.value.toString()}`);
</script>

<template>
  <div :class="['board', className]">
    <template v-for="(row, rowIndex) in boardState.board" :key="rowIndex">
      <div v-for="(column, columnIndex) in row" :key="columnIndex" class="cell">
        <div class="content">
          <template v-for="(cell, index) in column" :key="index">
            <Cell
              :value="cell"
              :conflict="
                index == 1 &&
                Math.abs(column[0]) > 1 &&
                Math.abs(column[0]) != Math.abs(cell)
              "
              :moveable="index == 1"
              :active="
                index == 0 &&
                boardState.activePart?.typeNumber === Math.abs(cell)
              "
              :solved="index == 1 && column[0] === 1 && column[0] + cell < 0"
              @click="index === 0 && activateOrDeactivatePart(column[0])"
            />
          </template>
        </div>
      </div>
    </template>
  </div>
  <div v-if="boardState.activePart" class="controls">
    <button @click="rotate">Rotate</button>
    <button @click="moveLeft">Left</button>
    <button @click="moveUp">Top</button>
    <button @click="moveDown">Bottom</button>
    <button @click="moveRight">Right</button>
  </div>
</template>

<style>
.board {
  display: grid;
  grid-template-columns: repeat(5, 48px);
  grid-template-rows: repeat(5, 48px);
  width: fit-content;
}

.board .cell {
  position: relative;
  border: 1px solid #3f3f3f;
}

.board .cell:nth-child(5n-4) {
  border-left-width: 2px;
}

.board .cell:nth-child(5n) {
  border-right-width: 2px;
}

.board .cell:nth-child(-n + 5) {
  border-top-width: 2px;
}

.board .cell:nth-child(n + 21) {
  border-bottom-width: 2px;
}

.board .cell::before {
  content: "";
  display: block;
  padding-top: 100%;
}

.board .cell .content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 30px;
}
</style>
