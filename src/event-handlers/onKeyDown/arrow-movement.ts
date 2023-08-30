import { Cell } from "../../state/cell";
import { DataType, getDataInt, tryGetDataType } from "../utils";

enum ArrowKey {
  ArrowLeft,
  ArrowUp,
  ArrowRight,
  ArrowDown,
}

const isArrowKey = (key: any): key is keyof typeof ArrowKey =>
Number.isInteger(ArrowKey[key]);

const handleArrowKeyMovement = (e: KeyboardEvent) => {
  const key = e.key as any;
  if (!isArrowKey(key)) {
    return;
  }

  const activeElement = document.activeElement;

  if (!activeElement) {
    return;
  }

  const dataType = tryGetDataType(activeElement);

  if (!dataType || dataType !== DataType.CELL) {
    return;
  }

  e.preventDefault(); // prevent scrolling

  const isControlKeyPressed = e.ctrlKey;
  let row = getDataInt(activeElement, "row");
  let column = getDataInt(activeElement, "column");

  const modifier = isControlKeyPressed ? 3 : 1;

  if (row === Cell.IGNORE || column === Cell.IGNORE) {
    return;
  }

  switch (ArrowKey[key]) {
    case ArrowKey.ArrowLeft:
      column = Math.max(0, column - modifier);
      break;
    case ArrowKey.ArrowUp:
      row = Math.max(0, row - modifier);
      break;
    case ArrowKey.ArrowRight:
      column = Math.min(8, column + modifier);
      break;
    case ArrowKey.ArrowDown:
      row = Math.min(8, row + modifier);
      break;
    default:
      return;
  }

  const focusTarget = document.querySelector<HTMLButtonElement>( // use refs?
  `[data-type="CELL"][data-row="${row}"][data-column="${column}"]`
  );

  focusTarget && focusTarget.focus();
};

export default handleArrowKeyMovement;
