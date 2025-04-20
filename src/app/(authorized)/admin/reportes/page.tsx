"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  ChartOptions,
} from "chart.js";
import useMostUsedComponents from "@/hooks/useMostUsedComponents";
import useComponents from "@/hooks/useComponents";
import useComponentStock from "@/hooks/useComponentStocks";

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Opciones comunes para los gráficos
const chartOptions: ChartOptions<any> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      font: {
        size: 16,
      },
    },
  },
};

export default function StatisticsPage() {
  const [selectedComponentId, setSelectedComponentId] = useState(0);
  const { components: MUC } = useMostUsedComponents();
  const { components } = useComponents();
  const { component, reloadComponent } = useComponentStock(selectedComponentId);

  useEffect(() => {
    if (!components || components.length == 0) return;

    setSelectedComponentId(components[0].id);
  }, [components]);

  useEffect(() => {
    if (!selectedComponentId) return;

    reloadComponent();
  }, [selectedComponentId, reloadComponent]);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Estadísticas
      </Typography>

      <Grid container spacing={3}>
        {/* Componentes más utilizados */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 2, height: 400 }}>
            <Typography variant="h6" color="primary" fontWeight="bold" mb={2}>
              Top {MUC.length} componentes más utilizados
            </Typography>
            <Box height="320px">
              <Bar
                data={{
                  labels: MUC.map((item) => item.component_name),
                  datasets: [
                    {
                      label: "Número de usos",
                      data: MUC.map((item) => item.times_used),
                      backgroundColor: "rgba(54, 162, 235, 0.6)",
                      borderColor: "rgba(54, 162, 235, 1)",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: "Número de usos por componente",
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Piezas más usadas */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 2, height: 400 }}>
            <Typography variant="h6" color="primary" fontWeight="bold" mb={2}>
              Piezas Más Usadas
            </Typography>
            <Box height="320px" display="flex" justifyContent="center">
              <Pie
                data={{
                  labels: MUC.map((item) => item.component_name),
                  datasets: [
                    {
                      label: "Número de usos",
                      data: MUC.map((item) => item.total_units_used),
                      backgroundColor: [
                        "rgba(255, 99, 132, 0.6)",
                        "rgba(54, 162, 235, 0.6)",
                        "rgba(255, 206, 86, 0.6)",
                        "rgba(75, 192, 192, 0.6)",
                        "rgba(153, 102, 255, 0.6)",
                      ],
                      borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: "Total de piezas usadas",
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Comparación de costos */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 2, height: 450 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                Comparación de Costos por Proveedor
              </Typography>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="component-select-label">Componente</InputLabel>
                <Select
                  labelId="component-select-label"
                  id="component-select"
                  value={selectedComponentId || ""}
                  label="Componente"
                  onChange={(e) => setSelectedComponentId(+e.target.value)}
                  size="small"
                >
                  {components.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box height="350px">
              {component != null && components.length > 0 ? (
                <Bar
                  data={{
                    labels: component.stocks.map((s) => s.supplier.name),
                    datasets: [
                      {
                        label: `Precio de ${component.name} ($)`,
                        data: component.stocks.map((supplier) => supplier.unitPrice),
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: "Precio unitario por proveedor",
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => `$${value}`,
                        },
                      },
                    },
                  }}
                />
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography>No hay datos disponibles para la comparación de costos</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
