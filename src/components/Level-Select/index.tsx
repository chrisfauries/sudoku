import React from "react";
import { useRecoilValue } from "recoil";
import { EnumContent } from "../../data/content";
import { DataType } from "../../event-handlers/utils";
import level, { Level } from "../../state/level";
import { getEnumKeys } from "../../state/utils";

const options = getEnumKeys(Level).map((level) => {
  return (
    <option key={level} value={level}>
      {EnumContent.getContent(Level, level)}
    </option>
  );
});

const LevelSelect = () => {
  const selectedLevel = useRecoilValue(level.get);
  return (
    <select data-type={DataType[DataType.LEVEL]} defaultValue={selectedLevel}>
      {options}
    </select>
  );
};

export default React.memo(LevelSelect);
