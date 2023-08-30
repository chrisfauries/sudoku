import { atom, selector } from "recoil";
import { DEFAULT_AVAILABLE_GRID } from "../data";
import memo from "memoizee";
import grid, { Grid } from "./grid";
import blanks from "./blanks";
import { getAvailableValueSetAtPosition } from "./utils";
import { Cell } from "./cell";
import { LocalStorage } from "./local-storage";
import hint from "./hint";

const availableAtom = atom<Grid[]>({
  key: "available/available-atom",
  default: LocalStorage.get().available ?? DEFAULT_AVAILABLE_GRID,
  effects: [LocalStorage.effect("available")],
});

const getAvailable = memo((x: number, y: number) =>
  selector({
    key: `${x}-${y}-get-available`,
    get: ({ get }) => get(availableAtom)[x][y],
  })
);

const generateAvailable = selector({
  key: "available/generate-available",
  get: ({ getCallback }) =>
    // TODO: refactor/optimize this
    getCallback(({ set, snapshot }) => async () => {
      const isHintEnabled = await snapshot.getPromise(hint.get);
      if(!isHintEnabled) return;
      const board:Grid = structuredClone(await snapshot.getPromise(grid.get));
      const blank = await snapshot.getPromise(blanks.getAll);

      for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
          if (
            blank[row][column].value !== Cell.IGNORE &&
            (blank[row][column].value === Cell.BLANK ||
              blank[row][column].value !== board[row][column])
          ) {
            board[row][column] = Cell.IGNORE;
          }
        }
      }

      const availabilityMatrix = board.map((row, x) =>
        row.map((_, y) => getAvailableValueSetAtPosition(board, x, y))
      );

      const currentAvailable = await snapshot.getPromise(availableAtom);
      const isChanged = currentAvailable.some((row, x) =>
      row.some((available, y) => {
        const set = new Set(available);
        const newAvailableList = availabilityMatrix[x][y];
        return (
          set.size !== newAvailableList.length ||
          availabilityMatrix[x][y].some((value) => !set.has(value))
          );
        })
        );
        
      // only update if there is a change
      isChanged && set(availableAtom, availabilityMatrix);
    }),
});

export default { get: getAvailable, generate: generateAvailable };
