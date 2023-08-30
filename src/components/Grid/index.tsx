import React from "react";
import { DataType } from "../../event-handlers/utils";
import GridOverlay from "../Grid-Overlay";
import Row from "../Row";
import styles from "./styles.module.scss";

const rows = new Array(9).fill(null).map((_, i) => <Row key={i} row={i} />);

const Grid: React.FC = () => {
  return (
    <div className={styles.container} data-type={DataType[DataType.GRID]}>
      <GridOverlay />
      {rows}
    </div>
  );
};

export default React.memo(Grid);
