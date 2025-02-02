<script setup lang="ts">
import { computed, defineProps } from "vue";
import { useBoard } from "@/composables/useBoard";
import Cell from "@/components/Cell.vue";
import { onMounted, onUnmounted } from "vue";

interface Props {
  level: number;
}

const props = defineProps<Props>();

const {
  board,
  activePart,
  activateOrDeactivatePart,
  moveUp,
  moveDown,
  moveLeft,
  moveRight,
  rotate,
  place,
  nextPart,
} = useBoard(() => props.level);

const className = computed(() => `level-${props.level.toString()}`);

const onKeyUp = (event: KeyboardEvent) => {
  if (!activePart.value) {
    return;
  }

  switch (event.key) {
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
      activateOrDeactivatePart(null);
      break;
    case "Enter":
      place();
      break;
    default:
      break;
  }
};

onMounted(() => {
  document.addEventListener("keyup", onKeyUp);
});

onUnmounted(() => {
  document.removeEventListener("keyup", onKeyUp);
});
</script>

<template>
  <div class="display">
    <div :class="['board', className]">
      <template v-for="(row, rowIndex) in board" :key="rowIndex">
        <template v-for="(column, columnIndex) in row" :key="columnIndex">
          <Cell
            :row="rowIndex"
            :column="columnIndex"
            :value="column"
            @click="activateOrDeactivatePart(column)"
          />
        </template>
      </template>
    </div>
    <h1>Racoon in a trash bin</h1>
  </div>
  <div class="controller">
    <div class="controller__section">
      <div class="btn btn--center"></div>
      <button
          class="btn btn--left"
          @click="moveLeft"
          :disabled="activePart == null"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m8.165 11.63l6.63-6.43C15.21 4.799 16 5.042 16 5.57v12.86c0 .528-.79.771-1.205.37l-6.63-6.43a.499.499 0 0 1 0-.74Z"/></svg>
      </button>
      <button
        class="btn btn--top"
        @click="moveUp"
        :disabled="activePart == null"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12.37 8.165l6.43 6.63c.401.414.158 1.205-.37 1.205H5.57c-.528 0-.771-.79-.37-1.205l6.43-6.63a.499.499 0 0 1 .74 0Z"/></svg>
      </button>
      <button
        class="btn btn--bottom"
        @click="moveDown"
        :disabled="activePart == null"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12.37 15.835l6.43-6.63C19.201 8.79 18.958 8 18.43 8H5.57c-.528 0-.771.79-.37 1.205l6.43 6.63c.213.22.527.22.74 0Z"/></svg>
      </button>
      <button
        class="btn btn--right"
        @click="moveRight"
        :disabled="activePart == null"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.835 11.63L9.205 5.2C8.79 4.799 8 5.042 8 5.57v12.86c0 .528.79.771 1.205.37l6.63-6.43a.498.498 0 0 0 0-.74Z"/></svg>
      </button>
    </div>
    <div class="controller__section">
      <button
        class="btn btn--right btn--round"
        @click="rotate"
        :disabled="activePart == null"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M18.258 3.508a.75.75 0 0 1 .463.693v4.243a.75.75 0 0 1-.75.75h-4.243a.75.75 0 0 1-.53-1.28L14.8 6.31a7.25 7.25 0 1 0 4.393 5.783a.75.75 0 0 1 1.488-.187A8.75 8.75 0 1 1 15.93 5.18l1.51-1.51a.75.75 0 0 1 .817-.162Z"
          />
        </svg>
      </button>
      <button
        class="btn btn--left btn--round"
        @click="place"
        :disabled="activePart == null"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
          >
            <path
              d="M3 15c0 2.828 0 4.243.879 5.121C4.757 21 6.172 21 9 21h6c2.828 0 4.243 0 5.121-.879C21 19.243 21 17.828 21 15"
              opacity=".5"
            />
            <path d="M12 3v13m0 0l4-4.375M12 16l-4-4.375" />
          </g>
        </svg>
      </button>
      <button class="btn btn--bottom btn--round" @click="nextPart">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
        >
          <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
          >
            <path d="M18 8H6m0 0l4.125-4M6 8l4.125 4" />
            <path d="M6 16h12m0 0l-4.125-4M18 16l-4.125 4" opacity=".5" />
          </g>
        </svg>
      </button>
      <button
          class="btn btn--top btn--round"
          @click="activateOrDeactivatePart(null)"
          :disabled="activePart == null"
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 16 16"
        >
          <path
              fill="currentColor"
              d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94z"
          />
        </svg>
      </button>
    </div>
    <div class="legend">
      <span class="position--top">W</span>
      <span class="position--right">D</span>
      <span class="position--bottom">S</span>
      <span class="position--left">A</span>
    </div>
  </div>
</template>

<style>
:root {
  --cell-size: 50px;
  --icon-size: 30px;
}

/* @media screen and (min-width: 768px) {
  :root {
    --cell-size: 75px;
    --icon-size: 50px;
  }
} */

.display {
  background-color: #595959;
  border: 2px solid #000;
  border-radius: 4px;
  align-self: center;
  padding: 20px 20px 10px 20px;
  margin-top: 20px;
}

h1 {
  margin: 0;
  padding: 10px 0 0 0;
  color: #fff;
  font-size: 18px;
  text-align: center;
  text-transform: uppercase;
  font-family: monospace;
}

.board {
  display: grid;
  grid-template-columns: repeat(5, var(--cell-size));
  grid-template-rows: repeat(5, var(--cell-size));
  width: fit-content;
  font-size: var(--icon-size);
}

.controller {
  max-width: 294px;
  align-self: center;
  display: grid;
  grid-template-columns: repeat(2, 120px);
  grid-template-rows: 120px;
  gap: 54px;
  padding-top: 20px;
}

.controller__section {
  position: relative;
}

.btn {
  position: absolute;

  cursor: pointer;
  margin: 0;
  width: 40px;
  height: 40px;
  border: 1px solid #000000;
  border-radius: 4px;
  background-color: #bababa;

  display: flex;
  justify-content: center;
  align-items: center;
}

.btn--round {
  border-radius: 50% !important;
  width: 45px;
  height: 45px;
  border-width: 1px !important;
}

.btn:not(.btn--center):hover {
  background-color: #9a9a9a;
}

.btn:not(.btn--center):active {
  background-color: #737373;
}

.btn[disabled] {
  pointer-events: none;
}

.btn--top {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  border-bottom-width: 0;
}

.btn--right {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left-width: 0;
}

.btn--bottom {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-top-width: 0;
}

.btn--left {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right-width: 0;
}

.btn--center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 0;
  border: none;
  pointer-events: none;
}

.legend {
  height: 160px;
  background-color: rgba(0, 0, 0, 0.2);
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
}

.legend > span {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
}

.position--top {

}

.position--right {

}

.position--bottom {

}

.position--left {

}
</style>
