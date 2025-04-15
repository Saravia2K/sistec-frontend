"use client";

import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  Table,
  Tooltip,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  type SelectChangeEvent,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import Button from "@/components/Buttton";
import Modal from "@/components/Modal";
import { useForm, Controller } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Swal from "sweetalert2";
import { EPurchaseStatus } from "@/lib/enums";
import { TPurchase, TResponseError } from "@/lib/types";
import { formatDate, formatPrice, truncateText } from "@/lib/helpers";
import Select from "@/components/Select";
import Input from "@/components/Input";
import useSuppliers from "@/hooks/useSuppliers";
import { API_URL } from "@/lib/consts";
import usePurchases, { TPurchaseResponseItem } from "@/hooks/usePurchases";
import useComponents from "@/hooks/useComponents";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Mapeo de estados a texto en español
const statusLabels = {
  [EPurchaseStatus.PENDING]: "Pendiente",
  [EPurchaseStatus.COMPLETED]: "Completado",
  [EPurchaseStatus.CANCELED]: "Cancelado",
  [EPurchaseStatus.RETURNED]: "Devuelto",
};

// Tipo para el formulario basado en el modelo de Prisma
type PurchaseFormData = {
  supplierId: number;
  componentId: number;
  quantity: number;
  unitPrice: number;
  details: string;
  status: EPurchaseStatus;
  purchaseDate: Date;
};

export default function InventarioPage() {
  const { suppliers } = useSuppliers();
  const { purchases, reloadPurchases } = usePurchases();
  const { components } = useComponents();
  const [openForm, setOpenForm] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    resolver: yupResolver(purchaseSchema),
    defaultValues: {
      supplierId: 0,
      componentId: 0,
      quantity: 1,
      unitPrice: 0,
      details: "",
      status: EPurchaseStatus.PENDING,
      purchaseDate: new Date(),
    },
  });

  const handleOpenForm = () => {
    reset({
      supplierId: 0,
      componentId: 0,
      quantity: 1,
      unitPrice: 0,
      details: "",
      status: EPurchaseStatus.PENDING,
      purchaseDate: new Date(), // Fecha actual por defecto
    });
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const onSubmit = async (data: PurchaseFormData) => {
    try {
      // Convertir los campos numéricos de string a number
      const payload = {
        ...data,
        quantity: Number(data.quantity),
        unitPrice: Number(data.unitPrice),
      };

      const response = await axios.post(`${API_URL}/purchases`, payload);

      if (response.status >= 400) {
        const { message } = response.data as TResponseError;
        toast.error(message.join(", "));
        return;
      }

      toast.success(`Compra creada correctamente`);

      handleCloseForm();
      reloadPurchases();
    } catch (error) {
      console.log(error);
      toast.error("Error al procesar la compra");
    }
  };

  const handleConfirmDelete = (purchase: TPurchase) => {
    const supplierName = suppliers?.find(
      (s) => s.id === purchase.supplier.id
    )?.name;
    const componentName = components?.find(
      (c) => c.id === purchase.component.id
    )?.name;

    Swal.fire({
      title: "¿Está seguro?",
      html: `¿Desea eliminar la compra de <strong>${componentName}</strong> a <strong>${supplierName}</strong>?<br>Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1976D2",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/purchases/${purchase.id}`);

          Swal.fire({
            title: "Eliminada",
            text: "La compra ha sido eliminada correctamente.",
            icon: "success",
            confirmButtonColor: "#1976D2",
          });

          reloadPurchases();
        } catch (error) {
          toast.error("Error al eliminar la compra");
          console.log(error);
        }
      }
    });
  };

  const handleStatusChange = async (
    event: SelectChangeEvent<string>,
    purchaseId: number
  ) => {
    const newStatus = event.target.value as EPurchaseStatus;

    try {
      await axios.patch(`${API_URL}/purchases/${purchaseId}/status`, {
        status: newStatus,
      });

      toast.success("Estado actualizado correctamente");
      reloadPurchases();
    } catch (error) {
      toast.error("Error al actualizar el estado");
      console.log(error);
    }
  };

  const showStateOption = (
    status: EPurchaseStatus,
    purchase: TPurchaseResponseItem
  ) => {
    const isPending = status == EPurchaseStatus.PENDING;
    const isCancelAndNotCompletedEitherReturned =
      status == EPurchaseStatus.CANCELED &&
      ![EPurchaseStatus.COMPLETED, EPurchaseStatus.RETURNED].includes(
        purchase.status
      );
    const isReturnedAndPurchaseCompletedAndNotUsed =
      status == EPurchaseStatus.RETURNED &&
      purchase.status == EPurchaseStatus.COMPLETED &&
      !purchase.used;
    const isCompletedAndPurchaseIsPendingOrCompleted =
      status == EPurchaseStatus.COMPLETED &&
      [EPurchaseStatus.PENDING, EPurchaseStatus.COMPLETED].includes(
        purchase.status
      );

    return (
      isPending ||
      isCancelAndNotCompletedEitherReturned ||
      isReturnedAndPurchaseCompletedAndNotUsed ||
      isCompletedAndPurchaseIsPendingOrCompleted
    );
  };

  if (!suppliers || !purchases || !components) {
    return <div>Cargando...</div>;
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Gestión de Compras
        </Typography>
        <Button color="green" onClick={() => handleOpenForm()}>
          <Box display="flex" alignItems="center">
            <AddIcon sx={{ mr: 1 }} />
            Nueva Compra
          </Box>
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Proveedor</TableCell>
                    <TableCell>Componente</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Precio Unitario</TableCell>
                    <TableCell>Fecha de Compra</TableCell>
                    <TableCell>Fecha de Entrega</TableCell>
                    <TableCell>Detalles</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchases.length > 0 ? (
                    purchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell>
                          {
                            suppliers.find((s) => s.id === purchase.supplier.id)
                              ?.name
                          }
                        </TableCell>
                        <TableCell>
                          {
                            components?.find(
                              (c) => c.id === purchase.component.id
                            )?.name
                          }
                        </TableCell>
                        <TableCell>{purchase.quantity}</TableCell>
                        <TableCell>{formatPrice(purchase.unitPrice)}</TableCell>
                        <TableCell>
                          {formatDate(purchase.purchaseDate)}
                        </TableCell>
                        <TableCell>
                          {purchase.deliveryDate
                            ? formatDate(purchase.deliveryDate)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Tooltip title={purchase.details || ""}>
                            <span>
                              {truncateText(purchase.details || "", 100)}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {purchase.status == EPurchaseStatus.CANCELED ||
                          purchase.status == EPurchaseStatus.RETURNED ? (
                            statusLabels[purchase.status]
                          ) : (
                            <Select
                              value={purchase.status}
                              onChange={(e) =>
                                handleStatusChange(e, purchase.id)
                              }
                              size="small"
                              sx={{ minWidth: 120 }}
                            >
                              {Object.values(EPurchaseStatus).map(
                                (status) =>
                                  showStateOption(status, purchase) && (
                                    <MenuItem
                                      disabled={
                                        status == EPurchaseStatus.PENDING
                                      }
                                      key={status}
                                      value={status}
                                    >
                                      {statusLabels[status]}
                                    </MenuItem>
                                  )
                              )}
                            </Select>
                          )}
                        </TableCell>
                        <TableCell>
                          {purchase.status == EPurchaseStatus.PENDING && (
                            <Box display="flex" gap={1}>
                              <Button
                                color="blue"
                                onClick={() => handleConfirmDelete(purchase)}
                              >
                                Eliminar
                              </Button>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                        No hay compras registradas
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal para crear/editar compra */}
      <Modal open={openForm} onClose={handleCloseForm} title="Nueva Compra">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <FormLabel>Proveedor</FormLabel>
                <Controller
                  name="supplierId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      error={!!errors.supplierId}
                      displayEmpty
                      size="small"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      <MenuItem disabled value={0}>
                        <em>Seleccione un proveedor</em>
                      </MenuItem>
                      {suppliers.map((supplier) => (
                        <MenuItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <FormLabel>Componente</FormLabel>
                <Controller
                  name="componentId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      error={!!errors.componentId}
                      displayEmpty
                      size="small"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      <MenuItem disabled value={0}>
                        <em>Seleccione un componente</em>
                      </MenuItem>
                      {components.map((component) => (
                        <MenuItem key={component.id} value={component.id}>
                          {component.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <FormLabel>Cantidad</FormLabel>
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      fullWidth
                      type="text" // Cambiado a tipo texto
                      error={!!errors.quantity}
                      helperText={errors.quantity?.message}
                      placeholder="Cantidad"
                      size="small"
                      onChange={(e) => {
                        // Validar que solo sean números
                        const value = e.target.value;
                        if (value === "" || /^[0-9]*$/.test(value)) {
                          field.onChange(value);
                        }
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <FormLabel>Precio Unitario ($)</FormLabel>
                <Controller
                  name="unitPrice"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      fullWidth
                      type="text" // Cambiado a tipo texto
                      error={!!errors.unitPrice}
                      helperText={errors.unitPrice?.message}
                      placeholder="0.00"
                      size="small"
                      onChange={(e) => {
                        // Validar que solo sean números con decimales
                        const value = e.target.value;
                        if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                          field.onChange(value);
                        }
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>Estado</FormLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} fullWidth size="small">
                      {Object.values(EPurchaseStatus).map((status) => (
                        <MenuItem key={status} value={status}>
                          {statusLabels[status]}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <FormLabel>Fecha de Compra</FormLabel>
                <Controller
                  name="purchaseDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      maxDate={new Date()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          error: !!errors.purchaseDate,
                          helperText: errors.purchaseDate?.message,
                        },
                        actionBar: {
                          actions: ["clear", "accept", "cancel", "today"],
                        },
                      }}
                      slots={{
                        textField: Input,
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>Detalles</FormLabel>
                <Controller
                  name="details"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      fullWidth
                      placeholder="Detalles de la compra"
                      size="small"
                      multiline
                      rows={3}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid
              size={{ xs: 12 }}
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button color="blue" onClick={handleCloseForm}>
                Cancelar
              </Button>
              <Button color="green" buttonType="submit">
                Guardar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Modal>
    </Box>
  );
}

const purchaseSchema = yup.object().shape({
  supplierId: yup
    .number()
    .required("Proveedor es obligatorio")
    .min(1, "Seleccione un proveedor"),
  componentId: yup
    .number()
    .required("Componente es obligatorio")
    .min(1, "Seleccione un componente"),
  quantity: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Cantidad es obligatoria")
    .min(1, "La cantidad debe ser al menos 1")
    .typeError("Debe ser un número válido"),
  unitPrice: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Precio unitario es obligatorio")
    .min(0.01, "El precio debe ser mayor a 0")
    .typeError("Debe ser un número válido"),
  details: yup.string().notRequired(),
  status: yup
    .mixed<EPurchaseStatus>()
    .oneOf(Object.values(EPurchaseStatus))
    .required(),
  purchaseDate: yup.date().required("Fecha de compra es obligatoria"),
});
