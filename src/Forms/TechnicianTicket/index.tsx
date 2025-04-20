"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Grid,
  Paper,
  Table,
  Divider,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
  InputAdornment,
} from "@mui/material";
import { Add as AddIcon, Check as CheckIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "@/lib/axios";
import Button from "@/components/Buttton";
import Input from "@/components/Input";
import Select from "@/components/Select";
import useAvailableComponents from "@/hooks/useAvailableComponents";
import { toast } from "react-toastify";
import useAssignedTickets from "@/hooks/useAssignedTickets";
import updateTicket from "@/services/tickets/update";
import { ETicketStatus } from "@/lib/enums";
import { TComponentStock, TTicket } from "@/lib/types";

// Esquema Zod para componentes usados
const UsedComponentSchema = z.object({
  componentId: z.number().min(1, "ID de componente inválido"),
  componentStockId: z.number().min(1, "ID de stock inválido"),
  quantity: z.number().min(1, "La cantidad debe ser al menos 1"),
  unitPrice: z.number().min(0.01, "El precio debe ser mayor a 0"),
  name: z.string().min(1, "Nombre requerido"),
  supplierName: z.string().min(1, "Proveedor requerido"),
  local: z.boolean(),
});

// Esquema Zod principal
const RepairSchema = z.object({
  diagnosis: z.string().optional().nullable(),
  appliedSolution: z.string().optional().nullable(),
  estimatedCost: z
    .number({ message: "El valor debe ser numérico" })
    .min(0, "El costo no puede ser negativo"),
  usedComponents: z.array(UsedComponentSchema),
});

type RepairFormData = z.infer<typeof RepairSchema>;

interface TechnicianTicketProps {
  ticket: TTicket;
  watch?: boolean;
  onStateUpdate?: () => void;
}

export default function TechnicianTicket({
  ticket,
  watch = false,
  onStateUpdate,
}: TechnicianTicketProps) {
  const { id: ticketId } = useParams<{ id: string }>();
  const { components, reloadComponents } = useAvailableComponents();
  const [inUseComponents, setInUseComponents] = useState<TComponentStock[]>([]);
  const { refetchTickets } = useAssignedTickets(true);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState<TComponentStock | null>(null);
  const [selectedComponentQuantity, setSelectedComponentQuantity] = useState<number | string>(1);
  const [selectedComponentQuantityError, setSelectedComponentQuantityError] = useState("");
  const addComponentBtnRef = useRef<HTMLButtonElement | null>(null);

  const {
    control,
    handleSubmit,
    watch: formWatch,
    formState: { errors },
    reset,
  } = useForm<RepairFormData>({
    resolver: zodResolver(RepairSchema),
    defaultValues: {
      diagnosis: "",
      appliedSolution: "",
      estimatedCost: 0,
      usedComponents: [],
    },
  });

  const usedComponents = useFieldArray({
    control,
    name: "usedComponents",
  });
  const estimatedCost = formWatch("estimatedCost");

  //#region useEffects
  useEffect(() => {
    if (!components) return;
    setSelectedComponent(components[0]);
    setInUseComponents(components.filter((c) => c.inUse));
  }, [components]);

  useEffect(() => {
    const componentsTotal = usedComponents.fields.reduce(
      (sum, component) => sum + component.quantity * component.unitPrice,
      0
    );
    setTotalCost(componentsTotal + +estimatedCost);
  }, [usedComponents.fields, estimatedCost]);

  useEffect(() => {
    if (!ticket || !components) return;

    const { repair } = ticket;
    reset({
      appliedSolution: repair?.appliedSolution || "",
      diagnosis: repair?.diagnosis || "",
      estimatedCost: repair?.estimatedCost || 0,
      usedComponents:
        repair?.usedComponents?.map((uc) => {
          const componentStock = components.find((c) => uc.componentStock.id == c.id);

          return {
            componentId: componentStock?.component.id || 0,
            componentStockId: uc.componentStock.id,
            name: componentStock?.component.name || "",
            quantity: uc.quantity,
            supplierName: componentStock?.supplier.name || "",
            unitPrice: componentStock?.unitPrice || 0,
            local: false,
          };
        }) || [],
    });
  }, [ticket, components, reset, inUseComponents]);
  //#endregion

  //#region handlers
  const onSubmit = async (data: RepairFormData) => {
    try {
      if (watch) return; // No hacer nada en modo lectura

      const payload = {
        supportTicketId: +ticketId,
        diagnosis: data.diagnosis,
        appliedSolution: data.appliedSolution,
        estimatedCost,
        usedComponents: data.usedComponents.reduce((payload, component) => {
          const usedComponentIdx = payload.findIndex(
            (p) => p.componentStockId == component.componentStockId
          );
          if (usedComponentIdx >= 0) payload[usedComponentIdx].quantity += component.quantity;
          else {
            const { componentStockId, quantity } = component;
            payload.push({ componentStockId, quantity });
          }

          return payload;
        }, [] as Array<{ componentStockId: number; quantity: number }>),
      };

      const response = await axios.patch(`/repairs/${ticketId}`, payload);

      if (response.status >= 200 && response.status < 300) {
        toast.success("Reparación guardada exitosamente");
        refetchTickets();
        if (onStateUpdate) onStateUpdate();
        if (data.usedComponents) reloadComponents();
        return;
      }

      const errorData = response.data;
      toast.error(errorData.message || "Error al guardar la reparación");
    } catch (error: any) {
      const errorMessage = "Error al procesar la solicitud";
      toast.error(error.response?.data?.message || error.message || errorMessage);
      console.error("Error detallado:", error);
    }
  };

  const handleStartTicket = async (status: ETicketStatus) => {
    if (watch) return; // No hacer nada en modo lectura

    const started = await updateTicket({
      id: +ticketId,
      status,
    });

    if (started) {
      toast.success("Ticket actualizado correctamente");
      refetchTickets();
    } else {
      toast.error("Error al actualizar el ticket");
    }
  };
  //#endregion

  const getStock = () => {
    if (!selectedComponent) return 0;

    let stock = selectedComponent.stock;
    const usedComponentsList = usedComponents.fields;
    const selectedComponentInUsed = usedComponentsList.find(
      (uc) => uc.componentStockId == selectedComponent.id && uc.local
    );
    if (selectedComponentInUsed) stock -= selectedComponentInUsed.quantity;

    return stock;
  };

  if (!ticket || !components) return null;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Detalle de Reparación
        </Typography>
        {!watch && (
          <>
            {ticket.status == ETicketStatus.PENDING ? (
              <Box>
                <Button
                  color="green"
                  onClick={() => handleStartTicket(ETicketStatus.IN_PROGRESS)}
                  disabled={watch}
                >
                  Comenzar Ticket
                </Button>
                <Button
                  color="blue"
                  onClick={() => handleStartTicket(ETicketStatus.CANCELED)}
                  disabled={watch}
                >
                  Cancelar Ticket
                </Button>
              </Box>
            ) : (
              ticket.status == ETicketStatus.IN_PROGRESS && (
                <Button
                  color="green"
                  onClick={() => handleStartTicket(ETicketStatus.COMPLETED)}
                  disabled={watch}
                >
                  Terminar Ticket
                </Button>
              )
            )}
          </>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Información del Ticket #{ticket.id}
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Tipo de Dispositivo
                  </Typography>
                  <Typography variant="body1">{ticket.deviceType.name}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Marca
                  </Typography>
                  <Typography variant="body1">{ticket.brand}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Modelo
                  </Typography>
                  <Typography variant="body1">{ticket.model}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Número de Serie
                  </Typography>
                  <Typography variant="body1">{ticket.serialNumber}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Descripción del Problema
                  </Typography>
                  <Typography variant="body1">{ticket.problemDescription}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Formulario de Reparación
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Diagnóstico
                  </Typography>
                  <Controller
                    name="diagnosis"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        error={!!errors.diagnosis}
                        helperText={errors.diagnosis?.message}
                        placeholder="Ingrese el diagnóstico detallado del problema"
                        disabled={watch}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Solución aplicada
                  </Typography>
                  <Controller
                    name="appliedSolution"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        error={!!errors.appliedSolution}
                        helperText={errors.appliedSolution?.message}
                        placeholder="Describa la solución aplicada (opcional)"
                        disabled={watch}
                      />
                    )}
                  />
                </Grid>

                {!watch && (
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
                        value={selectedComponent?.id ?? ""}
                        onChange={(e) =>
                          setSelectedComponent(
                            components.find((c) => c.id == +e.target.value) || components[0]
                          )
                        }
                        disabled={watch}
                      >
                        {inUseComponents.map((c) => (
                          <MenuItem key={c.id} value={c.id}>
                            {c.component.name} - {c.supplier.name} - ${c.unitPrice}
                          </MenuItem>
                        ))}
                      </Select>
                      <Input
                        label="Cantidad"
                        value={selectedComponentQuantity}
                        type="text"
                        placeholder="75"
                        error={!!selectedComponentQuantityError}
                        helperText={selectedComponentQuantityError || `Stock actual: ${getStock()}`}
                        onKeyDown={(e) => {
                          if (e.key == "Enter") {
                            addComponentBtnRef.current?.click();
                            e.stopPropagation();
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          setSelectedComponentQuantityError("");
                          const value = e.target.value;
                          const isNumeric = /^[0-9]*$/.test(value);
                          if (!isNumeric && value != "") return;

                          const numericValue = Number(value);
                          setSelectedComponentQuantity(numericValue || "");
                          const stock = getStock();
                          if (numericValue > stock)
                            setSelectedComponentQuantityError(
                              `No hay stock suficiente para ese valor. Stock actual: ${stock}`
                            );
                        }}
                        sx={{ width: { xs: "100%", sm: "25%" } }}
                        disabled={watch}
                      />
                      <Button
                        color="green"
                        icon
                        ref={addComponentBtnRef}
                        onClick={() => {
                          if (
                            watch || // Si está en modo lectura
                            !selectedComponent || // Si no hay componente seleccionado
                            !!selectedComponentQuantityError // Si hay error en la cantidad seleccionada
                          )
                            return;

                          if (selectedComponentQuantity == "") {
                            setSelectedComponentQuantityError("Ingrese una cantidad correcta");
                            return;
                          }

                          const existingIndex = usedComponents.fields.findIndex(
                            (uc) => uc.componentId === selectedComponent.component.id && uc.local
                          );

                          let quantity = 0;
                          if (existingIndex >= 0) {
                            quantity =
                              usedComponents.fields[existingIndex].quantity +
                              +selectedComponentQuantity;
                            usedComponents.update(existingIndex, {
                              ...usedComponents.fields[existingIndex],
                              quantity,
                            });
                          } else {
                            quantity = +selectedComponentQuantity;
                            usedComponents.append({
                              componentId: selectedComponent.component.id,
                              componentStockId: selectedComponent.id,
                              name: selectedComponent.component.name,
                              supplierName: selectedComponent.supplier.name,
                              unitPrice: selectedComponent.unitPrice,
                              quantity,
                              local: true,
                            });
                          }

                          const currentStock = getStock() - quantity;

                          setSelectedComponent(components[0]);
                          setSelectedComponentQuantity(currentStock >= 1 ? 1 : 0);
                        }}
                        disabled={watch || !selectedComponent}
                      >
                        <AddIcon />
                      </Button>
                    </Box>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Piezas utilizadas
                  </Typography>
                  {usedComponents.fields.length > 0 ? (
                    <>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Componente</TableCell>
                              <TableCell align="right">Precio unitario</TableCell>
                              <TableCell align="right">Cantidad</TableCell>
                              <TableCell align="right">Subtotal</TableCell>
                              {!watch && <TableCell align="right">Acciones</TableCell>}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {usedComponents.fields.map((c, i) => (
                              <TableRow key={c.id}>
                                <TableCell>
                                  {c.name} - {c.supplierName}
                                </TableCell>
                                <TableCell align="right">${c.unitPrice}</TableCell>
                                <TableCell align="right">{c.quantity}</TableCell>
                                <TableCell align="right">
                                  ${(c.unitPrice * c.quantity).toFixed(2)}
                                </TableCell>
                                {!watch && c.local && (
                                  <TableCell align="right">
                                    <IconButton
                                      size="small"
                                      onClick={() => usedComponents.remove(i)}
                                      sx={{ color: "#f44336" }}
                                      disabled={watch}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </TableCell>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      {errors.usedComponents && (
                        <Typography color="error" variant="body2" mt={1}>
                          {errors.usedComponents.message}
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                      No se han agregado componentes
                    </Typography>
                  )}
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Costo de la reparación
                  </Typography>
                  <Controller
                    name="estimatedCost"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        fullWidth
                        type="text"
                        error={!!errors.estimatedCost}
                        helperText={errors.estimatedCost?.message}
                        placeholder="0.00"
                        slotProps={{
                          input: {
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          },
                        }}
                        disabled={watch}
                      />
                    )}
                  />
                </Grid>

                {!watch && ticket.status == ETicketStatus.IN_PROGRESS && (
                  <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", alignItems: "flex-end" }}>
                    <Button color="green" buttonType="submit" disabled={watch}>
                      <CheckIcon sx={{ mr: 1 }} />
                      Guardar Reparación
                    </Button>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ mt: 2, textAlign: "right" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Costo Total: ${+totalCost.toFixed(2)}
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
