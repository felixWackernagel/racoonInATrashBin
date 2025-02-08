<script setup lang="ts">
import Board from "@/components/Board.vue";
import { useLevel } from "@/composables/useLevel";

const { level } = useLevel();
const mql: MediaQueryList = window.matchMedia('(hover: none)');
const isTouchScreen = mql.matches;

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

  <div :class="{
    game: true,
    'game--touch': isTouchScreen,
  }">
    <Board :level="level" />
  </div>
</template>
<style lang="scss">
$black: #000;

select {
  border-radius: 0;
  border: none;
  padding-top: 6px;
  padding-bottom: 6px;
  font-size: 16px;
  text-align: center;
}

.game {
  background: linear-gradient(28deg, #2e0b87, #4080cf);
  display: flex;
  flex-direction: column;
  flex: 1;
  border-top: 2px solid $black;
}
</style>
