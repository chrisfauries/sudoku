import { DataType, getDataInt, tryGetDataType } from "../utils";

const handleSelectorClick = (
  el: HTMLButtonElement,
  tryUpdateCellOnSelectorClick: (value: number) => Promise<void>
) => {
  const focusedDataType =
    document.activeElement && tryGetDataType(document.activeElement);

  if (!focusedDataType || focusedDataType !== DataType.CELL) {
    return;
  }

  const value = getDataInt(el, "value");

  if (value < 0) {
    return;
  }

  tryUpdateCellOnSelectorClick(value);
};

export default handleSelectorClick;
