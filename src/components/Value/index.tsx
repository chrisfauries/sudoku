import classNames from "classnames";
import React from "react";
import { DataType } from "../../event-handlers/utils";
import styles from "./styles.module.scss";

interface Value {
  value: number;
}

const Value: React.FC<Value> = ({ value }) => (
  <button
    className={classNames(styles.container, styles.btn)}
    data-type={DataType[DataType.SELECTOR]}
    data-value={value}
  >
    {value ? value : "E"}
  </button>
);

export default React.memo(Value);
