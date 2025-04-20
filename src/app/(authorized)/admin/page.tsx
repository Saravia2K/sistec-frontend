"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableRow,
  useTheme,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  useMediaQuery,
  TableContainer,
} from "@mui/material";
import {
  Add as AddIcon,
  List as ListIcon,
  Settings as SettingsIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import StatCard from "@/components/StatCard";
import Button from "@/components/Buttton";
import useAdminDashboard from "@/hooks/useAdminDashboard";
import { COLORS } from "@/lib/consts";

export default function AdminPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { dashboardData, isLoading } = useAdminDashboard();
  const router = useRouter();

  if (isLoading) return <div>Cargando dashboard...</div>;

  // Extraer datos del dashboard
  const {
    totalTickets = 0,
    byStatus = { pending: 0, inProgress: 0, completed: 0 },
    lowStockComponents = [],
    commonFailures = {},
    avgRepairTimes = {},
    highPriorityTickets = [],
  } = dashboardData || {};

  // Convertir commonFailures a array ordenado
  const sortedCommonFailures = Object.entries(commonFailures)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Mostrar solo las 5 principales

  // Calcular tiempo promedio de reparación
  const avgRepairTime =
    Object.entries(avgRepairTimes).reduce((acc, [days, count]) => {
      const daysNum = parseInt(days.split(" ")[0]);
      return acc + daysNum * count;
    }, 0) / Object.values(avgRepairTimes).reduce((acc, count) => acc + count, 1);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Bienvenido Administrador
      </Typography>

      <Grid container spacing={3}>
        {/* Estado de Solicitudes */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" color={COLORS.GREEN} fontWeight="bold" mb={3}>
              Estado de Solicitudes
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

        {/* Piezas con stock bajo */}
        <Grid component={Paper} size={{ xs: 12, md: 6 }} p={3} borderRadius={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" color={COLORS.GREEN} fontWeight="bold">
              Piezas con stock bajo
            </Typography>
            <Button color="blue" icon type="table" onClick={() => router.push("/admin/inventario")}>
              <AddIcon />
            </Button>
          </Box>

          <TableContainer sx={{ maxHeight: { xs: 400, md: 200 } }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Proveedor</TableCell>
                  <TableCell>Precio unitario</TableCell>
                  <TableCell align="right">Stock Actual</TableCell>
                  <TableCell align="right">Mínimo Requerido</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lowStockComponents.length > 0 ? (
                  lowStockComponents.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.component}</TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>${item.unitPrice}</TableCell>
                      <TableCell align="right">{item.stock}</TableCell>
                      <TableCell align="right">{item.minimumStock}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No hay componentes con stock bajo
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Fallas más comunes */}
        <Grid
          component={Paper}
          size={{ xs: 12, sm: 6, md: 4 }}
          sx={{ p: 3, borderRadius: 2, height: "100%" }}
        >
          <Typography variant="h6" color={COLORS.GREEN} fontWeight="bold" mb={3}>
            Fallas más comunes
          </Typography>

          {sortedCommonFailures.length > 0 ? (
            <Box component="ul" sx={{ pl: 2 }}>
              {sortedCommonFailures.map(([failure, count]) => (
                <Box
                  component="li"
                  key={failure}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>{failure}</Typography>
                  <Typography fontWeight="bold">{count}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography>No hay datos de fallas registradas</Typography>
          )}
        </Grid>

        {/* Tiempo promedio de reparación */}
        <Grid
          component={Paper}
          size={{ xs: 12, sm: 6, md: 4 }}
          sx={{
            p: 3,
            borderRadius: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" color={COLORS.GREEN} fontWeight="bold">
            Tiempo promedio de reparación
          </Typography>
          <Box textAlign="center" py={isMobile ? 2 : 4}>
            <Typography variant="h1" fontWeight="bold">
              {Math.round(avgRepairTime * 10) / 10}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              Días
            </Typography>
          </Box>
        </Grid>

        {/* Solicitudes urgentes */}
        <Grid
          component={Paper}
          size={{ xs: 12, md: 4 }}
          sx={{ p: 3, borderRadius: 2, height: "100%" }}
        >
          <Typography variant="h6" color={COLORS.GREEN} fontWeight="bold" mb={3}>
            Solicitudes urgentes
          </Typography>
          <TableContainer sx={{ maxHeight: 225 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Prioridad</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {highPriorityTickets.length > 0 ? (
                  highPriorityTickets.slice(0, 5).map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.id}</TableCell>
                      <TableCell>
                        {format(new Date(ticket.requestDate), "dd/MM/yyyy", {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <WarningIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                          <span>Alta</span>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button
                          color="blue"
                          icon
                          type="outlined"
                          onClick={() => router.push(`/admin/solicitudes/${ticket.id}`)}
                        >
                          <ArrowForwardIcon style={{ color: COLORS.BLUE }} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No hay solicitudes urgentes
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
