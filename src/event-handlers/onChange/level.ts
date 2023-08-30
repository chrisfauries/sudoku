import { SetterOrUpdater } from "recoil";
import { Level } from "../../state/level";

const handleLevelChange = (
  el: HTMLSelectElement,
  setLevel: SetterOrUpdater<Level>
) => {
  const level = parseInt(el.value) as Level;
  setLevel(level);
};

export default handleLevelChange;
