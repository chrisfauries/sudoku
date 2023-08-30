import React, { PropsWithChildren, useMemo } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useDocumentEvent from "../../hooks/useDocumentEvent";
import blanks from "../../state/blanks";
import grid from "../../state/grid";
import level from "../../state/level";
import pause from "../../state/pause";
import time from "../../state/time";
import handleMouseDown from "../../event-handlers/onMouseDown";
import handleOnFocus from "../../event-handlers/onFocus";
import handleOnBlur from "../../event-handlers/onBlur";
import hint from "../../state/hint";
import handleArrowKeyMovement from "../../event-handlers/onKeyDown/arrow-movement";
import controller from "../../event-handlers/controller/controller";

const EventBoundary: React.FC<PropsWithChildren> = ({ children }) => {
  const { start, reset } = useRecoilValue(time.controls);
  const setGrid = useSetRecoilState(grid.set);
  const tryUpdateCellOnKeyDown = useRecoilValue(blanks.onKeyDown);
  const tryUpdateCellOnSelectorClick = useRecoilValue(blanks.onClick);
  const setLevel = useSetRecoilState(level.set);
  const togglePause = useRecoilValue(pause.toggle);
  const toggleToggle = useRecoilValue(hint.toggle);

  const handler = useMemo(
    () =>
      controller(
        tryUpdateCellOnSelectorClick,
        setGrid,
        togglePause,
        start,
        reset,
        toggleToggle,
        setLevel
      ),
    [
      tryUpdateCellOnSelectorClick,
      setGrid,
      togglePause,
      start,
      reset,
      toggleToggle,
      setLevel,
    ]
  );

  const onMouseDown = useMemo(() => handleMouseDown(), []);
  const onFocus = useMemo(() => handleOnFocus(), []);
  const onBlur = useMemo(() => handleOnBlur(), []);

  useDocumentEvent("keydown", tryUpdateCellOnKeyDown, handleArrowKeyMovement);
  useDocumentEvent("change", handler);
  useDocumentEvent("click", handler);
  useDocumentEvent("blur", onBlur);
  useDocumentEvent("focus", onFocus);
  useDocumentEvent("mousedown", onMouseDown);

  return <>{children}</>;
};

export default EventBoundary;
