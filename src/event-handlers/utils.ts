import { PlayerInputGrid } from "../data";
import grids from "../data/grids.json";
import ultimates from "../data/ultimate-boards.json";

export enum DataType {
  NEW_GAME,
  CELL,
  GRID,
  SELECTOR,
  SELECTOR_CONTAINER,
  LEVEL,
  PAUSE,
  HINT,
}

export const getParentByDataType = (
  el: Element | null,
  dataType: DataType
): Element | null => {
  if (el === null) {
    return null;
  }

  const elDataType = tryGetDataType(el);
  if (elDataType && elDataType === dataType) {
    return el;
  }

  return getParentByDataType(el.parentElement, dataType);
};

export const tryGetDataType = (el: Element) => {
  const dataType = el.getAttribute("data-type");

  if (!dataType) {
    return null;
  }

  return DataType[dataType as keyof typeof DataType];
};

export const getDataInt = (
  el: Element,
  prop: string,
  defaultValue: string = "-1"
) => parseInt(getDataValue(el, prop) || defaultValue);

export const getDataValue = (el: Element, prop: string) => {
  return el.getAttribute(`data-${prop}`);
};

export const getRandomGrid = () =>
  grids[Math.floor(grids.length * Math.random())];
export const getRandomUltimateSet = () => {
  const { grid, blankGrid } =
    ultimates[Math.floor(ultimates.length * Math.random())];

  return {
    grid,
    blankGrid: blankGrid.map((row) =>
      row.map((cell) => ({ value: cell, center: [], corner: [] }))
    ) as PlayerInputGrid,
  };
};
