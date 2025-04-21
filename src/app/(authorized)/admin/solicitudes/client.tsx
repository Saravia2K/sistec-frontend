"use client";

import { Box, Typography } from "@mui/material";
import TicketsTable from "@/components/TicketsTable";
import useTickets from "@/hooks/useTickets";
import type { TTicket } from "@/lib/types";

export default function TicketsPageClient({ data }: TTicketsPageClientProps) {
  const { tickets, refetchTicket } = useTickets(data);

  if (!tickets) return;
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Solicitudes
        </Typography>
      </Box>

      <TicketsTable data={tickets ?? []} role="admin" update={() => refetchTicket()} />
    </Box>
  );
}

type TTicketsPageClientProps = {
  data?: TTicket[];
};
