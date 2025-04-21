"use server";

import { type Metadata } from "next";
import TicketsPageClient from "./client";
import { fetchTickets } from "@/hooks/useTickets";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "SISTEC | Administrador | Solicitudes",
  };
};

export default async function TicketsPage() {
  return <TicketsPageClient data={await fetchTickets()} />;
}
