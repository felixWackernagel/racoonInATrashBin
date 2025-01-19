import type { ModelType, Part } from "@/types";
import { MODELS } from "@/types";
import { useLevel } from "@/composables/useLevel";
import { reactive } from "vue";

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

export function useBoard() {
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
    boardState.board
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
        boardState.board[x][y][cellIndex] = boardValue * (isTrashBin ? -1 : 1);
      }
    );
  };

  const drawBoard = () => {
    let activePart = boardState.activePart;

    let drawableParts = activePart
      ? boardState.parts.filter((part) => part.type != activePart.part.type)
      : boardState.parts;
    drawableParts.forEach((part) => drawPart(part, 0));

    if (activePart) {
      boardState.board
        .flat(1)
        .filter((part) => Math.abs(part[0]) === activePart.typeNumber)
        .forEach((part) => (part[0] = 0));
    }

    removeActivePartsFromBoard();
    if (activePart) {
      drawPart(activePart.part, 1);
    }
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

  const place = () => {
    const activePart = boardState.activePart;
    if (!activePart) {
      return;
    }

    const type = typeToNumber(activePart.part.type);
    const hasConflict = boardState.board
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

    boardState.board
      .flat(1)
      .filter((cell) => cell.length == 1)
      .filter((cell) => Math.abs(cell[0]) === type)
      .some((cell) => (cell[0] = 0));

    boardState.parts
      .filter((part) => part.type === activePart.part.type)
      .forEach((part) => {
        part.position = activePart.part.position;
        part.rotations = activePart.part.rotations;
      });

    boardState.activePart = undefined;

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
    place,
  };
}
