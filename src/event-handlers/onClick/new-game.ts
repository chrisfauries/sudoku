import { SetterOrUpdater } from "recoil";

const handleNewGameClick = (
  setGrid: SetterOrUpdater<void>,
  startTimer: () => void,
  resetTimer: () => void
) => {
  setGrid();
  resetTimer();
  startTimer();
};

export default handleNewGameClick;
