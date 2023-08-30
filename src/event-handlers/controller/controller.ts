import { SetterOrUpdater } from "recoil";
import { Level } from "../../state/level";
import handleLevelChange from "../onChange/level";
import handleHintClick from "../onClick/hint";
import handleNewGameClick from "../onClick/new-game";
import handlePauseClick from "../onClick/pause";
import handleSelectorClick from "../onClick/selector";
import { DataType, tryGetDataType } from "../utils";

type HandlerMap = {
  [key in keyof DocumentEventMap]: Partial<{
    [key in DataType]: (el: EventTarget | null) => void;
  }>;
};

const getHandlerMap = (
  tryUpdateCellOnSelectorClick: (value: number) => Promise<void>,
  setGrid: SetterOrUpdater<void>,
  togglePause: () => void,
  startTimer: () => void,
  resetTimer: () => void,
  toggleHint: () => void,
  setLevel: SetterOrUpdater<Level>
): Partial<HandlerMap> => ({
  click: {
    [DataType.SELECTOR]: (el) =>
      handleSelectorClick(
        el as HTMLButtonElement,
        tryUpdateCellOnSelectorClick
      ),
    [DataType.NEW_GAME]: () =>
      handleNewGameClick(setGrid, startTimer, resetTimer),
    [DataType.PAUSE]: () => handlePauseClick(togglePause),
    [DataType.HINT]: () => handleHintClick(toggleHint),
  },
  change: {
    [DataType.LEVEL]: (el) =>
      handleLevelChange(el as HTMLSelectElement, setLevel),
  },
});

const controller =
  <K extends keyof DocumentEventMap>(
    tryUpdateCellOnSelectorClick: (value: number) => Promise<void>,
    setGrid: SetterOrUpdater<void>,
    togglePause: () => void,
    startTimer: () => void,
    resetTimer: () => void,
    toggleHint: () => void,
    setLevel: SetterOrUpdater<Level>
  ) =>
  (e: DocumentEventMap[K], type: K) => {
    const dataType = tryGetDataType(e.target as Element);

    if (dataType === null) {
      return;
    }

    getHandlerMap(
      tryUpdateCellOnSelectorClick,
      setGrid,
      togglePause,
      startTimer,
      resetTimer,
      toggleHint,
      setLevel
    )[type]?.[dataType]?.(e.target);
  };

export default controller;
