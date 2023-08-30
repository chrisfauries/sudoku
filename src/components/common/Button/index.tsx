import classNames from "classnames";
import React from "react";
import { DataType } from "../../../event-handlers/utils";
import styles from "./styles.module.scss";

interface Props {
  dataType: DataType;
  text: string;
}

const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > &
    Props
> = ({ dataType, text, ...rest }) => {
  return (
    <button
      {...rest}
      className={classNames(styles.base, rest.className)}
      data-type={DataType[dataType]}
    >
      {text}
    </button>
  );
};

export default Button;
