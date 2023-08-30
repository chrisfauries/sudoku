import { DataType, getDataInt, getParentByDataType, tryGetDataType } from "../utils";

const handleCellBlur = (el: Element) => {
  const parent = getParentByDataType(el, DataType.GRID);

  if (!parent) return;

  parent.setAttribute("data-selected-row", "-1");
  parent.setAttribute("data-selected-column", "-1");
  parent.setAttribute("data-selected-value", "-1");
};

export default handleCellBlur;