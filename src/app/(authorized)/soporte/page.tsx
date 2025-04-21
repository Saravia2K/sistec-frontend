"use client";

import {
  Box,
  Grid,
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from "@mui/material";
import {
  List as ListIcon,
  Settings as SettingsIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import StatCard from "@/components/StatCard";
import Button from "@/components/Buttton";
import { COLORS } from "@/lib/consts";
import useTechnicianDashboard from "@/hooks/useTechnicianDashboard";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "nextjs-toploader/app";

export default function SoportePage() {
  const { dashboardData, isLoading, isError } = useTechnicianDashboard();
  const router = useRouter();

  if (isLoading) return <div>Cargando dashboard...</div>;
  if (isError) return <div>Error al cargar los datos del dashboard</div>;

  // Extraer datos del dashboard
  const {
    totalTickets = 0,
    byStatus = { pending: 0, inProgress: 0, completed: 0 },
    recentAssignedTickets = [],
  } = dashboardData || {};

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Bienvenido Soporte
      </Typography>

      <Grid container spacing={3}>
        {/* Tarjeta de bienvenida */}
        <Grid
          component={Paper}
          size={{ xs: 12, md: 4 }}
          p={7}
          borderRadius={2}
          display="flex"
          alignItems="center"
        >
          <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" color={COLORS.GREEN} fontWeight="bold" mb={1}>
                Hola, Técnico
              </Typography>
              <Typography variant="body2">Tienes {totalTickets} solicitudes asignadas</Typography>
            </Box>
            <Button color="green" icon type="outlined">
              <ArrowForwardIcon fontSize="small" style={{ color: COLORS.GREEN }} />
            </Button>
          </Box>
        </Grid>

        {/* Estado de Solicitudes */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" color={COLORS.GREEN} fontWeight="bold" mb={3}>
              Estado de solicitudes asignadas
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <StatCard icon={<ListIcon />} count={totalTickets} label="Total" color="#1a237e" />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <StatCard
                  icon={<AccessTimeIcon />}
                  count={byStatus.pending}
                  label="Pendientes"
                  color="#1a237e"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <StatCard
                  icon={<SettingsIcon />}
                  count={byStatus.inProgress}
                  label="En Proceso"
                  color="#1a237e"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <StatCard
                  icon={<CheckCircleIcon />}
                  count={byStatus.completed}
                  label="Finalizados"
                  color="#1a237e"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Tabla de solicitudes */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Prioridad</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentAssignedTickets.length > 0 ? (
                    recentAssignedTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>{ticket.id}</TableCell>
                        <TableCell>{ticket.customerName}</TableCell>
                        <TableCell>
                          {format(new Date(ticket.requestDate), "dd/MM/yyyy", {
                            locale: es,
                          })}
                        </TableCell>
                        <TableCell>
                          {ticket.status === "completed"
                            ? "Completado"
                            : ticket.status === "inProgress"
                            ? "En Proceso"
                            : "Pendiente"}
                        </TableCell>
                        <TableCell>
                          {ticket.priority === "high" ? (
                            <Box display="flex" alignItems="center">
                              <WarningIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                              <span>Alta</span>
                            </Box>
                          ) : ticket.priority === "medium" ? (
                            "Media"
                          ) : (
                            "Baja"
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            color="blue"
                            icon
                            onClick={() => router.push(`/soporte/tickets/${ticket.id}`)}
                          >
                            <ArrowForwardIcon fontSize="small" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No hay solicitudes asignadas recientemente
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
