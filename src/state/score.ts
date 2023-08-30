import { selector } from "recoil";
import level, { Level } from "./level";
import time from "./time";
import { getTimeScore, LEVEL_TO_SCORE_MULTIPLIER } from "./utils";

const score = selector({
  key: "score/score",
  get: ({ get }) => {
    const timeScore = getTimeScore(get(time.getMilli));
    const levelMultiplier = LEVEL_TO_SCORE_MULTIPLIER[get(level.get) as Level];
    return timeScore * levelMultiplier;
  },
});

export default { get: score };
