<script setup lang="ts">
import { computed } from "vue";
import { useLevel } from "@/composables/useLevel";

const { level, board } = useLevel();

const className = computed(() => `level-${level.value.toString()}`);
</script>

<template>
  <div :class="['board', className]">
    <div v-for="cell in 25" :key="cell" class="cell">
      <div class="content">
        <span v-if="board.racoons.includes(cell)" class="racoon">🦝</span>
      </div>
    </div>
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
</style>
