import { Level } from "../state/level";

type LevelPrefix = "DIFFICULTY_LEVEL_SELECTOR";

type LevelKeys = `${LevelPrefix}_${keyof typeof Level}`;

type EnumKeys = {
  [key in LevelKeys]: string;
};

export class EnumContent {
  private static unsupportedCopy = "***Unknown***";
  private static enumToPrefixMap: Map<Record<string, string | number>, string> =
    new Map([[Level, "DIFFICULTY_LEVEL_SELECTOR"]]);
  public static content: EnumKeys = {
    DIFFICULTY_LEVEL_SELECTOR_Test: "***TEST***",
    DIFFICULTY_LEVEL_SELECTOR_Novice: "Novice",
    DIFFICULTY_LEVEL_SELECTOR_Easy: "Easy",
    DIFFICULTY_LEVEL_SELECTOR_Normal: "Normal",
    DIFFICULTY_LEVEL_SELECTOR_Hard: "Hard",
    DIFFICULTY_LEVEL_SELECTOR_Expert: "Expert",
    DIFFICULTY_LEVEL_SELECTOR_Elite: "Elite",
    DIFFICULTY_LEVEL_SELECTOR_Legend: "Legend",
    DIFFICULTY_LEVEL_SELECTOR_Ultimate: "Ultimate",
  };

  private static warnUnsupportedEnum = (e: any) => {
    console.warn("This enum is not supported by the content resolver: ", e);
    return this.unsupportedCopy;
  };

  private static warnUnsupportedEnumValue = (e: any, v: any) => {
    console.warn(
      "This enum value is not supported by the content resolver:",
      `"${e[v]}"`,
      "from enum: ",
      e
    );
    return e[v] ?? "";
  };

  public static getContent<
    Enum extends Record<string | number, string | number>,
    K extends keyof Enum
  >(e: Enum, value: Enum[K]) {
    const prefix = this.enumToPrefixMap.get(e);
    if (!prefix) {
      return this.warnUnsupportedEnum(e);
    }

    const contentValue = `${prefix}_${e[value]}`;

    if (contentValue in content) {
      return content[contentValue as keyof typeof content];
    }

    return this.warnUnsupportedEnumValue(e, value);
  }
}

export type EnumPrefix = LevelPrefix;

const singletonContent = {
  NEW_GAME_BUTTON_TEXT: "New Game",
  PAUSE_BUTTON_PAUSED_TEXT: "Pause",
  PAUSE_BUTTON_UNPAUSED_TEXT: "Unpause",
  PAUSE_SHADOW_BOX_TEXT: "Paused",
  COMPLETE_SHADOW_BOX_TEXT: "You won!! Congrats! You're score was: ",
};

const content = {
  ...singletonContent,
  ...EnumContent.content,
};

export default content;
