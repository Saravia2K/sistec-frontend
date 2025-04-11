"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Grid,
  Paper,
  Table,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import Button from "@/components/Buttton";
import Select from "@/components/Select";
import MenuItem from "@mui/material/MenuItem";
import { format } from "date-fns";
import { truncateText } from "@/lib/helpers";
import { ETicketStatus } from "@/lib/enums";
import Swal from "sweetalert2";

// Tipos para los enums de Prisma
type TicketPriority = "low" | "medium" | "high" | "critical";

// Mapeo de estados para mostrar en español
const statusMap = {
  [ETicketStatus.PENDING]: "Pendiente",
  [ETicketStatus.IN_PROGRESS]: "En Progreso",
  [ETicketStatus.COMPLETED]: "Resuelto",
  [ETicketStatus.CANCELED]: "Cancelado",
};

// Mapeo de prioridades para mostrar en español
const priorityMap = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Crítica",
};

// Colores para las prioridades
const priorityColors = {
  low: "#8bc34a",
  medium: "#ffc107",
  high: "#ff9800",
  critical: "#f44336",
};

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

// Opciones para el filtro de prioridad
const priorityOptions = [
  { value: "all", label: "Todas las prioridades" },
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Crítica" },
];

// Opciones para el filtro de estado
const statusOptions = [
  { value: "all", label: "Todos los estados" },
  { value: ETicketStatus.PENDING, label: "Pendiente" },
  { value: ETicketStatus.IN_PROGRESS, label: "En Progreso" },
  { value: ETicketStatus.COMPLETED, label: "Resuelto" },
  { value: ETicketStatus.CANCELED, label: "Cancelado" },
];

export default function TicketsPage() {
  // Estado para los filtros
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredTickets, setFilteredTickets] = useState(ticketsData);
  const router = useRouter();

  // Aplicar filtros cuando cambien
  useEffect(() => {
    let result = [...ticketsData];

    // Filtrar por fecha de inicio
    if (startDate) {
      result = result.filter((ticket) => {
        return new Date(ticket.creationDate) >= startDate;
      });
    }

    // Filtrar por fecha de fin
    if (endDate) {
      result = result.filter((ticket) => {
        return new Date(ticket.creationDate) <= endDate;
      });
    }

    // Filtrar por prioridad
    if (priorityFilter != "all") {
      result = result.filter((ticket) => ticket.priority === priorityFilter);
    }

    // Filtrar por estado
    if (statusFilter != "all") {
      result = result.filter((ticket) => ticket.status === statusFilter);
    }

    setFilteredTickets(result);
  }, [startDate, endDate, priorityFilter, statusFilter]);

  // Funciones para manejar acciones
  const handleEdit = (id: number) => {
    console.log("Editar ticket:", id);
    // Aquí iría la lógica para abrir el formulario de edición
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí iría la lógica para eliminar el ticket
        setFilteredTickets(
          filteredTickets.filter((ticket) => ticket.id !== id)
        );

        Swal.fire(
          "¡Eliminado!",
          "El ticket ha sido eliminado correctamente.",
          "success"
        );
      }
    });
  };

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

      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Grid container spacing={3} justifyContent="flex-end">
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <DatePicker
              label="Fecha Inicial"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              maxDate={new Date()}
              slotProps={{
                actionBar: {
                  actions: ["clear", "accept", "cancel", "today"],
                },
                textField: {
                  fullWidth: true,
                  size: "small",
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <DatePicker
              label="Fecha Final"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={startDate as Date}
              maxDate={new Date()}
              slotProps={{
                actionBar: {
                  actions: ["clear", "accept", "cancel", "today"],
                },
                textField: {
                  fullWidth: true,
                  size: "small",
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Select
              fullWidth
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              label="Filtrar por prioridad"
            >
              {priorityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Select
              fullWidth
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              label="Filtrar por estado"
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de tickets */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Técnico</TableCell>
                <TableCell>Dispositivo</TableCell>
                <TableCell>Marca/Modelo</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Prioridad</TableCell>
                <TableCell>N° Serie</TableCell>
                <TableCell>Fecha Creación</TableCell>
                <TableCell>Fecha Cierre</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.technician}</TableCell>
                    <TableCell>{ticket.deviceType}</TableCell>
                    <TableCell>
                      {ticket.brand} {ticket.model}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={ticket.problemDescription}>
                        <span>
                          {truncateText(ticket.problemDescription, 100)}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{statusMap[ticket.status]}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: priorityColors[ticket.priority],
                          color: "white",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          display: "inline-block",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                        }}
                      >
                        {priorityMap[ticket.priority]}
                      </Box>
                    </TableCell>
                    <TableCell>{ticket.serialNumber}</TableCell>
                    <TableCell>
                      {format(new Date(ticket.creationDate), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      {ticket.closeDate
                        ? format(new Date(ticket.closeDate), "dd/MM/yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        {[
                          ETicketStatus.PENDING,
                          ETicketStatus.IN_PROGRESS,
                        ].includes(ticket.status as ETicketStatus) && (
                          <IconButton
                            size="small"
                            onClick={() =>
                              router.push(
                                `/cliente/tickets/${ticket.id}/editar`
                              )
                            }
                            sx={{ color: "#4caf50" }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                        {ticket.status == ETicketStatus.PENDING && (
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(ticket.id)}
                            sx={{ color: "#f44336" }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    align="center"
                    sx={{ border: 0, py: 3 }}
                  >
                    No se encontraron tickets con los filtros seleccionados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
