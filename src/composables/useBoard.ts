import { levels } from "@/levels";
import type { Level, ModelType, Part } from "@/types";
import { MODELS } from "@/types";
import { ref, toValue, watch, watchEffect, type Ref } from "vue";

interface ActivePart {
  typeNumber: number;
  part: Part;
}

interface State {
  board: number[][][];
  activePart?: ActivePart;
  parts: Part[];
}

// const boardState: State = reactive({
//   board: [
//     [[0], [0], [0], [0], [0]],
//     [[0], [0], [0], [0], [0]],
//     [[0], [0], [0], [0], [0]],
//     [[0], [0], [0], [0], [0]],
//     [[0], [0], [0], [0], [0]],
//   ],
//   parts: [],
// });

export function useBoard(level: () => number) {
  const board = ref([
    [[0], [0], [0], [0], [0]],
    [[0], [0], [0], [0], [0]],
    [[0], [0], [0], [0], [0]],
    [[0], [0], [0], [0], [0]],
    [[0], [0], [0], [0], [0]],
  ]);
  const parts = ref<Part[]>([]);
  const activePart = ref<ActivePart | null>(null);

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

  const typeToNumber = (type: ModelType): number => {
    return Object.keys(MODELS).indexOf(type);
  };

  const numberToType = (num: number): ModelType => {
    return <"e" | "r" | "a" | "b" | "c" | "d">Object.keys(MODELS)[num];
  };

  const removeActivePartsFromBoard = () => {
    board.value
      .flat(1)
      .filter((cell) => cell.length == 2)
      .map((activeCell) => activeCell.pop());
  };

  const drawPart = (part: Part, cellIndex: number) => {
    let model = MODELS[part.type];
    for (let rotation = 0; rotation < part.rotations; rotation++) {
      model = rotateClockwise(model);
    }
    let startCoordinates = positionToCoordinates(part.position);
    let modelCoordinates = modelToCoordinates(model);
    let boardValue = typeToNumber(part.type);
    modelCoordinates.forEach(
      ([row, column, cell]: [number, number, number]) => {
        let x = row + startCoordinates[0];
        let y = column + startCoordinates[1];
        let isTrashBin = cell === 2;
        board.value[x][y][cellIndex] = boardValue * (isTrashBin ? -1 : 1);
      }
    );
  };

  const drawBoard = () => {
    let active = activePart.value;

    let drawableParts: Part[] = active
      ? parts.value.filter((part) => part.type != active.part.type)
      : parts.value;
    drawableParts.forEach((part) => drawPart(part, 0));

    if (active) {
      board.value
        .flat(1)
        .filter((part) => Math.abs(part[0]) === active.typeNumber)
        .forEach((part) => (part[0] = 0));
    }

    removeActivePartsFromBoard();
    if (active) {
      drawPart(active.part, 1);
    }
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

  const activateOrDeactivatePart = (cellNumber: number): void => {
    const absoluteNumber = Math.abs(cellNumber);
    if (absoluteNumber < 1) {
      return;
    }

    const modelType = numberToType(absoluteNumber);
    const part = parts.value.filter((p) => p.type === modelType)[0];
    const clone: Part = {
      type: part.type,
      rotations: part.rotations,
      position: part.position,
    };
    if (
      activePart.value === null ||
      activePart.value.typeNumber !== absoluteNumber
    ) {
      activePart.value = {
        part: clone,
        typeNumber: absoluteNumber,
      };
    } else {
      activePart.value = null;
    }

    drawBoard();
  };

  const moveUp = () => {
    const active = activePart.value;
    if (!active) {
      return;
    }

    if (active.part.position <= 5) {
      return;
    }

    active.part.position = active.part.position - 5;

    drawBoard();
  };

  const moveDown = () => {
    const active = activePart.value;
    if (!active) {
      return;
    }

    let model = MODELS[active.part.type];
    for (let rotation = 0; rotation < active.part.rotations; rotation++) {
      model = rotateClockwise(model);
    }
    let modelHeight = model.length - 1;

    if (active.part.position + modelHeight * 5 > 20) {
      return;
    }

    active.part.position = active.part.position + 5;

    drawBoard();
  };

  const moveLeft = () => {
    const active = activePart.value;
    if (!active) {
      return;
    }

    if (active.part.position % 5 <= 1) {
      return;
    }

    active.part.position = active.part.position - 1;

    drawBoard();
  };

  const moveRight = () => {
    const active = activePart.value;
    if (!active) {
      return;
    }

    let model = MODELS[active.part.type];
    for (let rotation = 0; rotation < active.part.rotations; rotation++) {
      model = rotateClockwise(model);
    }
    let modelWidth = model[0].length - 1;

    if ((active.part.position % 5) + modelWidth >= 5) {
      return;
    }

    active.part.position = active.part.position + 1;

    drawBoard();
  };

  const rotate = () => {
    const active = activePart.value;
    if (!active) {
      return;
    }

    active.part.rotations = (active.part.rotations + 1) % 4;
    let model = MODELS[active.part.type];
    for (let rotation = 0; rotation < active.part.rotations; rotation++) {
      model = rotateClockwise(model);
    }
    let modelHeight = model.length - 1;
    let modelWidth = model[0].length - 1;
    let coordinates = positionToCoordinates(active.part.position);

    if (coordinates[0] + modelHeight > 4) {
      let diff = coordinates[0] + modelHeight - 4;
      active.part.position = active.part.position - diff * 5;
    }

    if (coordinates[1] + modelWidth > 4) {
      let diff = coordinates[1] + modelWidth - 4;
      active.part.position = active.part.position - diff;
    }

    drawBoard();
  };

  const place = () => {
    const active = activePart.value;
    if (!active) {
      return;
    }

    const type = typeToNumber(active.part.type);
    const hasConflict = board.value
      .flat(1)
      .filter((cell) => cell.length == 2)
      .filter((cell) => Math.abs(cell[1]) === type)
      .some((cell) => {
        const below = cell[0];
        const above = cell[1];
        const belowIsNotEmpty = below != 0 && Math.abs(below) != type;
        const isRacoonInTrashBin = below + above < 0;
        return belowIsNotEmpty && !isRacoonInTrashBin;
      });
    if (hasConflict) {
      return;
    }

    board.value
      .flat(1)
      .filter((cell) => cell.length == 1)
      .filter((cell) => Math.abs(cell[0]) === type)
      .some((cell) => (cell[0] = 0));

    parts.value
      .filter((part) => part.type === active.part.type)
      .forEach((part) => {
        part.position = active.part.position;
        part.rotations = active.part.rotations;
      });

    activePart.value = null;

    drawBoard();
  };

  watch(
    level,
    (newLevel) => {
      // clear board for new level
      const levelData = levels[newLevel - 1];

      const array = new Array();
      array.push(...levelData.parts);
      parts.value = array;

      board.value.flat(1).forEach((column) => {
        if (column.length === 2) {
          column.pop();
        }
        column[0] = 0;
      });

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
  };
}
