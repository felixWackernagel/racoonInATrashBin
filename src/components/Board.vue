<script setup lang="ts">
import { computed } from "vue";
import { useLevel } from "@/composables/useLevel";
import { useBoard } from "@/composables/useBoard";

const { level } = useLevel();
const { boardState, selectPiece } = useBoard();

const className = computed(() => `level-${level.value.toString()}`);

function rotate() {}
function left() {}
function top() {}
function bottom() {}
function right() {}
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
            }"
            @click="selectPiece(column)"
          >
            {{ column === 1 ? "🦝" : column < 0 ? "🗑️" : "" }}
          </div>
        </div>
      </div>
    </template>
  </div>
  <div class="controls">
    <button @click="rotate">Rotate</button>
    <button @click="left">Left</button>
    <button @click="top">Top</button>
    <button @click="bottom">Bottom</button>
    <button @click="right">Right</button>
  </div>
</template>

<style>
.board {
  display: grid;
  grid-template-columns: repeat(5, 48px);
  grid-template-rows: repeat(5, 48px);
  border: 1px solid black;
  width: fit-content;
}

.board .cell {
  border: 1px solid black;
  position: relative;
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
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}

.racoon,
.empty {
  pointer-events: none;
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
  background-color: #727d73;
}

.block--b {
  background-color: #aab99a;
}

.block--c {
  background-color: #d0ddd0;
}

.block--d {
  background-color: #b26bb7;
}
</style>
