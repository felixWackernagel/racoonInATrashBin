<script setup lang="ts">
import { computed, defineProps } from "vue";
import { useBoard } from "@/composables/useBoard";
import { useLevel } from "@/composables/useLevel";
import Cell from "@/components/Cell.vue";
import { onMounted, onUnmounted } from "vue";
import { levels } from "@/levels";
import Icon from "@/components/Icon.vue";

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
  levelSolved,
} = useBoard(() => props.level);

const { nextLevel, levelData } = useLevel();

const levelCount: number = levels.length;
const className = computed(() => `level-${props.level.toString()}`);

const onKeyUp = (event: KeyboardEvent) => {
  if (!activePart.value) {
    if (event.key === "ö" && !levelSolved.value) {
      nextPart();
    }

    return;
  }

  switch (event.key) {
    case "d":
      moveRight();
      break;
    case "a":
      moveLeft();
      break;
    case "w":
      moveUp();
      break;
    case "s":
      moveDown();
      break;
    case "ä":
      rotate();
      break;
    case "p":
      activateOrDeactivatePart(null);
      break;
    case "l":
      place();
      break;
    case "ö":
      nextPart();
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
    <div v-if="levelSolved" class="level-solved">
      <p>🦝 💚 {{ levelData.collectable }}</p>
      <p>Geschafft</p>
      <button type="button" v-if="level < levelCount" @click="nextLevel">
        Weiter
        <Icon name="arrow-right" />
      </button>
    </div>
    <div v-else :class="['board', className]">
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
    <h1>It's a trap</h1>
  </div>
  <div class="controller">
    <div class="controller__section">
      <div class="legend">
        <span class="key position--top">W</span>
        <span class="key position--right">D</span>
        <span class="key position--bottom">S</span>
        <span class="key position--left">A</span>
      </div>
      <div class="btn btn--center"></div>
      <button
        class="btn btn--left"
        @click="moveLeft"
        :disabled="activePart == null"
      >
        <Icon name="triangle-left" />
      </button>
      <button
        class="btn btn--top"
        @click="moveUp"
        :disabled="activePart == null"
      >
        <Icon name="triangle-up" />
      </button>
      <button
        class="btn btn--bottom"
        @click="moveDown"
        :disabled="activePart == null"
      >
        <Icon name="triangle-down" />
      </button>
      <button
        class="btn btn--right"
        @click="moveRight"
        :disabled="activePart == null"
      >
        <Icon name="triangle-right" />
      </button>
    </div>
    <div class="controller__section">
      <div class="legend">
        <span class="key position--top">P</span>
        <span class="key position--right">Ä</span>
        <span class="key position--bottom">Ö</span>
        <span class="key position--left">L</span>
      </div>
      <button
        class="btn btn--right btn--round"
        @click="rotate"
        :disabled="activePart == null"
      >
        <Icon name="arrow-circle" />
      </button>
      <button
        class="btn btn--left btn--round"
        @click="place"
        :disabled="activePart == null"
      >
        <Icon name="arrow-in" />
      </button>
      <button
        class="btn btn--bottom btn--round"
        @click="nextPart"
        :disabled="levelSolved"
      >
        <Icon name="arrow-exchange" />
      </button>
      <button
        class="btn btn--top btn--round"
        @click="activateOrDeactivatePart(null)"
        :disabled="activePart == null"
      >
        <Icon name="delete" />
      </button>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --border-color: ${colorBlockBorderInactive};
}

.display {
  background-color: $colorDisplay;
  border: 2px solid $colorBlack;
  border-radius: 4px;
  align-self: center;
  padding: 20px 20px 10px 20px;
  margin-top: 20px;
}

.level-solved {
  width: ($integerColumns * $sizeCell) +
    (($integerColumns - 1) * $sizeBlockBorder);
  height: ($integerRows * $sizeCell) + (($integerRows - 1) * $sizeBlockBorder);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border: $sizeBlockBorder solid $colorBlack;
  background-color: $colorWhite;

  font-size: 18px;
  font-family: monospace;

  button {
    cursor: pointer;
    text-transform: capitalize;
    font-size: 16px;
    padding: 6px 12px;
    border-radius: 4px;
    border: 1px solid $colorBlack;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  p {
    margin: 0 0 16px 0;

    &:first-child {
      font-size: $sizeEmoji;
    }
  }
}

h1 {
  margin: 0;
  padding: 10px 0 0 0;
  color: $colorWhite;
  font-size: 18px;
  text-align: center;
  text-transform: uppercase;
  font-family: monospace;
}

.board {
  display: grid;
  grid-template-columns: repeat($integerColumns, $sizeCell);
  grid-template-rows: repeat($integerRows, $sizeCell);
  width: fit-content;
  font-size: $sizeEmoji;
  padding: $sizeBlockBorder;
  gap: $sizeBlockBorder;
  background-color: $colorBlack;
}

.controller {
  max-width: 294px;
  align-self: center;
  display: grid;
  grid-template-columns: repeat(2, 120px);
  grid-template-rows: 120px;
  gap: 54px;
  margin-top: 40px;
}

.controller__section {
  position: relative;
}

.btn {
  position: absolute;

  cursor: pointer;
  margin: 0;
  width: $sizeGamePadButton;
  height: $sizeGamePadButton;
  border: $sizeGamePadButtonBorder solid $colorBlack;
  border-radius: 4px;
  background-color: $colorGamePadButton;

  display: flex;
  justify-content: center;
  align-items: center;
}

.btn--round {
  border-radius: 50% !important;
  width: $sizeGamePadButtonRound;
  height: $sizeGamePadButtonRound;
  border-width: $sizeGamePadButtonBorder !important;
}

.btn:not(.btn--center):hover {
  background-color: $colorGamePadButtonHover;
}

.btn:not(.btn--center):active {
  background-color: $colorGamePadButtonActive;
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
  background-color: $colorGamePad;
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  border-radius: 50%;

  span {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
  }
}

.position--top {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.position--right {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}

.position--bottom {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.position--left {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

.key {
  font-size: 16px;
  font-weight: bold;
  font-family: monospace;
  color: $colorShortcutKey;
}

.game--touch .key {
  display: none;
}
</style>
