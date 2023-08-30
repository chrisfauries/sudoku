import { DataType, tryGetDataType } from "../utils";
import handleCellFocus from "./cell";

const OnFocus = () => (e: FocusEvent) => {
  const dataType = tryGetDataType(e.target as Element);
  if (dataType === null) {
    return;
  }
  switch (dataType) {
    case DataType.CELL:
      return handleCellFocus(e.target as Element);
  }
};

export default OnFocus;