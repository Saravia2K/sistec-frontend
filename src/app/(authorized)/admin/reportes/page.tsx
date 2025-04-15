"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "@/lib/consts";
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
} from "chart.js";

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

// Tipos para los datos estadísticos
type ComponentUsageData = {
  componentName: string;
  usageCount: number;
};

type PartUsageData = {
  partName: string;
  usageCount: number;
};

type ComponentCostData = {
  componentName: string;
  suppliers: {
    supplierName: string;
    unitPrice: number;
  }[];
};

export default function StatisticsPage() {
  const [topComponentsData, setTopComponentsData] = useState<
    ComponentUsageData[]
  >([]);
  const [topPartsData, setTopPartsData] = useState<PartUsageData[]>([]);
  const [componentCostsData, setComponentCostsData] = useState<
    ComponentCostData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState<string>("");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);

        // Obtener los 5 componentes más utilizados
        const topComponentsResponse = await axios.get(
          `${API_URL}/statistics/top-components`
        );
        setTopComponentsData(topComponentsResponse.data);

        // Obtener las piezas más usadas
        const topPartsResponse = await axios.get(
          `${API_URL}/statistics/top-parts`
        );
        setTopPartsData(topPartsResponse.data);

        // Obtener comparación de costos
        const componentCostsResponse = await axios.get(
          `${API_URL}/statistics/component-costs`
        );
        setComponentCostsData(componentCostsResponse.data);

        // Establecer el primer componente como seleccionado por defecto
        if (componentCostsResponse.data.length > 0) {
          setSelectedComponent(componentCostsResponse.data[0].componentName);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
        toast("Error al cargar las estadísticas", { type: "error" });

        // Datos de ejemplo en caso de error
        const mockTopComponents = [
          { componentName: "Procesador Intel i7", usageCount: 45 },
          { componentName: "Memoria RAM 16GB", usageCount: 38 },
          { componentName: "Disco SSD 1TB", usageCount: 32 },
          { componentName: "Tarjeta Gráfica NVIDIA", usageCount: 28 },
          { componentName: "Placa Base ASUS", usageCount: 25 },
        ];

        setTopComponentsData(mockTopComponents);

        setTopPartsData([
          { partName: "Ventilador CPU", usageCount: 62 },
          { partName: "Cable SATA", usageCount: 54 },
          { partName: "Pasta Térmica", usageCount: 47 },
          { partName: "Tornillos M3", usageCount: 40 },
          { partName: "Conectores USB", usageCount: 35 },
        ]);

        const mockComponentCosts = [
          {
            componentName: "Procesador Intel i7",
            suppliers: [
              { supplierName: "Electrónica Global", unitPrice: 299.99 },
              { supplierName: "Componentes Rápidos", unitPrice: 315.5 },
              { supplierName: "Suministros Tech", unitPrice: 289.95 },
            ],
          },
          {
            componentName: "Memoria RAM 16GB",
            suppliers: [
              { supplierName: "Electrónica Global", unitPrice: 89.99 },
              { supplierName: "Componentes Rápidos", unitPrice: 85.5 },
              { supplierName: "Suministros Tech", unitPrice: 92.95 },
            ],
          },
        ];

        setComponentCostsData(mockComponentCosts);

        // Establecer el primer componente como seleccionado por defecto
        if (mockComponentCosts.length > 0) {
          setSelectedComponent(mockComponentCosts[0].componentName);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Configuración para el gráfico de barras de componentes más utilizados
  const topComponentsChartData = {
    labels: topComponentsData.map((item) => item.componentName),
    datasets: [
      {
        label: "Número de usos",
        data: topComponentsData.map((item) => item.usageCount),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Configuración para el gráfico circular de piezas más usadas
  const topPartsChartData = {
    labels: topPartsData.map((item) => item.partName),
    datasets: [
      {
        label: "Número de usos",
        data: topPartsData.map((item) => item.usageCount),
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
  };

  // Preparar datos para la comparación de costos
  const prepareComponentCostData = () => {
    if (componentCostsData.length === 0) return null;

    // Buscar el componente seleccionado
    const componentData = componentCostsData.find(
      (comp) => comp.componentName === selectedComponent
    );

    if (!componentData) return null;

    return {
      labels: componentData.suppliers.map((supplier) => supplier.supplierName),
      datasets: [
        {
          label: `Precio de ${componentData.componentName} ($)`,
          data: componentData.suppliers.map((supplier) => supplier.unitPrice),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const componentCostChartData = prepareComponentCostData();

  // Opciones comunes para los gráficos
  const chartOptions = {
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

  const handleComponentChange = (event: SelectChangeEvent<string>) => {
    setSelectedComponent(event.target.value as string);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

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
              Top 5 Componentes Más Utilizados
            </Typography>
            <Box height="320px">
              <Bar
                data={topComponentsChartData}
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
                data={topPartsChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: "Distribución de uso de piezas",
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
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" color="primary" fontWeight="bold">
                Comparación de Costos por Proveedor
              </Typography>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="component-select-label">Componente</InputLabel>
                <Select
                  labelId="component-select-label"
                  id="component-select"
                  value={selectedComponent}
                  label="Componente"
                  onChange={(e) => handleComponentChange(e)}
                  size="small"
                >
                  {componentCostsData.map((component) => (
                    <MenuItem
                      key={component.componentName}
                      value={component.componentName}
                    >
                      {component.componentName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box height="350px">
              {componentCostChartData ? (
                <Bar
                  data={componentCostChartData}
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
                          callback: (value) => "$" + value,
                        },
                      },
                    },
                  }}
                />
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <Typography>
                    No hay datos disponibles para la comparación de costos
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
