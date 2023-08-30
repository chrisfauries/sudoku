import { useRecoilValue } from 'recoil';
import { DataType } from '../../event-handlers/utils';
import hint from '../../state/hint';
import Button from '../common/Button';

const Hint = () => {
    const value = useRecoilValue(hint.get);
  return (
    <Button dataType={DataType.HINT} text={`Hint: ${value}`} />
  )
}

export default Hint;