import { DataType, getDataInt, getParentByDataType } from "../utils";

const handleCellFocus = (el: Element) => {
  const row = getDataInt(el, "row");
  const column = getDataInt(el, "column");
  const value = getDataInt(el, "value");

  const parent = getParentByDataType(el, DataType.GRID);
  
  if (!parent) return;

  parent.setAttribute("data-selected-row", row.toString());
  parent.setAttribute("data-selected-column", column.toString());
  parent.setAttribute("data-selected-value", value.toString());
};

export default handleCellFocus;
