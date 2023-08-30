import {
  atom,
  GetRecoilValue,
  selector,
  SelectorCallbackInterface,
  SetRecoilState,
} from "recoil";
import grid, { Grid } from "./grid";
import level from "./level";
import { Coordinate, copy, generateBlanksForLevel } from "./utils";
import memo from "memoizee";
import {
  DEFAULT_BLANK_GRID,
  DEFAULT_PLAYER_INPUT_GRID,
  PlayerInputGrid,
} from "../data";
import { Cell } from "./cell";
import { LocalStorage } from "./local-storage";
import pause from "./pause";
import available from "./available";
import complete from "./complete";
import time from "./time";
import { DataType, getDataInt, tryGetDataType } from "../event-handlers/utils";

const blanksAtom = atom<PlayerInputGrid>({
  key: "blanks/blanks-atom",
  default: LocalStorage.get().blanks ?? DEFAULT_PLAYER_INPUT_GRID,
  effects: [
    LocalStorage.effect("blanks"),
    ({ onSet, getPromise }) => {
      onSet(async () => {
        const generate = await getPromise(available.generate);
        const isComplete = await getPromise(complete.isComplete);
        const timer = await getPromise(time.controls);
        const togglePause = await getPromise(pause.toggle);

        if (isComplete) {
          timer.stop();
          togglePause();
        } else {
          generate();
        }
      });
    },
  ],
});

const getBlank = memo((x: number, y: number) =>
  selector({
    key: `${x}-${y}-get-blank`,
    get: ({ get }) => get(blanksAtom)[x][y],
  })
);

interface SetBlank extends Coordinate {
  value: number;
  ctrlKey: boolean;
  altKey: boolean;
}

const setBlank = selector<SetBlank>({
  key: "blanks/set-blank",
  get: () => ({ x: 0, y: 0, value: 0, ctrlKey: false, altKey: false }),
  set: ({ set, get }, args) => {
    if (get(pause.get)) return;
    const { x, y, value, ctrlKey, altKey } = args as SetBlank;
    const playerInput = get(getBlank(x, y));
    if (ctrlKey || altKey) {
      setMarking(x, y, value, ctrlKey, get, set);
      return;
    }

    if (playerInput.value === Cell.IGNORE) {
      return; // no-op
    }

    const currentGrid = get(grid.get);
    if (currentGrid[x][y] === playerInput.value && value !== 0) {
      return; // no-op
    }

    const playerInputGrid: PlayerInputGrid = copy(get(blanksAtom));
    playerInputGrid[x][y] = {
      ...playerInputGrid[x][y],
      value,
    };
    set(blanksAtom, playerInputGrid);
  },
});

const setMarking = (
  x: number,
  y: number,
  value: number,
  ctrlKey: boolean,
  get: GetRecoilValue,
  set: SetRecoilState
) => {
  const prop: "center" | "corner" = ctrlKey ? "center" : "corner";
  const playerInputGrid: PlayerInputGrid = copy(get(blanksAtom));
  const playerInput = playerInputGrid[x][y];
  const numSet = new Set(playerInput[prop]);

  playerInputGrid[x][y] = {
    ...playerInput,
    [prop]: Array.from(numSet.delete(value) ? numSet : numSet.add(value)),
  };
  set(blanksAtom, playerInputGrid);
  return;
};

const generateBlank = selector<Grid>({
  key: "blanks/generate-blank",
  get: () => DEFAULT_BLANK_GRID,
  set: ({ get, set }, grid) => {
    set(blanksAtom, generateBlanksForLevel(grid as Grid, get(level.get)));
  },
});

const tryUpdateCellOnKeyDown = selector({
  key: "blanks/try-update-cell-on-key-down",
  get: ({ getCallback }) =>
    getCallback((cbInterface) => async (e: KeyboardEvent) => {
      const { key, ctrlKey, altKey } = e;
      if (/\d/.test(key)) {
        if (ctrlKey || altKey) {
          e.preventDefault();
        }
        return tryUpdateCell(cbInterface, parseInt(key), ctrlKey, altKey);
      }

      switch (key) {
        case "Delete":
        case "Backspace":
          return tryUpdateCell(cbInterface, 0);
      }
    }),
});

const tryUpdateCellOnSelectorClick = selector({
  key: "blanks/try-update-cell-on-selector-click",
  get: ({ getCallback }) =>
    getCallback(
      (cbInterface) => (value: number) => tryUpdateCell(cbInterface, value)
    ),
});

const tryUpdateCell = async (
  { snapshot, set }: SelectorCallbackInterface,
  value: number,
  ctrlKey: boolean = false,
  altKey: boolean = false
) => {
  if (await snapshot.getPromise(pause.get)) return;

  const activeElement = document.activeElement;
  if (!activeElement) {
    return;
  }

  const dataType = tryGetDataType(activeElement);

  if (!dataType || dataType !== DataType.CELL) {
    return;
  }

  const x = getDataInt(activeElement, "row");
  const y = getDataInt(activeElement, "column");
  if (x === Cell.IGNORE || y === Cell.IGNORE) {
    return;
  }

  set(setBlank, { x, y, value, ctrlKey, altKey });
};

export default {
  getAll: blanksAtom,
  get: getBlank,
  set: setBlank,
  generate: generateBlank,
  onKeyDown: tryUpdateCellOnKeyDown,
  onClick: tryUpdateCellOnSelectorClick,
};
