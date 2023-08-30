import { tryGetDataType, DataType } from "../utils";

const handleSelectorMouseDown = (e: MouseEvent) => {
  const focusedDataType =
    document.activeElement && tryGetDataType(document.activeElement);
  if (focusedDataType === DataType.CELL) {
    e.preventDefault();
  }
};

export default handleSelectorMouseDown;
