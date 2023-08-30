import { atom } from "recoil";
import { LocalStorage } from "./local-storage";

export enum Level {
  Test,
  Novice,
  Easy,
  Normal,
  Hard,
  Expert,
  Elite,
  Legend,
  Ultimate
}

const levelAtom = atom<Level>({
  key: "level/level-atom",
  default: LocalStorage.get().level ?? Level.Normal,
  effects: [LocalStorage.effect("level")],
});

export default { get: levelAtom, set: levelAtom };
