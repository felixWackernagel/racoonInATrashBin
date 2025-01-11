import type {BlockShape} from "@/types";
import {Block, SHAPES} from "@/types";
import {useLevel} from "@/composables/useLevel";
import {ref} from "vue";

const { levelData } = useLevel();

export function useBoard() {

  const board = ref([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ]);

  const cellToCoordinates = (cell: number): number[] => {
    let row = cell <= 5 ? 0 : ( ( cell - ( cell % 5 ) ) / 5 );
    let column = ( cell <= 5 ? cell : ( cell % 5 ) ) - 1;
    return [row, column];
  };

  const shapeToCoordinates = (shape: number[][]): number[][] => {
    let coordinates = [];

    let rows = shape.length;
    let columns = shape[0].length;

    for( let row = 0; row < rows; row++ ) {
      for( let column = 0; column < columns; column++ ) {
        let cell = shape[row][column];
        if( cell > 0 ) {
          coordinates.push([row, column, cell]);
        }
      }
    }

    return coordinates;
  };

  const blockToNumber = (block: Block): number => {
    return Object.keys( Block ).indexOf( block ) + 2;
  }

  // /**
  //  * This function spawns a piece on the game board and returns if the spawn succeeded.
  //  */
  // spawn = (board: Board): boolean => {
  //   // First we reset the position of the piece.
  //   this.reset();
  //
  //   const gb: number[][] = board.GameBoard;
  //
  //   const pieceBlocks = this.getCoordinates();
  //
  //   // First we check if the board is already full at the coordinates that we want the piece to spawn in.
  //   // This is an automatic game over.
  //   for (let i = 0; i < pieceBlocks.length; i++) {
  //     const coords = pieceBlocks[i];
  //     if (gb[coords[0]][coords[1]] !== 0) {
  //       return false;
  //     }
  //   }
  //
  //   for (let i = 0; i < pieceBlocks.length; i++) {
  //     const coords = pieceBlocks[i];
  //     gb[coords[0]][coords[1]] = this.color;
  //   }
  //
  //   return true;
  // };

  levelData.value.pieces.forEach( piece => {
    let blockShape = SHAPES[piece.block].shape;
    for( let rotation = 0; rotation < piece.rotations; rotation++ ) {
      blockShape = rotateBlockClockwise( blockShape );
    }
    let startCoordinates = cellToCoordinates( piece.startCell );
    let coordinates = shapeToCoordinates( blockShape );
    coordinates.forEach( ([row, column, cell]: [number, number, number]) => {
      let x = row + startCoordinates[0];
      let y = column + startCoordinates[1];
      let isTrashBin = cell == 2;
      board.value[x][y] = blockToNumber(piece.block) * (isTrashBin ? -1 : 1);
    });
  });

  // place racoons on board
  levelData.value.racoons.map( cellToCoordinates ).forEach( ([row, column]: [number, number]) => {
    board.value[row][column] = 1;
  } );

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
  const rotateBlockClockwise = (block: BlockShape): BlockShape => {
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

  return { board };
}
