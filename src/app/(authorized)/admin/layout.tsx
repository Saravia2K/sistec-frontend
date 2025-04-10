import { type Metadata } from "next";
import { type PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "SISTEC | Administrador",
};

export default function AdminLAyout({ children }: PropsWithChildren) {
  return children;
}
