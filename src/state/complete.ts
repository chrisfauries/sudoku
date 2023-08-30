import { selector } from "recoil";
import blanks from "./blanks";
import grid from "./grid";
import { checkCompleteness } from "./utils";

const isComplete = selector({
  key: "complete/check-complete",
  get: ({ get }) => {
    const gameBoard = get(grid.get);
    const blanksGrid = get(blanks.getAll);
    return checkCompleteness(blanksGrid, gameBoard);
  },
});

export default { isComplete };
