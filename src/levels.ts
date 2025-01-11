import type { Data } from "@/types";
import {Block} from "@/types";

export const levels: Data[] = [
  {
    difficulty: "Starter",
    racoons: [1, 5, 8, 16, 24],
    board: [
      [1, 5, 4, -4, 1],
      [-5, 5, 1, 4, 0],
      [0, 5, -5, 4, 0],
      [1, 2, 3, -3, 3],
      [2, -2, 2, 1, 3],
    ],
    pieces: [
      {
        block: Block.A,
        rotations: 0,
        startCell: 16,
      },
      // {
      //   block: Block.B,
      //   rotations: 0,
      //   startCell: 18,
      // },
      // {
      //   block: Block.C,
      //   rotations: 0,
      //   startCell: 3,
      // },
      // {
      //   block: Block.D,
      //   rotations: 0,
      //   startCell: 1,
      // },
    ]
  },
  {
    difficulty: "Starter",
    racoons: [1, 9, 12, 18, 24],
    board: [
      [1, 0, -3, 3, 3],
      [3, 3, 3, 1, -5],
      [-3, 1, 5, 5, 5],
      [3, 2, 1, -5, 0],
      [2, -2, 2, 1, 0],
    ],
    pieces: [
      {
        block: Block.A,
        rotations: 0,
        startCell: 16,
      },
      {
        block: Block.B,
        rotations: 3,
        startCell: 6,
      },
      {
        block: Block.C,
        rotations: 3,
        startCell: 3,
      },
      {
        block: Block.D,
        rotations: 3,
        startCell: 8,
      },
    ]
  },
];
