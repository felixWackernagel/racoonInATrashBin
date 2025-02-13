import { levels } from "@/levels";
import type { Block, Part } from "@/types";
import { MODELS } from "@/types";
import { ref, watch } from "vue";
import { useBlocks } from "@/composables/useBlocks";

const { emptyBlock, typedBlock } = useBlocks();

export function useBoard(level: () => number) {
  const board = ref<Block[][]>([]);
  const parts = ref<Part[]>([]);
  const activePart = ref<Part | null>(null);
  const levelSolved = ref<boolean>(false);

  const positionToCoordinates = (cell: number): number[] => {
    let row = cell <= 5 ? 0 : (cell - (cell % 5)) / 5;
    let column = (cell <= 5 ? cell : cell % 5) - 1;
    return [row, column];
  };

  const modelToCoordinates = (shape: number[][]): number[][] => {
    let coordinates = [];

    let rows = shape.length;
    let columns = shape[0].length;

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        let cell = shape[row][column];
        if (cell > 0) {
          coordinates.push([row, column, cell]);
        }
      }
    }

    return coordinates;
  };

  const emptyBoard = (): void => {
    const array = [];
    for (let row = 0; row < 5; row++) {
      const rows: Block[] = [];
      for (let column = 0; column < 5; column++) {
        rows.push(emptyBlock());
      }
      array.push(rows);
    }
    board.value = array;
  };

  const drawPart = (part: Part, active: boolean) => {
    let model = MODELS[part.type];
    for (let rotation = 0; rotation < part.rotations; rotation++) {
      model = rotateClockwise(model);
    }
    let startCoordinates = positionToCoordinates(part.position);
    let modelCoordinates = modelToCoordinates(model);

    modelCoordinates.forEach(
      ([row, column, cell]: [number, number, number]) => {
        let x = row + startCoordinates[0];
        let y = column + startCoordinates[1];
        let isTrashBin = cell === 2;
        let underlyingBlock = board.value[x][y];
        board.value[x][y] = typedBlock(
          part.type,
          isTrashBin,
          active,
          underlyingBlock.type === "e" ? null : underlyingBlock
        );
      }
    );
  };

  const drawBoard = () => {
    emptyBoard();

    // draw racoons
    parts.value
      .filter((part) => part.type === "r")
      .forEach((part) => drawPart(part, false));

    // draw parts without active one
    let active = activePart.value;
    parts.value
      .filter((part) => {
        if (part.type === "r") return false;

        if (active) {
          return part.type !== active.type;
        }

        return true;
      })
      .forEach((part) => drawPart(part, false));

    // draw active part
    if (active) {
      drawPart(active, true);
    }

    updateLevelSolved();
  };

  /**
   * Rotates a Block element clockwise (90 degree).
   * The count of row and column is swapped.
   *
   * 0 1 0    1 0
   * 1 1 1 => 1 1
   *          1 0
   *
   * @param block
   * @returns rotated block
   */
  const rotateClockwise = (block: number[][]): number[][] => {
    const rows = block.length;
    const columns = block[0].length;

    const rotated = Array(columns)
      .fill(null)
      .map(() => Array(rows).fill(0));

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        rotated[column][rows - 1 - row] = block[row][column];
      }
    }
    return rotated;
  };

  const activatePart = (part: Part): void => {
    activePart.value = { ...part };
  };

  const deactivatePart = () => {
    activePart.value = null;
  };

  const activateOrDeactivatePart = (block: Block | null): void => {
    if (block) {
      if (block.type === "r" || block.type === "e") {
        return;
      }

      const part = parts.value.find((part) => part.type === block.type);
      if (!part) {
        return;
      }

      if (activePart.value === null || activePart.value.type !== part.type) {
        activatePart(part);
      } else {
        deactivatePart();
      }
    } else {
      deactivatePart();
    }

    drawBoard();
  };

  const moveUp = () => {
    const active = activePart.value;
    if (!active) {
      return;
    }

    if (active.position <= 5) {
      return;
    }

    active.position = active.position - 5;

    drawBoard();
  };

  const moveDown = () => {
    const active = activePart.value;
    if (!active) {
      return;
    }

    let model = MODELS[active.type];
    for (let rotation = 0; rotation < active.rotations; rotation++) {
      model = rotateClockwise(model);
    }
    let modelHeight = model.length - 1;

    if (active.position + modelHeight * 5 > 20) {
      return;
    }

    active.position = active.position + 5;

    drawBoard();
  };

  const moveLeft = () => {
    const active = activePart.value;
    if (!active) {
      return;
    }

    if (active.position % 5 <= 1) {
      return;
    }

    active.position = active.position - 1;

    drawBoard();
  };

  const moveRight = () => {
    const active = activePart.value;
    if (!active) {
      return;
    }

    let model = MODELS[active.type];
    for (let rotation = 0; rotation < active.rotations; rotation++) {
      model = rotateClockwise(model);
    }
    let modelWidth = model[0].length - 1;

    if ((active.position % 5) + modelWidth >= 5) {
      return;
    }

    active.position = active.position + 1;

    drawBoard();
  };

  const rotate = () => {
    const active = activePart.value;
    if (!active) {
      return;
    }

    active.rotations = (active.rotations + 1) % 4;
    let model = MODELS[active.type];
    for (let rotation = 0; rotation < active.rotations; rotation++) {
      model = rotateClockwise(model);
    }
    let modelHeight = model.length - 1;
    let modelWidth = model[0].length - 1;
    let coordinates = positionToCoordinates(active.position);

    if (coordinates[0] + modelHeight > 4) {
      let diff = coordinates[0] + modelHeight - 4;
      active.position = active.position - diff * 5;
    }

    if (coordinates[1] + modelWidth > 4) {
      let diff = coordinates[1] + modelWidth - 4;
      active.position = active.position - diff;
    }

    drawBoard();
  };

  const place = () => {
    const active = activePart.value;
    if (!active) {
      return;
    }

    const hasConflict = board.value
      .flat(1)
      .filter((block) => block.isActive && block.conflictingBlock != null)
      .some((block) => {
        const isRacoonInTrashBin =
          block.isTrashBin && block.conflictingBlock?.type === "r";
        return !isRacoonInTrashBin;
      });
    if (hasConflict) {
      return;
    }

    parts.value
      .filter((part) => part.type === active.type)
      .forEach((part) => {
        part.position = active.position;
        part.rotations = active.rotations;
      });

    activePart.value = null;

    drawBoard();
  };

  const nextPart = () => {
    let currentPart = activePart.value;
    let nextPartType = "a";

    if (currentPart != null) {
      let modelKeys = Object.keys(MODELS);
      let index = modelKeys.indexOf(currentPart.type);
      let nextIndex = index + 1 >= modelKeys.length ? 2 : index + 1;
      nextPartType = modelKeys[nextIndex];
    }

    const part = parts.value.find((part) => part.type === nextPartType);
    if (!part) {
      return;
    }

    activatePart(part);

    drawBoard();
  };

  const updateLevelSolved = () => {
    if (activePart.value != null) {
      levelSolved.value = false;
      return;
    }

    let conflictingBlocks = board.value
      .flat(1)
      .filter((block) => block.conflictingBlock != null);

    if (conflictingBlocks.length < 5) {
      levelSolved.value = false;
    } else {
      levelSolved.value = conflictingBlocks.every(
        (block) => block.isTrashBin && block.conflictingBlock?.type === "r"
      );
    }
  };

  watch(
    level,
    (newLevel) => {
      // clear board for new level
      const levelData = levels[newLevel - 1];
      const clones = levelData.parts.map((part) => {
        const clone: Part = {
          type: part.type,
          rotations: part.rotations,
          position: part.position,
        };
        return clone;
      });
      parts.value = [...clones];

      activePart.value = null;

      drawBoard();
    },
    { immediate: true }
  );

  return {
    board,
    parts,
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
  };
}
