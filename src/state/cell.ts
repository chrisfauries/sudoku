import memo from "memoizee";
import { selector } from "recoil";
import grid from "./grid";
import blank from "./blanks";
import hint from "./hint";

const getDisplayValue = (
  isDeleted: boolean,
  solvedValue?: number,
  playerValue?: number
) => {
  if (isDeleted || !solvedValue || solvedValue <= 0) {
    return "";
  }

  if (playerValue) {
    return `${playerValue}`;
  }

  return `${solvedValue}`;
};

export enum Cell {
  IGNORE = -1,
  BLANK,
  ONE,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
}

interface CellData {
  solvedValue?: number;
  playerValue?: number;
  displayValue: string;
  isDeleted: boolean;
  isHintEnabled: boolean;
  centerValues: number[];
  cornerValues: number[];
}

const getCell = memo((x: number, y: number) =>
  selector<CellData>({
    key: `cell/${x}-${y}-cell-get`,
    get: ({ get }) => {
      const currentGrid = get(grid.get);
      const isHintEnabled = get(hint.get);
      if (!currentGrid) {
        return {
          isDeleted: false,
          displayValue: "",
          isHintEnabled: false,
          centerValues: [],
          cornerValues: [],
        };
      }
      const solvedValue = currentGrid[x][y];
      const playerInput = get(blank.get(x, y));
      const isDeleted = playerInput.value === Cell.BLANK;

      const playerValue =
        playerInput.value !== Cell.IGNORE && playerInput.value !== Cell.BLANK
          ? playerInput.value
          : undefined;

      return {
        solvedValue: solvedValue,
        playerValue,
        isDeleted,
        displayValue: getDisplayValue(isDeleted, solvedValue, playerValue),
        centerValues: playerInput.center,
        cornerValues: playerInput.corner,
        isHintEnabled,
      };
    },
  })
);

export default { get: getCell };
