import type { ModelType, Part } from "@/types";
import { MODELS } from "@/types";
import { useLevel } from "@/composables/useLevel";
import { reactive, ref } from "vue";

const { levelData } = useLevel();

interface ActivePart {
  typeNumber: number;
  part: Part;
}

interface State {
  board: number[][][];
  activePart?: ActivePart;
  parts: Part[];
}

export function useBoard() {
  const boardState: State = reactive({
    board: [
      [[0], [0], [0], [0], [0]],
      [[0], [0], [0], [0], [0]],
      [[0], [0], [0], [0], [0]],
      [[0], [0], [0], [0], [0]],
      [[0], [0], [0], [0], [0]],
    ],
    parts: [],
  });

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
    return Object.keys(MODELS).indexOf(type) + 1;
  };

  const numberToType = (num: number): ModelType | null => {
    if (num < 1 || num > 5) {
      return null;
    }
    return <"r" | "a" | "b" | "c" | "d">Object.keys(MODELS)[num - 1];
  };

  const removeActivePartFromBoard = () => {
    boardState.board.forEach((row) => {
      row.forEach((column) => {
        if (column.length == 2) {
          column.pop();
        }
      });
    });
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
        boardState.board[x][y][cellIndex] = boardValue * (isTrashBin ? -1 : 1);
      }
    );
  };

  const drawBoard = () => {
    boardState.parts.forEach((part) => drawPart(part, 0));
    removeActivePartFromBoard();
    if (boardState.activePart) {
      drawPart(boardState.activePart.part, 1);
    }
    console.error("state", boardState);
  };

  boardState.parts.push(...levelData.value.parts);
  drawBoard();

  /**
   * Rotates a Block element clockwise (90 degree).
   * The count of row and column is swapped.
   *
   * 0 1 0    1 0
   * 1 1 1 => 1 1
   *          1 0
   *
   * @param {BlockShape} block
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
    if (!modelType) {
      return;
    }

    const part = boardState.parts.filter((p) => p.type === modelType)[0];
    const clone: Part = {
      type: part.type,
      rotations: part.rotations,
      position: part.position,
    };
    if (
      boardState.activePart == undefined ||
      boardState.activePart.typeNumber !== absoluteNumber
    ) {
      boardState.activePart = {
        part: clone,
        typeNumber: absoluteNumber,
      };
    } else {
      boardState.activePart = undefined;
    }

    drawBoard();
  };

  const moveUp = () => {
    const activePart = boardState.activePart;
    if (!activePart) {
      return;
    }

    if (activePart.part.position <= 5) {
      return;
    }

    activePart.part.position = activePart.part.position - 5;

    drawBoard();
  };

  const moveDown = () => {
    const activePart = boardState.activePart;
    if (!activePart) {
      return;
    }

    let model = MODELS[activePart.part.type];
    for (let rotation = 0; rotation < activePart.part.rotations; rotation++) {
      model = rotateClockwise(model);
    }
    let modelHeight = model.length - 1;

    if (activePart.part.position + modelHeight * 5 > 20) {
      return;
    }

    activePart.part.position = activePart.part.position + 5;

    drawBoard();
  };

  const moveLeft = () => {
    const activePart = boardState.activePart;
    if (!activePart) {
      return;
    }

    if (activePart.part.position % 5 <= 1) {
      return;
    }

    activePart.part.position = activePart.part.position - 1;

    drawBoard();
  };

  const moveRight = () => {
    const activePart = boardState.activePart;
    if (!activePart) {
      return;
    }

    let model = MODELS[activePart.part.type];
    for (let rotation = 0; rotation < activePart.part.rotations; rotation++) {
      model = rotateClockwise(model);
    }
    let modelWidth = model[0].length - 1;

    if ((activePart.part.position % 5) + modelWidth >= 5) {
      return;
    }

    activePart.part.position = activePart.part.position + 1;

    drawBoard();
  };

  const rotate = () => {
    const activePart = boardState.activePart;
    if (!activePart) {
      return;
    }

    activePart.part.rotations = (activePart.part.rotations + 1) % 4;
    let model = MODELS[activePart.part.type];
    for (let rotation = 0; rotation < activePart.part.rotations; rotation++) {
      model = rotateClockwise(model);
    }
    let modelHeight = model.length - 1;
    let modelWidth = model[0].length - 1;
    let coordinates = positionToCoordinates(activePart.part.position);

    if (coordinates[0] + modelHeight > 4) {
      let diff = coordinates[0] + modelHeight - 4;
      activePart.part.position = activePart.part.position - diff * 5;
    }

    if (coordinates[1] + modelWidth > 4) {
      let diff = coordinates[1] + modelWidth - 4;
      activePart.part.position = activePart.part.position - diff;
    }

    drawBoard();
  };

  return {
    boardState,
    activateOrDeactivatePart,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    rotate,
  };
}
