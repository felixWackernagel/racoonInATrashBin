# It's a trap

A mini puzzle game written in TypeScript with Vue 3.

## How to play the game? 🦝 + 🪤 = 📦

The board contains five racoons and four blocks with different shapes. Each block has at least one box. The goal is to put each racoon in a single box. You can move only one block at a time. A block can be rotated by 90° and moved inside the board. A block can only be placed on a different spot when no conflict with a different block exist. It is allowed to remove the box from a racoon to reach the goal in small steps.

## Parts of the game

- Level (description of a game)
  - difficulty (string) i.e. Starter: how hard is this level
  - parts (Part[]): description of the places of each racoon and block
  - turns (number) i.e. 4: what is the minimum number of moves to solve the puzzle
  - collectable (string) i.e. 🍐: a simple price (racoons love food)
- Part (description of the game board)
  - type (ModelType) i.e. "r": which block is this part
  - rotations (number) i.e. 2: how often is the part rotated clockwise
  - position (number) i.e. 1: the start position for rendering the block on the board, it is the index of a cell in a five by five grid (starting by 1)
- ModelType (description of a board part)
  - "e" = Empty
  - "r" = Racoon
  - "a" = blue block
  - "b" = green block
  - "c" = red block
  - "d" = purple block
- Block
  - type (ModelType) i.e. "r": which block to draw
  - isTrashBin (boolean): shows the block a box for the racoon
  - isActive (boolean): is the block currently selected by the user
  - conflictingBlock (Bock|null): the active block can be moved above another block, for example a box can be above a racoon all other blocks produce a conflict

## Symbols

- 🦝 = r = Racoon
- 🪤 = Trash Bin / Box = part of a block
- 📦 = Racoon is in the Box
- ❌ = a active block is above another not empty block or racoon

## Rendering Phase

The board is a two dimensional array of Blocks where the first level means rows and the second level means columns.

This is a sketch of the board (grid) with the position (index) of each cell.

```
board: Block[][] = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25],
]
```

The board has only one active part at a time. The last important element is a list of parts with there actual state after the level has started and the user has done some movements. After starting the level and after each action of the use the board is drawn.

1. create a clean board with one empty block in each cell
2. place all racoons (part with type "r" from parts) on the board
3. place all inactive parts (part with type "a", "b", "c" or "d") on the board
4. place the only active part on the board when the user choose on part

During the draw process is a part transformed to multiple blocks and represents a single cell on the board. The shape of the block is defined by the ModelType. The type leads to a two dimensional array of integers which tells how the part is build by blocks.

This is the model description of type "a".

```
"a" = [
    [0, 1, 0],
    [1, 2, 1],
  ]
```

0 means it is a empty block and skipped during the rendering. 1 means it is a simple block of the given type "a". 2 means it is the box/trash bin of the block to trap the racoon.

Last but not least is the model rotated by the information of the part and moved to the position of the part. Each inactive part has no conflicting part by definition and replaced only empty blocks. By rendering the active part is each non empty block saved inside the active block which replaced it (the active block is "above" the inactive block).

## Vue Components

- App (level selector and game area)
- Icon (just a container of all svg-icons to cleanup the other components)
- Cell (the representation of a block which draws the symbol and his type styles)
- Board (the main component for the game which shows the board and his controls)

## Composables

- useLevel (global state holder of the current level, get current level data and move to next level)
- useBlocks (small factory for different block types)
- useBoard (main logic of game logic and rendering and actions for the controls to change the board)

## Misc

- levels.ts contains the definition of each level
- types.ts contains all custom TypeScript types for this project

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

## Compile and Hot-Reload for Development on mobile devices

```sh
npm run dev -- --host
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
