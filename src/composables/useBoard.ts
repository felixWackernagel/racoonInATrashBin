import type { BlockShape } from "@/types";
import { useLevel } from "@/composables/useLevel";
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
    let normalized = cell - 1;
    if( normalized < 5 ) {
      return [0, normalized];
    }
    let column = normalized % 5;
    let row = ( normalized - column ) / 5;
    return [row, column];
  };

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

  // levelData.value.pieces.forEach( piece => {
  //   let offset = cellToCoordinatesOffset( piece.startCell );
  // });

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
