<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useBoard } from "@/composables/useBoard";

const {
  boardState,
  activateOrDeactivatePart,
  moveUp,
  moveDown,
  moveLeft,
  moveRight,
  rotate,
  place,
} = useBoard();

const onKeyUp = (event: KeyboardEvent) => {
  if (!boardState.activePart) {
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
      activateOrDeactivatePart(boardState.activePart.typeNumber);
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
  <div v-if="boardState.activePart" class="controller">
    <div class="controller--left">
      <button class="btn btn--top" @click="rotate">
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
      <button class="btn btn--bottom" @click="place">
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
    </div>
    <div class="controller--right">
      <button class="btn btn--left" @click="moveLeft">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m8.165 11.63l6.63-6.43C15.21 4.799 16 5.042 16 5.57v12.86c0 .528-.79.771-1.205.37l-6.63-6.43a.499.499 0 0 1 0-.74Z"
          />
        </svg>
      </button>
      <button class="btn btn--top" @click="moveUp">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m12.37 8.165l6.43 6.63c.401.414.158 1.205-.37 1.205H5.57c-.528 0-.771-.79-.37-1.205l6.43-6.63a.499.499 0 0 1 .74 0Z"
          />
        </svg>
      </button>
      <button class="btn btn--bottom" @click="moveDown">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m12.37 15.835l6.43-6.63C19.201 8.79 18.958 8 18.43 8H5.57c-.528 0-.771.79-.37 1.205l6.43 6.63c.213.22.527.22.74 0Z"
          />
        </svg>
      </button>
      <button class="btn btn--right" @click="moveRight">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M15.835 11.63L9.205 5.2C8.79 4.799 8 5.042 8 5.57v12.86c0 .528.79.771 1.205.37l6.63-6.43a.498.498 0 0 0 0-.74Z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style>
.controller {
  display: grid;
  grid-template-columns: repeat(2, 150px);
  grid-template-rows: 150px;
}

.controller--left {
  position: relative;
}

.controller--right {
  position: relative;
}

.btn {
  position: absolute;
  background-color: #cccccc;
  border: none;
  margin: 0;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 3px solid #333;
}

.btn:hover {
  border-bottom-width: 1px;
  border-top: 2px solid #cccccc;
  background-color: #b6b5b5;
}

.btn--top {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.btn--right {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}

.btn--bottom {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.btn--left {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}
</style>
