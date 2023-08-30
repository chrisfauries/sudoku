import moment from "moment";
import { atom, selector } from "recoil";
import { LocalStorage } from "./local-storage";

const unixStartAtom = atom({
  key: "time/unix-start-atom",
  default: -1,
});

const timeAtom = atom<number>({
  key: "time/time-atom",
  default: LocalStorage.get().time ?? 0,
  effects: [LocalStorage.effect("time")],
});

const time = selector({
  key: "time/getTime",
  get: ({ get }) => {
    const time = Math.floor(get(timeAtom) / 1000);
    if (time < 0) {
      return "00:00";
    }
    return moment("2020-01-01").add(time, "s").format("mm:ss");
  },
});

interface Controls {
  start: () => void;
  stop: () => void;
  reset: () => void;
}

const timeControls = selector<Controls>({
  key: "time/time-controls",
  get: ({ getCallback }) => {
    let cancelInt = -1;
    let isRunning = false;
    const start = getCallback(({ set, snapshot }) => async () => {
      if (isRunning) return;
      isRunning = true;
      const now = Date.now();
      let seconds = 0;
      let carry = await snapshot.getPromise(timeAtom);
      set(unixStartAtom, now);

      const check = () => {
        const diff = Date.now() - now - 1000;
        if (diff > seconds) {
          seconds += 1000;
          set(timeAtom, seconds + carry);
        }
        cancelInt = window.requestAnimationFrame(check);
      };

      cancelInt = window.requestAnimationFrame(check);
    });
    const stop = getCallback(({ set, snapshot }) => async () => {
      if (!isRunning) return;
      const carry = await snapshot.getPromise(timeAtom);
      const exactTotalTimeForSegment =
        Date.now() - (await snapshot.getPromise(unixStartAtom));
      set(timeAtom, (exactTotalTimeForSegment % 1000) + carry);
      window.cancelAnimationFrame(cancelInt);
      isRunning = false;
    });
    const reset = getCallback(({ set, reset }) => () => {
      window.cancelAnimationFrame(cancelInt);
      isRunning = false;
      set(timeAtom, 0);
      reset(unixStartAtom);
    });

    return {
      start,
      stop,
      reset,
    };
  },
});

export default { get: time, getMilli: timeAtom, controls: timeControls };
