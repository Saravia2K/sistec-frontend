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
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Swal from "sweetalert2";
import { EPurchaseStatus } from "@/lib/enums";
import { TPurchase } from "@/lib/types";
import { formatDate, formatPrice, truncateText } from "@/lib/helpers";
import Select from "@/components/Select";
import Input from "@/components/Input";

// Datos de ejemplo para proveedores
const suppliersData = [
  { id: 1, name: "Electrónica Global" },
  { id: 2, name: "Componentes Rápidos" },
  { id: 3, name: "Suministros Tech" },
];

// Datos de ejemplo para componentes
const componentsData = [
  { id: 1, name: "Procesador Intel i7" },
  { id: 2, name: "Memoria RAM 16GB" },
  { id: 3, name: "Disco SSD 1TB" },
  { id: 4, name: "Tarjeta Gráfica NVIDIA" },
];

// Datos de ejemplo para compras
const purchasesData = [
  {
    id: 1,
    supplier: { id: 1 },
    component: { id: 1 },
    quantity: 10,
    unitPrice: 299.99,
    purchaseDate: new Date("2025-01-15"),
    deliveryDate: new Date("2025-01-25"),
    details:
      "Procesadores de última generación para equipos de alto rendimiento. Incluye garantía extendida y soporte técnico especializado.",
    status: EPurchaseStatus.COMPLETED,
  },
  {
    id: 2,
    supplier: { id: 2 },
    component: { id: 2 },
    quantity: 20,
    unitPrice: 89.5,
    purchaseDate: new Date("2025-02-10"),
    deliveryDate: null,
    details:
      "Memorias RAM de alta velocidad para actualización de equipos existentes.",
    status: EPurchaseStatus.PENDING,
  },
  {
    id: 3,
    supplier: { id: 3 },
    component: { id: 2 },
    quantity: 15,
    unitPrice: 129.99,
    purchaseDate: new Date("2025-03-05"),
    deliveryDate: new Date("2025-03-15"),
    details:
      "Discos de estado sólido para mejorar el rendimiento de almacenamiento.",
    status: EPurchaseStatus.CANCELED,
  },
];

// Tipo para el formulario basado en el modelo de Prisma
type PurchaseFormData = {
  supplierId: number;
  componentId: number;
  quantity: number;
  unitPrice: number;
  details: string;
  status: EPurchaseStatus;
};

// Mapeo de estados a texto en español
const statusLabels = {
  [EPurchaseStatus.PENDING]: "Pendiente",
  [EPurchaseStatus.COMPLETED]: "Completado",
  [EPurchaseStatus.CANCELED]: "Cancelado",
  [EPurchaseStatus.RETURNED]: "Devuelto",
};

export default function InventarioPage() {
  const [openForm, setOpenForm] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<any>(null);
  const [purchases, setPurchases] = useState(purchasesData);

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
      });
    } else {
      reset({
        supplierId: 0,
        componentId: 0,
        quantity: 1,
        unitPrice: 0,
        details: "",
        status: EPurchaseStatus.PENDING,
      });
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingPurchase(null);
  };

  const onSubmit = (data: PurchaseFormData) => {
    // Aquí se conectaría con la API

    handleCloseForm();
  };

  const handleConfirmDelete = (purchase: TPurchase) => {
    const supplierName = suppliersData.find(
      (s) => s.id === purchase.supplier.id
    )?.name;
    const componentName = componentsData.find(
      (c) => c.id === purchase.component.id
    )?.name;

    Swal.fire({
      title: "¿Está seguro?",
      html: `¿Desea eliminar la compra de <strong>${componentName}</strong> a <strong>${supplierName}</strong>?<br>Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1976D2", // Azul
      cancelButtonColor: "#4CAF50", // Verde
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Simulación de eliminación
        setPurchases(purchases.filter((p) => p.id !== purchase.id));

        // Mostrar mensaje de éxito
        Swal.fire({
          title: "Eliminada",
          text: "La compra ha sido eliminada correctamente.",
          icon: "success",
          confirmButtonColor: "#1976D2", // Azul
        });
      }
    });
  };

  const handleStatusChange = (
    event: SelectChangeEvent<string>,
    purchaseId: number
  ) => {
    // Notificación de cambio de estado
  };

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
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>
                        {
                          suppliersData.find(
                            (s) => s.id === purchase.supplier.id
                          )?.name
                        }
                      </TableCell>
                      <TableCell>
                        {
                          componentsData.find(
                            (c) => c.id === purchase.component.id
                          )?.name
                        }
                      </TableCell>
                      <TableCell>{purchase.quantity}</TableCell>
                      <TableCell>{formatPrice(purchase.unitPrice)}</TableCell>
                      <TableCell>{formatDate(purchase.purchaseDate)}</TableCell>
                      <TableCell>{formatDate(purchase.deliveryDate)}</TableCell>
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
                          sx={{
                            minWidth: 120,
                          }}
                        >
                          {Object.values(EPurchaseStatus).map((status) => (
                            <MenuItem key={status} value={status}>
                              {statusLabels[status]}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        <Box display="flex" gap={1}>
                          <Button
                            color="green"
                            onClick={() => handleOpenForm(purchase as any)}
                          >
                            Editar
                          </Button>
                          <Button
                            color="blue"
                            onClick={() => handleConfirmDelete(purchase as any)}
                          >
                            Eliminar
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
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
                  defaultValue={0}
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
                      {suppliersData.map((supplier) => (
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
                  defaultValue={0}
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
                      {componentsData.map((component) => (
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
                  defaultValue={1}
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
                  defaultValue={0}
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
                  defaultValue={EPurchaseStatus.PENDING}
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
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>Detalles</FormLabel>
                <Controller
                  name="details"
                  control={control}
                  defaultValue=""
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
