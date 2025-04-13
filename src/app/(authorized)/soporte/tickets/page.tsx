"use client";

import { Box, Typography } from "@mui/material";
import TicketsTable from "@/components/TicketsTable";
import useAssignedTickets from "@/hooks/useAssignedTickets";

export default function TicketsPage() {
  const { tickets } = useAssignedTickets();

  if (!tickets) return;
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Solicitudes
        </Typography>
      </Box>

      <TicketsTable data={tickets ?? []} role="support" />
    </Box>
  );
}
