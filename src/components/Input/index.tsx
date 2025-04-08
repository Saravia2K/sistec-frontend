"use client";

import { TextField, TextFieldProps } from "@mui/material";
import classnames from "classnames";

import styles from "./styles.module.scss";

export default function Input(props: TProps) {
  return (
    <TextField
      {...props}
      className={classnames({
        [`${props.className}`]: !!props.className,
        [styles.input]: true,
      })}
    />
  );
}

type TProps = Readonly<TextFieldProps>;
