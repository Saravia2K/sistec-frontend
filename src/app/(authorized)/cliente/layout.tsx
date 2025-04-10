import { Metadata } from "next";
import { type PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "SISTEC | Cliente",
};

export default function ClienteLayout({ children }: PropsWithChildren) {
  return children;
}
