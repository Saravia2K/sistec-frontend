import { Box } from "@mui/material";
import { type PropsWithChildren } from "react";

export default function AuthPagesLayout({ children }: PropsWithChildren) {
  return (
    <Box
      width="100vw"
      height="100dvh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {children}
    </Box>
  );
}
