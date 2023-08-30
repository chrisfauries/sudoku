import { useRecoilValue } from "recoil";
import time from "../../state/time";

const Timer = () => {
  const timer = useRecoilValue(time.get);
  return <h3>{timer}</h3>;
};

export default Timer;
