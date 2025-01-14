<script setup lang="ts">
import { computed } from "vue";
import { useLevel } from "@/composables/useLevel";
import { useBoard } from "@/composables/useBoard";

const { level } = useLevel();
const { boardState, selectPiece, moveUp, moveDown, moveLeft, moveRight, rotate } = useBoard();

const className = computed(() => `level-${level.value.toString()}`);

</script>

<template>
  <div :class="['board', className]">
    <template v-for="(row, rowIndex) in boardState.board" :key="rowIndex">
      <div v-for="(column, columnIndex) in row" :key="columnIndex" class="cell">
        <div class="content">
          <div
            :class="{
              racoon: column === 1,
              'trash-bin': column < 0,
              empty: column === 0,
              block: Math.abs(column) > 1,
              'block--a': Math.abs(column) === 2,
              'block--b': Math.abs(column) === 3,
              'block--c': Math.abs(column) === 4,
              'block--d': Math.abs(column) === 5,
              'block--active': Math.abs(column) === boardState.selectedPiece
            }"
            @click="selectPiece(column)"
          >
            {{ column === 1 ? "🦝" : column < 0 ? "🗑️" : "" }}
          </div>
        </div>
      </div>
    </template>
  </div>
  <div v-if="boardState.selectedPiece" class="controls">
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
  border: 1px solid #3f3f3f;
  width: fit-content;
}

.board .cell {
  position: relative;
  border: 1px solid #3f3f3f;
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
  background-color: #5D8736;
}

.block--b {
  background-color: #809D3C;
}

.block--c {
  background-color: #A9C46C;
}

.block--d {
  background-color: #F4FFC3;
}

.block--active {
  background-color: #EB5A3C;
}
</style>
