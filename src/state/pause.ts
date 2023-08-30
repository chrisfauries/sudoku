import { atom, selector } from "recoil";
import time from "./time";

const pauseAtom = atom({
  key: "pause/pause-atom",
  default: true,
});

const pauseSelector = selector({
  key: "pause/pause-selector",
  get: ({ getCallback }) => {
    return getCallback(({ set, snapshot }) => async () => {
      const newValue = !(await snapshot.getPromise(pauseAtom));
      const timerControls = await snapshot.getPromise(time.controls);
      timerControls[newValue ? "stop" : "start"]();
      set(pauseAtom, newValue);
    });
  },
});

export default { get: pauseAtom, toggle: pauseSelector };
