"use client";

import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import Button from "@/components/Buttton";
import { ETicketStatus } from "@/lib/enums";
import TicketsTable from "@/components/TicketsTable";
import useClientTicket from "@/hooks/useClientTickets";

// Tipos para los enums de Prisma
type TicketPriority = "low" | "medium" | "high" | "critical";

// Datos de ejemplo para los tickets
const ticketsData = [
  {
    id: 1,
    technician: "Ana Martínez",
    deviceType: "Laptop",
    brand: "HP",
    model: "Pavilion 15",
    problemDescription:
      "El equipo no enciende correctamente. Se queda en la pantalla de inicio y luego se apaga. Ya se intentó reiniciar varias veces sin éxito.",
    status: ETicketStatus.PENDING,
    priority: "high" as TicketPriority,
    serialNumber: "HP78945612",
    creationDate: new Date("2025-03-15"),
    closeDate: null,
  },
  {
    id: 2,
    technician: "Roberto Sánchez",
    deviceType: "Desktop",
    brand: "Dell",
    model: "Optiplex 7090",
    problemDescription:
      "Problemas con el sistema operativo. Windows muestra pantalla azul al iniciar aplicaciones pesadas.",
    status: ETicketStatus.IN_PROGRESS,
    priority: "medium" as TicketPriority,
    serialNumber: "DL45678923",
    creationDate: new Date("2025-03-18"),
    closeDate: null,
  },
  {
    id: 3,
    technician: "Laura Gómez",
    deviceType: "Impresora",
    brand: "Epson",
    model: "L3150",
    problemDescription:
      "No imprime correctamente. Las hojas salen con manchas y rayas.",
    status: ETicketStatus.COMPLETED,
    priority: "low" as TicketPriority,
    serialNumber: "EP12345678",
    creationDate: new Date("2025-03-10"),
    closeDate: new Date("2025-03-12"),
  },
  {
    id: 4,
    technician: "Carlos Rodríguez",
    deviceType: "Smartphone",
    brand: "Samsung",
    model: "Galaxy S22",
    problemDescription:
      "La batería se descarga muy rápido y el dispositivo se calienta demasiado.",
    status: ETicketStatus.PENDING,
    priority: "critical" as TicketPriority,
    serialNumber: "SM98765432",
    creationDate: new Date("2025-03-20"),
    closeDate: null,
  },
  {
    id: 5,
    technician: "María López",
    deviceType: "Tablet",
    brand: "Apple",
    model: "iPad Pro 12.9",
    problemDescription:
      "La pantalla táctil no responde correctamente en ciertas áreas.",
    status: ETicketStatus.COMPLETED,
    priority: "high" as TicketPriority,
    serialNumber: "AP87654321",
    creationDate: new Date("2025-03-17"),
    closeDate: null,
  },
];

export default function TicketsPage() {
  const { tickets } = useClientTicket();
  const router = useRouter();

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
          Tickets de Soporte
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            color="green"
            onClick={() => router.push("/cliente/tickets/crear")}
          >
            Nuevo Ticket
          </Button>
        </Box>
      </Box>

      <TicketsTable data={tickets ?? []} role="client" />
    </Box>
  );
}
