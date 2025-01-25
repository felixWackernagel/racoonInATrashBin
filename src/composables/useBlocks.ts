import type { Block, ModelType } from "@/types";

export function useBlocks() {
  const emptyBlock = (): Block => {
    return {
      type: "e",
      isTrashBin: false,
      isActive: false,
      conflictingBlock: null,
    };
  };

  const typedBlock = (
    type: ModelType,
    isTrashBin: boolean,
    isActive: boolean,
    conflictingBlock: Block | null
  ): Block => {
    return {
      type: type,
      isTrashBin: isTrashBin,
      isActive: isActive,
      conflictingBlock: conflictingBlock,
    };
  };

  return { emptyBlock, typedBlock };
}
