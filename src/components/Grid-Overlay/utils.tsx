import content from "../../data/content";

export const getText = (
  isPaused: boolean,
  isComplete: boolean,
  totalScore: number
) => {
  if (isPaused && isComplete) {
    return content.COMPLETE_SHADOW_BOX_TEXT + totalScore;
  }

  return isPaused ? content.PAUSE_SHADOW_BOX_TEXT : "";
};
