"use server";

import { Metadata } from "next";
import ComponentesPageClient from "./client";
import { fetchComponents } from "@/hooks/useComponents";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "SISTEC | Administrador | Componentes",
  };
}

export default async function ComponentesPage() {
  return <ComponentesPageClient data={await fetchComponents()} />;
}
