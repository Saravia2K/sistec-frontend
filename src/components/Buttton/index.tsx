import { type PropsWithChildren } from "react";
import { Button as MUIButton } from "@mui/material";
import { COLORS } from "@/lib/consts";

export default function Button({ children, color, icon, table }: TProps) {
  return (
    <MUIButton
      children={children}
      variant="contained"
      sx={{
        textTransform: "none",
        bgcolor: COLORS[color.toUpperCase() as keyof typeof COLORS],
        boxShadow: "none",
        px: icon ? 1 : 4,
        py: icon ? 1 : "3px",
        borderRadius: icon && table ? undefined : 10,
        width: icon ? "fit-content" : undefined,
        minWidth: icon ? "auto" : undefined,
      }}
    />
  );
}

type TProps = PropsWithChildren<{
  color: "blue" | "green";
  icon?: boolean;
  table?: boolean;
}>;
