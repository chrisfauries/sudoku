import React from "react";
import { DataType } from "../../event-handlers/utils";
import Button from "../common/Button";
import Grid from "../Grid";
import LevelSelect from "../Level-Select";
import Pause from "../Pause";
import Timer from "../Timer";
import Values from "../Values";
import styles from "./styles.module.scss";
import content from "../../data/content";
import Hint from "../Hint";

const Sudoku = () => {
  return (
    <div className={styles.container}>
      <Grid />
      <Values />
      <Button
        dataType={DataType.NEW_GAME}
        text={content.NEW_GAME_BUTTON_TEXT}
      />
      <Pause />
      <Timer />
      <LevelSelect />
      <Hint />
    </div>
  );
};

export default React.memo(Sudoku);
