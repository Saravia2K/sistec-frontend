"use client";

import { Box, Typography } from "@mui/material";
import TicketsTable from "@/components/TicketsTable";
import useTickets from "@/hooks/useTickets";

export default function TicketsPage() {
  const { tickets } = useTickets();

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

      <TicketsTable data={tickets ?? []} role="admin" />
    </Box>
  );
}
