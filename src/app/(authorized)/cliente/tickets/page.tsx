"use client";

import { useRouter } from "nextjs-toploader/app";
import { Box, Typography } from "@mui/material";
import Button from "@/components/Buttton";
import TicketsTable from "@/components/TicketsTable";
import useClientTicket from "@/hooks/useClientTickets";

export default function TicketsPage() {
  const { tickets } = useClientTicket();
  const router = useRouter();

  if (!tickets) return;
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Tickets de Soporte
        </Typography>
        <Box display="flex" gap={2}>
          <Button color="green" onClick={() => router.push("/cliente/tickets/crear")}>
            Nuevo Ticket
          </Button>
        </Box>
      </Box>

      <TicketsTable data={tickets ?? []} role="client" />
    </Box>
  );
}
