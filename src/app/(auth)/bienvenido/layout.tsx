import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "SISTEC | Bienvenido",
};

export default function WelcomeLayout({ children }: PropsWithChildren) {
  return children;
}
