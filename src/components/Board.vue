<script setup lang="ts">
import {computed, onMounted, onUnmounted} from "vue";
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

const onKeyUp = event => {
  if( !boardState.activePart ) {
    return;
  }

  switch( event.key ) {
    case "d":
    case "ArrowRight":
      moveRight();
      break;
    case "a":
    case "ArrowLeft":
      moveLeft();
      break;
    case "w":
    case "ArrowUp":
      moveUp();
      break;
    case "s":
    case "ArrowDown":
      moveDown();
      break;
    case " ":
      rotate();
      break;
    case "Escape":
      activateOrDeactivatePart( boardState.activePart.typeNumber );
      break;
    case "Enter":
      break;
    default:
      break;
  }
}

onMounted( () => {
  document.addEventListener('keyup', onKeyUp );
} );

onUnmounted(() => {
  document.removeEventListener('keyup', onKeyUp );
});

</script>

<template>
  <div :class="['board', className]">
    <template v-for="(row, rowIndex) in boardState.board" :key="rowIndex">
      <div v-for="(column, columnIndex) in row" :key="columnIndex" class="cell">
        <template v-for="(cell, index) in column" :key="index">
          <Cell
            :row="rowIndex"
            :column="columnIndex"
            :value="cell"
            :underlying-cell-value="index === 1 ? column[0] : null"
            :movable="index === 1"
            :active="
              index === 0 &&
              boardState.activePart?.typeNumber === Math.abs(cell)
            "
            :solved="index === 1 && column[0] === 1 && column[0] + cell < 0"
            @click="index === 0 ? activateOrDeactivatePart(column[0]) : activateOrDeactivatePart(Math.abs(cell))"
          />
        </template>
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
  grid-template-columns: repeat(5, 50px);
  grid-template-rows: repeat(5, 50px);
  width: fit-content;
}

.board .cell {
  position: relative;
  font-size: 30px;
}
</style>
