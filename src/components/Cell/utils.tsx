import classNames from "classnames";
import styles from "./styles.module.scss";

export const isHintDisabled = (
  isHintEnabled: boolean,
  isDeleted: boolean,
  playerValue?: number,
  solvedValue?: number
) => !isHintEnabled || !(isEmpty(isDeleted, solvedValue) || isWrong(playerValue, solvedValue));

const isEmpty = (isDeleted: boolean, solvedValue?: number) =>
  isDeleted || (solvedValue && solvedValue < 0);

export const isWrong = (playerValue?: number,
    solvedValue?: number) => !!playerValue && playerValue !== solvedValue

export const buildStyles = (
  isDeleted: boolean,
  column: number,
  row: number,
  playerValue?: number,
  solvedValue?: number
) =>
  classNames(styles.container, {
    [styles.correct]: playerValue === solvedValue,
    [styles.wrong]: isWrong(playerValue, solvedValue),
    [styles.empty]: isEmpty(isDeleted, solvedValue),
    [styles["right-edge"]]: column === 2 || column === 5,
    [styles["top-edge"]]: row === 3 || row === 6,
  });
