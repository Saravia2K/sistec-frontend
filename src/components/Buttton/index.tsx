import { type PropsWithChildren } from "react";
import { Button as MUIButton } from "@mui/material";
import { COLORS } from "@/lib/consts";

export default function Button({
  children,
  color,
  icon,
  type,
  onClick,
  buttonType,
  disabled,
}: TProps) {
  const _color = COLORS[color.toUpperCase() as keyof typeof COLORS];
  return (
    <MUIButton
      children={children}
      variant="contained"
      sx={{
        textTransform: "none",
        bgcolor: type == "outlined" ? "transparent" : _color,
        border: type == "outlined" ? `5px solid ${_color}` : undefined,
        boxShadow: "none",
        px: icon ? 1 : 4,
        py: icon ? 1 : "3px",
        borderRadius: icon && type == "table" ? undefined : 10,
        width: icon ? "fit-content" : undefined,
        minWidth: icon ? "auto" : undefined,
      }}
      onClick={onClick}
      type={buttonType}
      disabled={disabled}
    />
  );
}

type TProps = PropsWithChildren<{
  color: "blue" | "green";
  icon?: boolean;
  type?: "table" | "outlined";
  onClick?: () => void;
  buttonType?: "submit" | "reset" | "button";
  disabled?: boolean;
}>;
