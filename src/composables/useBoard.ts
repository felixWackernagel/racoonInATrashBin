import type { BlockShape } from "@/types";

export function useBoard() {
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

  return { rotateBlockClockwise };
}
