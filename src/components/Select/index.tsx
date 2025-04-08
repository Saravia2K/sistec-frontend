import {
  InputLabel,
  FormControl,
  InputLabelProps,
  type SelectProps,
  FormControlProps,
  Select as MUISelect,
} from "@mui/material";
import classNames from "classnames";

import styles from "./styles.module.scss";

export default function Select({
  formControlProps,
  inputLabelProps,
  ...selectProps
}: TProps) {
  return (
    <FormControl
      {...formControlProps}
      className={classNames({
        [`${formControlProps?.className}`]: !!formControlProps?.className,
        [styles.select]: true,
      })}
    >
      <InputLabel {...inputLabelProps}>{selectProps.label}</InputLabel>
      <MUISelect {...selectProps} />
    </FormControl>
  );
}

type TProps = Readonly<
  SelectProps & {
    formControlProps?: FormControlProps;
    inputLabelProps?: InputLabelProps;
  }
>;
