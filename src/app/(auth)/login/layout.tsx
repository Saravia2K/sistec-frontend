import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "SISTEC | Login",
};

export default function LoginLayout({ children }: PropsWithChildren) {
  return children;
}
