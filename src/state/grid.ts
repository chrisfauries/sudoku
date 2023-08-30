import { atom, selector } from "recoil";
import { DEFAULT_BLANK_GRID } from "../data";
import { getRandomGrid, getRandomUltimateSet } from "../event-handlers/utils";
import blanks from "./blanks";
import level, { Level } from "./level";
import { LocalStorage } from "./local-storage";
import pause from "./pause";

export type Matrix<T> = Array<Array<T>>;
export type Grid = Matrix<number>;

const gridAtom = atom<Grid>({
  key: "grid/grid-atom",
  default: LocalStorage.get().currentGrid ?? DEFAULT_BLANK_GRID,
  effects: [LocalStorage.effect("currentGrid")],
});

const gridSelector = selector({
  key: "grid/grid-selector",
  get: () => {},
  set: ({ set, get }) => {
    switch (get(level.get)) {
      case Level.Ultimate: {
        const { grid, blankGrid } = getRandomUltimateSet();
        set(gridAtom, grid);
        set(blanks.getAll, blankGrid);
        return;
      }
      default: {
        const newGrid = getRandomGrid();
        set(gridAtom, newGrid);
        const isPaused = get(pause.get);
        isPaused && get(pause.toggle)();
        set(blanks.generate, newGrid);
        return;
      }
    }
  },
});

export default { get: gridAtom, set: gridSelector };
