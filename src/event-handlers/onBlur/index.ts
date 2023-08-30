import { DataType, tryGetDataType } from "../utils";
import handleCellBlur from "./cell";

const OnBlur = () => (e: FocusEvent) => {
  const dataType = tryGetDataType(e.target as Element);

  if (dataType === null) {
    return;
  }

  switch (dataType) {
    case DataType.CELL:
      return handleCellBlur(e.target as Element);
  }
};

export default OnBlur;