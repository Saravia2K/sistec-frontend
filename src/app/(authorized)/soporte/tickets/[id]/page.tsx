"use client";

import TechnicianTicket from "@/Forms/TechnicianTicket";
import useTicket from "@/hooks/useTicket";
import { useParams } from "next/navigation";

export default function TechnicianTicketDetailsPage() {
  const { id: ticketId } = useParams<{ id: string }>();
  const { ticket, refetchTicket } = useTicket(+ticketId);

  if (!ticket) return;
  return <TechnicianTicket ticket={ticket} onStateUpdate={refetchTicket} />;
}
