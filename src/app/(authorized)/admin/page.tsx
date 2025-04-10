"use client";

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
} from "@mui/icons-material";
import StatCard from "@/components/StatCard";
import Button from "@/components/Buttton";
import { COLORS } from "@/lib/consts";

// Datos de ejemplo
const lowStockItems = [
  { id: 1, name: "Procesador", stock: 2 },
  { id: 2, name: "Disco Duro", stock: 1 },
];

const urgentRequests = [
  { id: 1, date: "29/03/2025", priority: "Urgente" },
  { id: 2, date: "29/03/2025", priority: "Urgente" },
];

export default function AdminPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Bienvenido Administrador
      </Typography>

      <Grid container spacing={3}>
        {/* Estado de Solicitudes */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              color={COLORS.GREEN}
              fontWeight="bold"
              mb={3}
            >
              Estado de Solicitudes
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <StatCard
                  icon={<ListIcon />}
                  count={10}
                  label="Total"
                  color="#1a237e"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <StatCard
                  icon={<AccessTimeIcon />}
                  count={5}
                  label="Pendientes"
                  color="#1a237e"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <StatCard
                  icon={<SettingsIcon />}
                  count={3}
                  label="En Proceso"
                  color="#1a237e"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <StatCard
                  icon={<CheckCircleIcon />}
                  count={2}
                  label="Finalizados"
                  color="#1a237e"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Piezas con stock bajo */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h6" color={COLORS.GREEN} fontWeight="bold">
                Piezas con stock bajo
              </Typography>
              <Button color="blue" icon type="table">
                <AddIcon />
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre Pieza</TableCell>
                    <TableCell align="right">Existencias</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStockItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">{item.stock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Fallas más comunes */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Typography
              variant="h6"
              color={COLORS.GREEN}
              fontWeight="bold"
              mb={3}
            >
              Fallas mas comunes
            </Typography>
          </Paper>
        </Grid>

        {/* Tiempo promedio de reparación */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
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
                2
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                Días
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Solicitudes urgentes */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Typography
              variant="h6"
              color={COLORS.GREEN}
              fontWeight="bold"
              mb={3}
            >
              Solicitudes urgentes
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Prioridad</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {urgentRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell>{request.priority}</TableCell>
                      <TableCell>
                        <Button color="blue" icon type="outlined">
                          <ArrowForwardIcon style={{ color: COLORS.BLUE }} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
