import { Fragment } from "react";
import CssBaseline from "@mui/material/CssBaseline";

export default function Providers({ children }: TProps) {
  return (
    <Fragment>
      <CssBaseline />
      {children}
    </Fragment>
  );
}

type TProps = Readonly<{
  children: React.ReactNode;
}>;
