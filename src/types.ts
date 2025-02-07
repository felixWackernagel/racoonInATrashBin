export type ModelType = "e" | "r" | "a" | "b" | "c" | "d";

export type Model = {
  [key in ModelType]: number[][];
};

export const MODELS: Model = {
  e: [[0]],
  r: [[1]],
  a: [
    [0, 1, 0],
    [1, 2, 1],
  ],
  b: [
    [1, 2, 1],
    [0, 0, 1],
  ],
  c: [
    [1, 2],
    [0, 1],
    [0, 1],
  ],
  d: [
    [0, 1, 0],
    [2, 1, 0],
    [0, 1, 2],
  ],
};

export interface Part {
  type: ModelType;
  rotations: number;
  position: number;
}

export interface Level {
  difficulty: string;
  parts: Part[];
  turns: number;
}

export interface Block {
  type: ModelType;
  isTrashBin: boolean;
  isActive: boolean;
  conflictingBlock: Block | null;
}
