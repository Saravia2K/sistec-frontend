import ProtectedRoute from "@/components/ProtectedRoute";
import { type Metadata } from "next";
import { type PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "SISTEC | Bienvenido",
};

export default function WelcomeLayout({ children }: PropsWithChildren) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
