"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "@/lib/axios";
import Swal from "sweetalert2";
import { format } from "date-fns";
import {
  Box,
  Grid,
  Paper,
  Table,
  Tooltip,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TableContainer,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

import Select from "@/components/Select";

import useTechnicians from "@/hooks/useTechnicians";
import { truncateText } from "@/lib/helpers";
import { ETicketPriority, ETicketStatus } from "@/lib/enums";
import { TTicket, TUser } from "@/lib/types";

// Mapeo de estados para mostrar en español
const statusMap = {
  [ETicketStatus.PENDING]: "Pendiente",
  [ETicketStatus.IN_PROGRESS]: "En Progreso",
  [ETicketStatus.COMPLETED]: "Resuelto",
  [ETicketStatus.CANCELED]: "Cancelado",
};

// Colores para las prioridades
const priorityColors = {
  low: "#8bc34a",
  medium: "#ffc107",
  high: "#ff9800",
  critical: "#f44336",
};

// Opciones para el filtro de prioridad
const priorityOptions = [
  { value: "all", label: "Todas las prioridades" },
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
];

const priorityLabels = {
  [ETicketPriority.high]: "Alta",
  [ETicketPriority.medium]: "Media",
  [ETicketPriority.low]: "Baja",
};

// Opciones para el filtro de estado
const statusOptions = [
  { value: "all", label: "Todos los estados" },
  { value: ETicketStatus.PENDING, label: "Pendiente" },
  { value: ETicketStatus.IN_PROGRESS, label: "En Progreso" },
  { value: ETicketStatus.COMPLETED, label: "Resuelto" },
  { value: ETicketStatus.CANCELED, label: "Cancelado" },
];

type UserRole = "admin" | "support" | "client";

interface TicketsTableProps {
  data: TTicket[];
  role: UserRole;
  technicians?: TUser[]; // Solo necesario para admin
  update?: () => void;
}

export default function TicketsTable({ data, role, update }: TicketsTableProps) {
  // Estado para los filtros
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredTickets, setFilteredTickets] = useState<TTicket[]>(data);
  const pathname = usePathname();
  const { technicians } = useTechnicians();

  // Aplicar filtros cuando cambien
  useEffect(() => {
    let result = [...data];

    // Filtrar por fecha de inicio
    if (startDate) {
      result = result.filter((ticket) => {
        return new Date(ticket.requestDate) >= startDate;
      });
    }

    // Filtrar por fecha de fin
    if (endDate) {
      result = result.filter((ticket) => {
        return new Date(ticket.requestDate) <= endDate;
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
  }, [startDate, endDate, priorityFilter, statusFilter, data]);

  // Función para cambiar el técnico asignado (solo admin)
  const handleTechnicianChange = async (ticketId: number, technicianId: number) => {
    try {
      await axios.patch(`/tickets/${ticketId}`, {
        assignedTechnicianId: technicianId,
      });

      if (update) update();
    } catch (error) {
      console.error("Error al cambiar técnico:", error);
      Swal.fire("Error", "No se pudo cambiar el técnico asignado", "error");
    }
  };

  // Función para cambiar la prioridad (solo admin)
  const handlePriorityChange = async (ticketId: number, priority: ETicketPriority) => {
    try {
      await axios.patch(`/tickets/${ticketId}`, {
        priority,
      });

      // Actualizar el estado local
      setFilteredTickets((prevTickets) =>
        prevTickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, priority } : ticket))
      );
    } catch (error) {
      console.error("Error al cambiar prioridad:", error);
      Swal.fire("Error", "No se pudo cambiar la prioridad", "error");
    }
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`/tickets/${id}`);
        // Aquí iría la lógica para eliminar el ticket
        setFilteredTickets(filteredTickets.filter((ticket) => ticket.id !== id));

        Swal.fire("¡Eliminado!", "El ticket ha sido eliminado correctamente.", "success");
      }
    });
  };

  // Determinar las columnas a mostrar según el rol
  const getColumns = () => {
    const baseColumns = [
      role === "admin"
        ? {
            id: "customer",
            label: "Cliente",
            render: (ticket: TTicket) => ticket.customer!.name || "N/A",
          }
        : role === "support"
        ? {
            id: "customer",
            label: "Cliente",
            render: (ticket: TTicket) => ticket.customer?.name || "N/A",
          }
        : {
            id: "technician",
            label: "Técnico",
            render: (ticket: TTicket) => ticket.assignedTechnician?.name || "Sin asignar",
          },
      {
        id: "deviceType",
        label: "Dispositivo",
        render: (ticket: TTicket) => ticket.deviceType?.name || "N/A",
      },
      {
        id: "brandModel",
        label: "Marca/Modelo",
        render: (ticket: TTicket) => `${ticket.brand} ${ticket.model}`,
      },
      {
        id: "description",
        label: "Descripción",
        render: (ticket: TTicket) => (
          <Tooltip title={ticket.problemDescription}>
            <span>{truncateText(ticket.problemDescription, 100)}</span>
          </Tooltip>
        ),
      },
      {
        id: "status",
        label: "Estado",
        render: (ticket: TTicket) => statusMap[ticket.status],
      },
      {
        id: "priority",
        label: "Prioridad",
        render: (ticket: TTicket) =>
          role === "admin" ? (
            <Select
              value={ticket.priority ?? 0}
              onChange={(e) => handlePriorityChange(ticket.id, e.target.value as ETicketPriority)}
              size="small"
              sx={{
                minWidth: 120,
                backgroundColor: priorityColors[ticket.priority],
                color: "white",
                "& .MuiSelect-select": {
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              {Object.entries(priorityLabels).map(([value, label]) => (
                <MenuItem key={value} value={value} sx={{ color: "black" }}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          ) : (
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
              {priorityLabels[ticket.priority]}
            </Box>
          ),
      },
      {
        id: "serialNumber",
        label: "N° Serie",
        render: (ticket: TTicket) => ticket.serialNumber,
      },
      {
        id: "creationDate",
        label: "Fecha Creación",
        render: (ticket: TTicket) => format(new Date(ticket.requestDate), "dd/MM/yyyy"),
      },
      {
        id: "closeDate",
        label: "Fecha Cierre",
        render: (ticket: TTicket) =>
          ticket.closeDate ? format(new Date(ticket.closeDate), "dd/MM/yyyy") : "-",
      },
      {
        id: "actions",
        label: "Acciones",
        render: (ticket: TTicket) => (
          <Box display="flex" gap={1}>
            <Link href={`${pathname}/${ticket.id}`}>
              <IconButton size="small" sx={{ color: "#4caf50" }}>
                <VisibilityIcon />
              </IconButton>
            </Link>

            {/* Mostrar opciones según rol */}
            {role === "admin" ? (
              // Admin solo puede eliminar tickets pendientes
              ticket.status === ETicketStatus.PENDING && (
                <IconButton
                  size="small"
                  onClick={() => handleDelete(ticket.id)}
                  sx={{ color: "#f44336" }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )
            ) : role === "client" && ticket.status === ETicketStatus.PENDING ? (
              <Link href={`${pathname}/${ticket.id}/editar`}>
                <IconButton size="small" sx={{ color: "#ff9800" }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Link>
            ) : (
              <></>
            )}
          </Box>
        ),
      },
    ];

    // Si es admin, añadir select para cambiar técnico
    if (role === "admin") {
      baseColumns[0] = {
        id: "technician",
        label: "Técnico",
        render: (ticket: TTicket) => (
          <Select
            value={ticket.assignedTechnician?.id ?? 0}
            onChange={(e) => handleTechnicianChange(ticket.id, Number(e.target.value))}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="" disabled>
              Seleccionar técnico
            </MenuItem>
            {technicians?.map((tech) => (
              <MenuItem key={tech.id} value={tech.id}>
                {tech.name}
              </MenuItem>
            ))}
          </Select>
        ),
      };
    }

    return baseColumns;
  };

  if (!technicians) return;
  return (
    <Box>
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
              // eslint-disable  @typescript-eslint/no-explicit-any
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
              // eslint-disable  @typescript-eslint/no-explicit-any
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
                {getColumns().map((column) => (
                  <TableCell key={column.id}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    {getColumns().map((column) => (
                      <TableCell key={`${ticket.id}-${column.id}`}>
                        {column.render(ticket)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={getColumns().length} align="center" sx={{ border: 0, py: 3 }}>
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
