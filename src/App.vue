<script setup lang="ts">
import Board from "@/components/Board.vue";
import Controller from "@/components/Controller.vue";
import { useLevel } from "@/composables/useLevel";

const { level } = useLevel();
</script>

<template>
  <select
    v-model="level"
    name="level-select"
    id="level-select"
    class="level-select"
  >
    <option v-for="lv in 50" :value="lv" :key="lv" :disabled="lv > 2">
      Level {{ lv.toString() }}
    </option>
  </select>

  <Board :level="level" />

  <!-- <Controller /> -->
</template>
