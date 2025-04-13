"use client";

import { useState } from "react";
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
import axios from "axios";
import { API_URL } from "@/lib/consts";
import { toast } from "react-toastify";
import usePurchases from "@/hooks/usePurchases";
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
  const [editingPurchase, setEditingPurchase] = useState<TPurchase | null>(
    null
  );

  const { control, handleSubmit, reset } = useForm<PurchaseFormData>();

  const handleOpenForm = (purchase: TPurchase | null = null) => {
    setEditingPurchase(purchase);
    if (purchase) {
      reset({
        supplierId: purchase.supplier.id,
        componentId: purchase.component.id,
        quantity: purchase.quantity,
        unitPrice: purchase.unitPrice,
        details: purchase.details || "",
        status: purchase.status,
        purchaseDate: new Date(purchase.purchaseDate), // Convertir string a Date
      });
    } else {
      reset({
        supplierId: 0,
        componentId: 0,
        quantity: 1,
        unitPrice: 0,
        details: "",
        status: EPurchaseStatus.PENDING,
        purchaseDate: new Date(), // Fecha actual por defecto
      });
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingPurchase(null);
  };

  const onSubmit = async (data: PurchaseFormData) => {
    try {
      let response;
      const isEditing = editingPurchase !== null;

      if (isEditing) {
        response = await axios.patch(
          `${API_URL}/purchases/${editingPurchase.id}`,
          data
        );
      } else {
        response = await axios.post(`${API_URL}/purchases`, data);
      }

      if (response.status >= 400) {
        const { message } = response.data as TResponseError;
        toast.error(message.join(", "));
        return;
      }

      toast.success(
        `Compra ${isEditing ? "actualizada" : "creada"} correctamente`
      );

      handleCloseForm();
      reloadPurchases();
    } catch (_) {
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
        } catch (_) {
          toast.error("Error al eliminar la compra");
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
      await axios.patch(`${API_URL}/purchases/${purchaseId}`, {
        status: newStatus,
      });

      toast.success("Estado actualizado correctamente");
      reloadPurchases();
    } catch (_) {
      toast.error("Error al actualizar el estado");
    }
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
                          <Select
                            value={purchase.status}
                            onChange={(e) => handleStatusChange(e, purchase.id)}
                            size="small"
                            sx={{ minWidth: 120 }}
                          >
                            {Object.values(EPurchaseStatus).map((status) => (
                              <MenuItem
                                disabled={status == EPurchaseStatus.PENDING}
                                key={status}
                                value={status}
                              >
                                {statusLabels[status]}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Button
                              color="green"
                              onClick={() => handleOpenForm(purchase)}
                            >
                              Editar
                            </Button>
                            <Button
                              color="blue"
                              onClick={() => handleConfirmDelete(purchase)}
                            >
                              Eliminar
                            </Button>
                          </Box>
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
      <Modal
        open={openForm}
        onClose={handleCloseForm}
        title={editingPurchase ? "Editar Compra" : "Nueva Compra"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <FormLabel>Proveedor</FormLabel>
                <Controller
                  name="supplierId"
                  control={control}
                  rules={{
                    required: "Este campo es obligatorio",
                    min: { value: 1, message: "Seleccione un proveedor" },
                  }}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      fullWidth
                      error={!!fieldState.error}
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
                  rules={{
                    required: "Este campo es obligatorio",
                    min: { value: 1, message: "Seleccione un componente" },
                  }}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      fullWidth
                      error={!!fieldState.error}
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
                  rules={{
                    required: "Este campo es obligatorio",
                    min: {
                      value: 1,
                      message: "La cantidad debe ser al menos 1",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      fullWidth
                      type="number"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      placeholder="Cantidad"
                      size="small"
                      slotProps={{ htmlInput: { min: 1 } }}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                  rules={{
                    required: "Este campo es obligatorio",
                    min: {
                      value: 0.01,
                      message: "El precio debe ser mayor a 0",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      fullWidth
                      type="number"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      placeholder="0.00"
                      size="small"
                      slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                  rules={{
                    required: "Este campo es obligatorio",
                  }}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      maxDate={new Date()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                        },
                        actionBar: {
                          actions: ["clear", "accept", "cancel", "today"],
                        },
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
                {editingPurchase ? "Actualizar" : "Guardar"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Modal>
    </Box>
  );
}
