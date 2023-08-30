import Tippy from "@tippyjs/react";
import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { DataType } from "../../event-handlers/utils";
import cell from "../../state/cell";
import { buildStyles, isHintDisabled, isWrong } from "./utils";
import "tippy.js/dist/tippy.css";
import available from "../../state/available";
import CellContent from "../CellContent";

interface Cell {
  row: number;
  column: number;
}

const Cell: React.FC<Cell> = ({ row, column }) => {
  const { solvedValue, playerValue, displayValue, isDeleted, isHintEnabled } =
    useRecoilValue(cell.get(row, column));

  const availableList = useRecoilValue(available.get(row, column));
  const className = useMemo(
    () => buildStyles(isDeleted, column, row, playerValue, solvedValue),
    [isDeleted, column, row, playerValue, solvedValue]
  );

  return (
    <Tippy
      content={`${availableList.join(", ")}`}
      disabled={isHintDisabled(
        isHintEnabled,
        isDeleted,
        playerValue,
        solvedValue
      )}
    >
      <button
        className={className}
        data-row={row}
        data-column={column}
        data-value={isWrong(playerValue, solvedValue) ? "-1" : displayValue}
        data-type={DataType[DataType.CELL]}
      >
        <CellContent row={row} column={column} />
      </button>
    </Tippy>
  );
};

export default React.memo(Cell);
