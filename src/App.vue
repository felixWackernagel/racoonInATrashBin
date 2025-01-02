<script setup lang="ts">
import Board from "./components/Board.vue";
import { useGame } from "./composables/useGame";

const { board } = useGame();
</script>

<template>
  <Board currentBoard="{board}"></Board>
</template>

<style scoped></style>
