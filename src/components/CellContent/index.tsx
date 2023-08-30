import React from "react";
import { useRecoilValue } from "recoil";
import cell from "../../state/cell";
import styles from "./styles.module.scss";

interface CellContent {
  row: number;
  column: number;
}

const CellContent: React.FC<CellContent> = ({ row, column }) => {
  const { displayValue, cornerValues, centerValues } = useRecoilValue(
    cell.get(row, column)
  );
  
  if (displayValue) {
    return <>{displayValue}</>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.corner}>{[...cornerValues].sort().join("")}</div>
      <div className={styles.center}>{[...centerValues].sort().join("")}</div>
    </div>
  );
};

export default React.memo(CellContent);
