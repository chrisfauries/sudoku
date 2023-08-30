import React, { useMemo } from "react";
import Cell from "../Cell";

interface Row {
  row: number;
}

const generateCells = (row: number) =>
  new Array(9).fill(null).map((_, i) => <Cell key={i} column={i} row={row} />);

const Row: React.FC<Row> = ({ row }) => {
  const cells = useMemo(() => generateCells(row), [row]);
  return <>{cells}</>;
};

export default React.memo(Row);
