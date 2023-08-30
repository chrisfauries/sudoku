import { DataType, tryGetDataType } from "../utils";
import handleSelectorMouseDown from "./selector";

const OnMouseDown = () => (e: MouseEvent) => {
  const dataType = tryGetDataType(e.target as Element);

  if (dataType === null) {
    return;
  }

  switch (dataType) {
    case DataType.SELECTOR:
      return handleSelectorMouseDown(e);
  }
};

export default OnMouseDown;
