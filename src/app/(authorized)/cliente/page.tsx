"use client";

import { useRouter } from "nextjs-toploader/app";
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
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  List as ListIcon,
  Settings as SettingsIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import StatCard from "@/components/StatCard";
import Button from "@/components/Buttton";
import { COLORS } from "@/lib/consts";
import useClientDashboard from "@/hooks/useClientDashboard";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ClientePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { dashboardData, isLoading, error } = useClientDashboard();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd / MM / yyyy", { locale: es });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error al cargar los datos del dashboard: {(error as Error).message}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Bienvenido {user?.name}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" color={COLORS.GREEN} fontWeight="bold" mb={1}>
                    Hola, {user?.name.split(" ")[0]}
                  </Typography>
                  <Typography variant="body2">Echa un vistazo a tus solicitudes</Typography>
                </Box>
                <Button color="green" icon type="outlined">
                  <ArrowForwardIcon fontSize="small" style={{ color: COLORS.GREEN }} />
                </Button>
              </Box>
            </Paper>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" color={COLORS.GREEN} fontWeight="bold" mb={1}>
                    Crea una solicitud
                  </Typography>
                  <Typography variant="body2">¿Tienes algún problema?</Typography>
                  <Typography variant="body2">Te ayudaremos a resolverlo.</Typography>
                </Box>
                <Button color="green" icon onClick={() => router.push("/cliente/nueva-solicitud")}>
                  <AddIcon />
                </Button>
              </Box>
            </Paper>
          </Stack>
        </Grid>

        {/* Estado de Solicitudes */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" color={COLORS.GREEN} fontWeight="bold" mb={3}>
              Estado de Solicitudes
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <StatCard
                  icon={<ListIcon />}
                  count={dashboardData?.totalTickets || 0}
                  label="Total"
                  color="#1a237e"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <StatCard
                  icon={<AccessTimeIcon />}
                  count={dashboardData?.byStatus.pending || 0}
                  label="Pendientes"
                  color="#1a237e"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <StatCard
                  icon={<SettingsIcon />}
                  count={dashboardData?.byStatus.inProgress || 0}
                  label="En Proceso"
                  color="#1a237e"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <StatCard
                  icon={<CheckCircleIcon />}
                  count={dashboardData?.byStatus.completed || 0}
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
                    <TableCell>ID solicitud</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Técnico</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData?.recentRequests?.length ? (
                    dashboardData.recentRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>{request.deviceType.name}</TableCell>
                        <TableCell>{formatDate(request.requestDate)}</TableCell>
                        <TableCell>
                          {request.assignedTechnician?.user.name || "Sin asignar"}
                        </TableCell>
                        <TableCell>
                          {request.status === "pending" && "Pendiente"}
                          {request.status === "inProgress" && "En progreso"}
                          {request.status === "completed" && "Completado"}
                        </TableCell>
                        <TableCell>
                          <Button
                            color="green"
                            icon
                            type="outlined"
                            onClick={() => router.push(`/cliente/tickets/${request.id}`)}
                          >
                            <ArrowForwardIcon fontSize="small" style={{ color: COLORS.GREEN }} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No hay solicitudes recientes
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
