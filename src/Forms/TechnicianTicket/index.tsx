"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Add as AddIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Button from "@/components/Buttton";
import Input from "@/components/Input";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TRepair, TUsedComponents } from "@/lib/types";
import Select from "@/components/Select";

// Datos de ejemplo del ticket
const ticketData = {
  id: 1,
  deviceType: "Laptop",
  brand: "HP",
  model: "Pavilion 15",
  serialNumber: "HP78945612",
  problemDescription:
    "El equipo no enciende correctamente. Se queda en la pantalla de inicio y luego se apaga. Ya se intentó reiniciar varias veces sin éxito.",
};

// Tipo para el formulario de reparación
type RepairFormData = Pick<
  TRepair,
  "diagnosis" | "appliedSolution" | "startDate" | "endDate" | "estimatedCost"
> & { usedComponents: { componentStockId: number; quantity: number }[] };

export default function TechnicianTicket() {
  const [totalCost, setTotalCost] = useState(0);
  const [selectedComponentId, setSelectedComponentId] = useState(1);
  const [selectedComponentQuantity, setSelectedComponentQuantity] = useState(1);

  const { control, handleSubmit, setValue, watch } = useForm<RepairFormData>({
    defaultValues: {
      diagnosis: "",
      startDate: new Date(),
      appliedSolution: "",
      estimatedCost: 0,
      usedComponents: [],
    },
  });
  const usedComponents = useFieldArray({
    control,
    name: "usedComponents",
  });

  // Observando valores del formulario
  const estimatedCost = watch("estimatedCost");

  // useEffect para calcular el total
  useEffect(() => {}, []);

  // Actualizar el costo total cuando cambian los componentes o el costo estimado

  // Datos de ejemplo para la búsqueda de componentes
  const availableComponents = [
    { id: 1, name: "Procesador Intel i5 10400f", price: 150 },
    { id: 2, name: "Memoria RAM DDR4 8GB", price: 45 },
    { id: 3, name: "Disco SSD 500GB", price: 70 },
    { id: 4, name: "Tarjeta gráfica NVIDIA GTX 1650", price: 200 },
    { id: 5, name: "Fuente de poder 650W", price: 60 },
    { id: 6, name: "Placa madre ASUS H510", price: 120 },
  ];

  // Función para enviar el formulario
  const onSubmit = (data: RepairFormData) => {
    const repairData = {
      ...data,
      usedComponents,
      totalCost,
    };
    console.log("Datos de reparación:", repairData);
    // Aquí iría la lógica para guardar en la base de datos
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Detalle de Reparación
      </Typography>

      <Grid container spacing={3}>
        {/* Sección de información del ticket */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Información del Ticket #{ticketData.id}
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Tipo de Dispositivo
                  </Typography>
                  <Typography variant="body1">
                    {ticketData.deviceType}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Marca
                  </Typography>
                  <Typography variant="body1">{ticketData.brand}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Modelo
                  </Typography>
                  <Typography variant="body1">{ticketData.model}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Número de Serie
                  </Typography>
                  <Typography variant="body1">
                    {ticketData.serialNumber}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Descripción del Problema
                  </Typography>
                  <Typography variant="body1">
                    {ticketData.problemDescription}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Formulario de reparación */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Formulario de Reparación
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                {/* Diagnóstico */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Diagnóstico
                  </Typography>
                  <Controller
                    name="diagnosis"
                    control={control}
                    rules={{ required: "Este campo es obligatorio" }}
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        placeholder="Ingrese el diagnóstico detallado del problema"
                      />
                    )}
                  />
                </Grid>

                {/* Solución aplicada */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Solución aplicada
                  </Typography>
                  <Controller
                    name="appliedSolution"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        placeholder="Describa la solución aplicada (opcional)"
                      />
                    )}
                  />
                </Grid>

                {/* Buscar componentes */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Componentes disponibles
                  </Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    flexDirection={{ xs: "column", sm: "row" }}
                    gap={4}
                  >
                    <Select
                      fullWidth
                      value={selectedComponentId}
                      onChange={(e) =>
                        setSelectedComponentId(e.target.value as any)
                      }
                    >
                      {availableComponents.map((c, i) => (
                        <MenuItem key={c.id} value={c.id} selected={i == 0}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <Input
                      label="Cantidad"
                      value={selectedComponentQuantity}
                      type="number"
                      onChange={(e) =>
                        setSelectedComponentQuantity(+e.target.value as any)
                      }
                      slotProps={{
                        htmlInput: { min: 1, max: 10 },
                      }}
                      sx={{ width: { xs: "100%", sm: "25%" } }}
                    />
                    <Button
                      color="green"
                      icon
                      onClick={() => {
                        const usedComponentsFields = usedComponents.fields;
                        const componentInListIndex =
                          usedComponentsFields.findIndex(
                            (uc) => uc.componentStockId == selectedComponentId
                          );
                        const componentInList =
                          usedComponentsFields[componentInListIndex];
                        if (componentInListIndex >= 0) {
                          usedComponents.update(componentInListIndex, {
                            componentStockId: selectedComponentId,
                            quantity:
                              componentInList.quantity +
                              selectedComponentQuantity,
                          });
                        } else {
                          usedComponents.append({
                            componentStockId: selectedComponentId,
                            quantity: selectedComponentQuantity,
                          });
                        }
                      }}
                    >
                      <AddIcon />
                    </Button>
                  </Box>
                </Grid>

                {/* Piezas utilizadas */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Piezas utilizadas
                  </Typography>
                  {usedComponents.fields.length > 0 ? (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Componente</TableCell>
                            <TableCell align="right">Precio unitario</TableCell>
                            <TableCell align="right">Cantidad</TableCell>
                            <TableCell align="right">Fecha</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {usedComponents.fields.map((component, i) => (
                            <TableRow key={component.id}>
                              <TableCell>Test</TableCell>
                              <TableCell align="right">$10</TableCell>
                              <TableCell align="right">
                                {component.quantity}
                              </TableCell>
                              <TableCell align="right">
                                {format(new Date(), "dd/MM/yyyy HH:mm")}
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  size="small"
                                  onClick={() => usedComponents.remove(i)}
                                  sx={{ color: "#f44336" }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: "italic" }}
                    >
                      No se han agregado componentes
                    </Typography>
                  )}
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {/* Fecha y costo */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Fecha de inicio
                  </Typography>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={es}
                  >
                    <Controller
                      name="startDate"
                      control={control}
                      rules={{ required: "Este campo es obligatorio" }}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          slots={{
                            textField: Input,
                          }}
                          slotProps={{
                            textField: { fullWidth: true },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Costo de la reparación
                  </Typography>
                  <Controller
                    name="estimatedCost"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        fullWidth
                        type="number"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        placeholder="0.00"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          },
                        }}
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number.parseFloat(e.target.value)
                            : null;
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid
                  size={{ xs: 12, md: 4 }}
                  sx={{ display: "flex", alignItems: "flex-end" }}
                >
                  <Button
                    color="green"
                    buttonType="submit"
                    // fullWidth
                    // sx={{ height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <CheckIcon sx={{ mr: 1 }} />
                    Guardar Reparación
                  </Button>
                </Grid>

                {/* Total */}
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ mt: 2, textAlign: "right" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Costo Total: ${totalCost.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
