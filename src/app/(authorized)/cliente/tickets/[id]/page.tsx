"use client";

import ClientTicket from "@/Forms/ClientTicket";
import useTicket from "@/hooks/useTicket";
import { Typography } from "@mui/material";
import { useParams } from "next/navigation";

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { ticket } = useTicket(+id);

  if (!ticket) return;
  return (
    <>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Detalles del ticket
      </Typography>

      <ClientTicket
        watch
        ticket={{
          brand: ticket.brand,
          deviceTypeId: ticket.deviceType.id,
          id: ticket.id,
          problemDescription: ticket.problemDescription,
          model: ticket.model,
          serialNumber: ticket.serialNumber,
        }}
      />
    </>
  );
}
