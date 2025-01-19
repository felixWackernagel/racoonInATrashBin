<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { useLevel } from "@/composables/useLevel";
import { useBoard } from "@/composables/useBoard";
import Cell from "@/components/Cell.vue";

const { level } = useLevel();
const { boardState, activateOrDeactivatePart } = useBoard();

const className = computed(() => `level-${level.value.toString()}`);
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
            @click="
              index === 0
                ? activateOrDeactivatePart(column[0])
                : activateOrDeactivatePart(Math.abs(cell))
            "
          />
        </template>
      </div>
    </template>
  </div>
</template>

<style>
:root {
  --cell-size: 50px;
  --icon-size: 30px;
}

@media screen and (min-width: 768px) {
  :root {
    --cell-size: 75px;
    --icon-size: 50px;
  }
}

.board {
  display: grid;
  grid-template-columns: repeat(5, var(--cell-size));
  grid-template-rows: repeat(5, var(--cell-size));
  width: fit-content;
}

.board .cell {
  position: relative;
  font-size: var(--icon-size);
}
</style>
