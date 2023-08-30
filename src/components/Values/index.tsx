import Value from "../Value";
import React from "react";
import styles from "./styles.module.scss";

const values = new Array(10)
  .fill(null)
  .map((_, i) => <Value key={i} value={i} />);

const Values: React.FC = () => <div className={styles.container}>{values}</div>;

export default React.memo(Values);
