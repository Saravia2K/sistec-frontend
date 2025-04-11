"use client";

import ClientNewTicket from "@/Forms/ClientNewTicket";
import { Box, Typography } from "@mui/material";

export default function SupportTicketForm() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Nuevo Ticket de Soporte
      </Typography>

      <ClientNewTicket />
    </Box>
  );
}
