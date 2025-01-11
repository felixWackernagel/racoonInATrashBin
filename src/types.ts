export enum Block {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
}

export enum EmptyCell {
  Empty = "Empty",
}

export enum Racoon {
  Racoon = "Racoon",
}

export type CellOptions = Block | EmptyCell | Racoon;

export type BoardShape = CellOptions[][];

export type BlockShape = number[][];

export type ShapesObj = {
  [key in Block]: {
    shape: BlockShape;
  };
};

export interface Piece {
  block: Block;
  rotations: number;
  startCell: number;
}

export interface Data {
  difficulty: string;
  racoons: number[];
  board: number[][];
  pieces: Piece[];
}

export const SHAPES: ShapesObj = {
  A: {
    shape: [
      [0, 1, 0],
      [1, 2, 1],
    ],
  },
  B: {
    shape: [
      [1, 2, 1],
      [0, 0, 1],
    ],
  },
  C: {
    shape: [
      [1, 2],
      [0, 1],
      [0, 1],
    ],
  },
  D: {
    shape: [
      [0, 1, 0],
      [2, 1, 0],
      [0, 1, 2],
    ],
  },
};