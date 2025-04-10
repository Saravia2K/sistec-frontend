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
  Stack,
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
const requestsData = [
  {
    id: 1,
    type: "laptop",
    date: "29 / 03 / 2025",
    agent: "luis",
    status: "En progreso",
  },
  {
    id: 2,
    type: "batería",
    date: "29 / 03 / 2025",
    agent: "jaime",
    status: "En progreso",
  },
  {
    id: 3,
    type: "procesador",
    date: "29 / 03 / 2025",
    agent: "tulio",
    status: "En progreso",
  },
];

export default function ClientePage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Bienvenido Soporte
      </Typography>

      <Grid container spacing={3}>
        <Grid
          component={Paper}
          size={{ xs: 12, md: 4 }}
          p={7}
          borderRadius={2}
          display="flex"
          alignItems="center"
        >
          <Box
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h6"
                color={COLORS.GREEN}
                fontWeight="bold"
                mb={1}
              >
                Hola, Cliente
              </Typography>
              <Typography variant="body2">
                Echa un vistazo a tus solicitudes
              </Typography>
            </Box>
            <Button color="green" icon type="outlined">
              <ArrowForwardIcon
                fontSize="small"
                style={{ color: COLORS.GREEN }}
              />
            </Button>
          </Box>
        </Grid>

        {/* Estado de Solicitudes */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              color={COLORS.GREEN}
              fontWeight="bold"
              mb={3}
            >
              Estado de solicitudes asignadas
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

        {/* Tabla de solicitudes */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre Cliente</TableCell>
                    <TableCell>Fecha Creación</TableCell>
                    <TableCell>Estado Actual</TableCell>
                    <TableCell>Prioridad</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requestsData.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell>{request.agent}</TableCell>
                      <TableCell>{request.status}</TableCell>
                      <TableCell>
                        <Button color="blue" icon>
                          <ArrowForwardIcon fontSize="small" />
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
