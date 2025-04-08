import { Fragment, type PropsWithChildren } from "react";
import Navbar from "@/layouts/Navbar";
import { Container } from "@mui/material";

export default function AuthorizedLayout({ children }: PropsWithChildren) {
  return (
    <Fragment>
      <Navbar />
      <Container maxWidth="xl" style={{ paddingTop: 50 }}>
        {children}
      </Container>
    </Fragment>
  );
}
