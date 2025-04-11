"use client";

import ClientTicket from "@/Forms/ClientTicket";
import { Typography } from "@mui/material";
import { useParams } from "next/navigation";

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Detalles del ticket
      </Typography>

      <ClientTicket
        watch
        ticket={{
          brand: "Marca",
          deviceTypeId: 1,
          id: 1,
          problemDescription: "Descripción del problema",
          model: "Modelo",
          serialNumber: "Número de serie",
        }}
      />
    </>
  );
}
