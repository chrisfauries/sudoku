import { atom, selector } from "recoil";
import available from "./available";
import { LocalStorage } from "./local-storage";

const hintAtom = atom({
  key: "hint/hint-atom",
  default: LocalStorage.get().hint ?? false,
  effects: [LocalStorage.effect("hint")],
});

const toggleHint = selector({
  key: "hint/toggleHint",
  get: ({ getCallback }) =>
    getCallback(({ snapshot, set }) => async () => {
      const newValue = !(await snapshot.getPromise(hintAtom));
      set(hintAtom, newValue);
      newValue && (await snapshot.getPromise(available.generate))();
    }),
});

export default { get: hintAtom, toggle: toggleHint };
