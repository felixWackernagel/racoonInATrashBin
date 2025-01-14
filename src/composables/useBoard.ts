import type { ModelType, Part } from "@/types";
import { MODELS } from "@/types";
import { useLevel } from "@/composables/useLevel";
import { reactive, ref } from "vue";

const { levelData } = useLevel();

interface State {
  board: number[][];
  selectedPiece?: number;
}

export function useBoard() {
  // maybe this should be a list and we filter what we really want
  const moveableParts = ref(new Map<ModelType, Part>());

  const boardState: State = reactive({
    board: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
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
    return Object.keys( MODELS ).indexOf( type ) + 1;
  };

  const numberToType = (num: number): ModelType | null => {
    if( num < 1 || num > 5 ) {
      return null
    }
    return <"r" | "a" | "b" | "c" | "d">Object.keys(MODELS)[num - 1];
  }

  const drawBoard = (parts: Part[]) => {
    parts.forEach( part => {
      let model = MODELS[part.type];
      for (let rotation = 0; rotation < part.rotations; rotation++) {
        model = rotateClockwise(model);
      }
      let startCoordinates = positionToCoordinates(part.position);
      let modelCoordinates = modelToCoordinates(model);
      let boardValue = typeToNumber(part.type);
      modelCoordinates.forEach(([row, column, cell]: [number, number, number]) => {
        let x = row + startCoordinates[0];
        let y = column + startCoordinates[1];
        let isTrashBin = cell === 2;
        boardState.board[x][y] = boardValue * (isTrashBin ? -1 : 1);
      });

      if( part.type != "r" ) {
        moveableParts.value.set( part.type, part );
      }
    } )
  }

  drawBoard( levelData.value.parts );

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

  const selectPiece = (cellNumber: number): void => {
    const absoluteNumber = Math.abs(cellNumber);
    if (absoluteNumber < 1) {
      return;
    }
    if( boardState.selectedPiece === absoluteNumber ) {
      boardState.selectedPiece = undefined;
    } else {
      boardState.selectedPiece = absoluteNumber;
    }
  };

  const moveUp = () => {
    // const cellValue = boardState.selectedPiece;
    // if( cellValue ) {
    //   const modelType = numberToType( cellValue );
    //   if( modelType ) {
    //     const part = moveableParts.value.get( modelType );
    //     if( part ) {
    //       part.po
    //     }
    //   }
    // }
  };

  const moveDown = () => {
    console.error("down")
  };

  const moveLeft = () => {
    console.error("left")
  };

  const moveRight = () => {
    console.error("right")
  };

  const rotate = () => {
    console.error("rotate")
  };

  return { boardState, selectPiece, moveUp, moveDown, moveLeft, moveRight, rotate };
}
