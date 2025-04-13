"use client";

import { Fragment, type PropsWithChildren } from "react";
import Navbar from "@/layouts/Navbar";
import { Container } from "@mui/material";
import ProtectedRoute from "@/components/ProtectedRoute";

import styles from "./styles.module.scss";

export default function AuthorizedLayout({ children }: PropsWithChildren) {
  return (
    <Fragment>
      <ProtectedRoute>
        <Navbar />
        <Container maxWidth="xl" className={styles.container}>
          {children}
        </Container>
      </ProtectedRoute>
    </Fragment>
  );
}
