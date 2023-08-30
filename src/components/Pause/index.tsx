import { useRecoilValue } from "recoil";
import { DataType } from "../../event-handlers/utils";
import pause from "../../state/pause";
import Button from "../common/Button";
import content from "../../data/content";

const Pause = () => {
  const isPaused = useRecoilValue(pause.get);
  return (
    <Button
      dataType={DataType.PAUSE}
      text={
        isPaused
          ? content.PAUSE_BUTTON_UNPAUSED_TEXT
          : content.PAUSE_BUTTON_PAUSED_TEXT
      }
    />
  );
};

export default Pause;
