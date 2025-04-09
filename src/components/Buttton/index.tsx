import { type PropsWithChildren } from "react";
import { Button as MUIButton } from "@mui/material";
import { COLORS } from "@/lib/consts";

export default function Button({ children, color }: TProps) {
  return (
    <MUIButton
      children={children}
      variant="contained"
      sx={{
        textTransform: "none",
        bgcolor: COLORS[color.toUpperCase() as keyof typeof COLORS],
        boxShadow: "none",
        px: 4,
        py: "3px",
        borderRadius: 10,
      }}
    />
  );
}

type TProps = PropsWithChildren<{
  color: "blue" | "green";
}>;
