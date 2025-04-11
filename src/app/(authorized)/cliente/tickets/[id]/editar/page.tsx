"use client";

import ClientTicket from "@/Forms/ClientTicket";
import { Box, Typography } from "@mui/material";

export default function ClientEditTicketForm() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Editar Ticket de Soporte
      </Typography>

      <ClientTicket
        ticket={{
          brand: "Marca",
          deviceTypeId: 1,
          id: 1,
          problemDescription: "Descripción del problema",
          model: "Modelo",
          serialNumber: "Número de serie",
        }}
      />
    </Box>
  );
}
