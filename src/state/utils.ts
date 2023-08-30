import shuffle from "shuffle-array";
import { DEFAULT_PLAYER_INPUT_GRID, PlayerInputGrid } from "../data";
import { Cell } from "./cell";
import { Grid } from "./grid";
import { Level } from "./level";

export const getEnumKeys = <Enum extends Record<string, string | number>>(
  e: Enum
) =>
  Object.values(e).filter<Enum[keyof Enum]>(function isEnumKey<T>(
    v: any
  ): v is T {
    return !isNaN(Number(v));
  });

const LEVEL_TO_CELL_REMOVAL_COUNT: { [key in Level]: number } = {
  [Level.Test]: 2,
  [Level.Novice]: 25,
  [Level.Easy]: 30,
  [Level.Normal]: 35,
  [Level.Hard]: 40,
  [Level.Expert]: 45,
  [Level.Elite]: 50,
  [Level.Legend]: 55,
  [Level.Ultimate]: 60,
};

export const LEVEL_TO_SCORE_MULTIPLIER: { [key in Level]: number } = {
  [Level.Test]: 0.1,
  [Level.Novice]: 0.5,
  [Level.Easy]: 0.75,
  [Level.Normal]: 1,
  [Level.Hard]: 1.4,
  [Level.Expert]: 2,
  [Level.Elite]: 3,
  [Level.Legend]: 4.5,
  [Level.Ultimate]: 7,
};

const TEN_MINUTES_IN_MILLISECONDS = 600_000;
export const getTimeScore = (time: number) =>
  100 * (TEN_MINUTES_IN_MILLISECONDS / time);

export const copy = (grid: Array<Array<any>>) => grid.map((r) => r.map((c) => c));

const getCellRemovalNodeList = () => {
  return shuffle(
    new Array(9)
      .fill(null)
      .map((_, x) => new Array(9).fill(null).map((_, y) => ({ x, y })))
      .flat()
  );
};

export const getAvailableValueSetAtPosition = (
  gameBoard: number[][],
  x: number,
  y: number
) => {
  if (gameBoard[x][y] !== Cell.IGNORE) {
    return [];
  }

  const availableValues = [
    false,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ];

  gameBoard[x].forEach((value) => {
    if (value !== Cell.IGNORE) {
      availableValues[value] = false;
    }
  });
  gameBoard.forEach((row) => {
    if (row[y] !== Cell.IGNORE) {
      availableValues[row[y]] = false;
    }
  });

  let startX = Math.floor(x / 3) * 3;
  const endX = startX + 3;
  let startY = Math.floor(y / 3) * 3;
  const endY = startY + 3;

  while (startX < endX) {
    while (startY < endY) {
      const value = gameBoard[startX][startY];
      if (value !== Cell.IGNORE) {
        availableValues[value] = false;
      }
      startY++;
    }

    startY = endY - 3;
    startX++;
  }

  const result = [];
  for (let value = 1; value < availableValues.length; value++) {
    if (availableValues[value]) {
      result.push(value);
    }
  }

  return result;
};

const hasOneUniqueSolution = (grid: number[][]): number => {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] !== Cell.IGNORE) {
        continue;
      }
      const availableValues = getAvailableValueSetAtPosition(grid, x, y);
      if (!availableValues.length) {
        return 0;
      }
      let total = 0;
      for (let availableValue of availableValues) {
        if (total > 1) break;
        const newGrid = structuredClone(grid);
        newGrid[x][y] = availableValue;
        total += hasOneUniqueSolution(newGrid);
      }
      return total;
    }
  }

  return 1;
};

const generateUniqueSolutionPlayableBoardFromValidBoard = (
  grid: Grid,
  limit: number
) => {
  const cellRemovalList = getCellRemovalNodeList();
  const removedCells = [];

  while (removedCells.length < limit && cellRemovalList.length) {
    const { x, y } = cellRemovalList.pop()!;
    const temp = grid[x][y];
    grid[x][y] = Cell.IGNORE;
    const solutions = hasOneUniqueSolution(grid);
    if (solutions > 1) {
      grid[x][y] = temp;
      continue;
    }
    removedCells.push({ x, y });
  }

  return removedCells;
};

export interface Coordinate {
  x: number;
  y: number;
}

export const generateBlanksForLevel = (grid: Grid, level: Level) => {
  const blankGrid: PlayerInputGrid = structuredClone(DEFAULT_PLAYER_INPUT_GRID);
  const blankCount = LEVEL_TO_CELL_REMOVAL_COUNT[level];
  let removedCells: Coordinate[] = [];
  while (removedCells.length < blankCount) {
    removedCells = generateUniqueSolutionPlayableBoardFromValidBoard(
      structuredClone(grid) as Grid,
      blankCount
    );
  }

  removedCells.forEach(({ x, y }) => {
    blankGrid[x][y].value = 0;
  });

  return blankGrid;
};

export const checkCompleteness = (
  playerInput: PlayerInputGrid,
  board: Grid
) => {
  for (let row = 0; row < playerInput.length; row++) {
    for (let column = 0; column < playerInput[row].length; column++) {
      if (playerInput[row][column].value === Cell.IGNORE) {
        continue;
      }
      if (
        playerInput[row][column].value === Cell.BLANK ||
        playerInput[row][column].value !== board[row][column]
      ) {
        return false;
      }
    }
  }

  return true;
};
