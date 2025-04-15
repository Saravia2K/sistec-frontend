"use client";

import TechnicianTicket from "@/Forms/TechnicianTicket";
import useTicket from "@/hooks/useTicket";
import { useParams } from "next/navigation";

export default function DetalleSolicitud() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { ticket } = useTicket(+ticketId);

  if (!ticket) return;
  return <TechnicianTicket ticket={ticket} watch />;
}
