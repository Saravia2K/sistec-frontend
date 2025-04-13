"use client";

import ClientTicket from "@/Forms/ClientTicket";
import useTicket from "@/hooks/useTicket";
import { Box, Typography } from "@mui/material";
import { useParams } from "next/navigation";

export default function ClientEditTicketForm() {
  const { id } = useParams<{ id: string }>();
  const { ticket } = useTicket(+id);

  if (!ticket) return;
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Editar Ticket de Soporte
      </Typography>

      <ClientTicket
        ticket={{
          brand: ticket.brand,
          deviceTypeId: ticket.deviceType.id,
          id: ticket.id,
          problemDescription: ticket.problemDescription,
          model: ticket.model,
          serialNumber: ticket.serialNumber,
        }}
      />
    </Box>
  );
}
