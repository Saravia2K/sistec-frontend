"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  FormLabel,
  Typography,
  FormControl,
  TableContainer,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import Button from "@/components/Buttton";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import type { TSupplier } from "@/lib/types";

// Datos de ejemplo basados en el modelo de Prisma
const suppliersData = [
  {
    id: 1,
    name: "Electrónica Global",
    phone: "555-123-4567",
    email: "contacto@electronicaglobal.com",
    address: "Av. Tecnología 123, Ciudad Industrial",
  },
  {
    id: 2,
    name: "Componentes Rápidos",
    phone: "555-987-6543",
    email: "ventas@componentesrapidos.com",
    address: "Calle Circuito 456, Zona Comercial",
  },
  {
    id: 3,
    name: "Suministros Tech",
    phone: "555-456-7890",
    email: "info@suministrostech.com",
    address: "Plaza Digital 789, Sector Empresarial",
  },
];

// Tipo para el formulario basado en el modelo de Prisma
type SupplierFormData = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

export default function PrveedoresPage() {
  const [openForm, setOpenForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<TSupplier | null>(
    null
  );

  const { control, handleSubmit, reset } = useForm<SupplierFormData>();

  const handleOpenForm = (supplier: TSupplier | null = null) => {
    setEditingSupplier(supplier);
    if (supplier) {
      reset({
        name: supplier.name,
        phone: supplier.phone,
        email: supplier.email || "",
        address: supplier.address || "",
      });
    } else {
      reset({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingSupplier(null);
  };

  const onSubmit = (data: SupplierFormData) => {
    // Aquí se conectaría con la API
    console.log("Form data:", data);
    console.log(
      "Editing supplier:",
      editingSupplier ? editingSupplier.id : "new"
    );

    // Mostrar mensaje de éxito con SweetAlert2
    Swal.fire({
      title: editingSupplier ? "Proveedor Actualizado" : "Proveedor Creado",
      text: editingSupplier
        ? `El proveedor ${data.name} ha sido actualizado correctamente.`
        : `El proveedor ${data.name} ha sido creado correctamente.`,
      icon: "success",
      confirmButtonColor: "#4CAF50", // Verde
    });

    handleCloseForm();
  };

  const handleConfirmDelete = (supplier: TSupplier) => {
    Swal.fire({
      title: "¿Está seguro?",
      text: `¿Desea eliminar al proveedor ${supplier.name}? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1976D2", // Azul
      cancelButtonColor: "#4CAF50", // Verde
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí se conectaría con la API para eliminar
        console.log("Delete supplier with ID:", supplier.id);

        // Mostrar mensaje de éxito
        Swal.fire({
          title: "Eliminado",
          text: `El proveedor ${supplier.name} ha sido eliminado.`,
          icon: "success",
          confirmButtonColor: "#1976D2", // Azul
        });
      }
    });
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
          Gestión de Proveedores
        </Typography>
        <Button color="green" onClick={() => handleOpenForm()}>
          <Box display="flex" alignItems="center">
            <AddIcon sx={{ mr: 1 }} />
            Nuevo Proveedor
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
                    <TableCell>Nombre</TableCell>
                    <TableCell>Teléfono</TableCell>
                    <TableCell>Correo Electrónico</TableCell>
                    <TableCell>Dirección</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {suppliersData.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.address}</TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Button
                            color="green"
                            onClick={() => handleOpenForm(supplier)}
                          >
                            Editar
                          </Button>
                          <Button
                            color="blue"
                            onClick={() => handleConfirmDelete(supplier)}
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

      {/* Modal para crear/editar proveedor usando el componente personalizado */}
      <Modal
        open={openForm}
        onClose={handleCloseForm}
        title={editingSupplier ? "Editar Proveedor" : "Nuevo Proveedor"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>Nombre</FormLabel>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Este campo es obligatorio" }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      placeholder="Nombre del proveedor"
                      size="small"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <FormLabel>Teléfono</FormLabel>
                <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Este campo es obligatorio" }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      placeholder="Número de teléfono"
                      size="small"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <FormLabel>Correo Electrónico</FormLabel>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Correo electrónico inválido",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      placeholder="correo@ejemplo.com"
                      size="small"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>Dirección</FormLabel>
                <Controller
                  name="address"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      fullWidth
                      placeholder="Dirección completa"
                      size="small"
                      multiline
                      rows={2}
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
                {editingSupplier ? "Actualizar" : "Guardar"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Modal>
    </Box>
  );
}
