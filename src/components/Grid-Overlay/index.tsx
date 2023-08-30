import classNames from "classnames";
import { useRecoilValue } from "recoil";
import pause from "../../state/pause";
import styles from "./styles.module.scss";
import complete from "../../state/complete";
import { useMemo } from "react";
import { getText } from "./utils";
import score from "../../state/score";
import React from "react";


const GridOverlay = () => {
  const isPaused = useRecoilValue(pause.get);
  const isComplete = useRecoilValue(complete.isComplete);
  const totalScore = useRecoilValue(score.get);

  const displayText = useMemo(
    () => getText(isPaused, isComplete, totalScore),
    [isPaused, isComplete, totalScore]
  );
  return (
    <div
      className={classNames(styles.container, {
        [styles["is-paused"]]: isPaused,
      })}
    >
      {displayText}
    </div>
  );
};

export default React.memo(GridOverlay);
