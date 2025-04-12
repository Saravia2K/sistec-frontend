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
import type { TResponseError, TSupplier } from "@/lib/types";
import useSuppliers from "@/hooks/useSuppliers";
import { toast } from "react-toastify";
import axios, { AxiosResponse } from "axios";
import { API_URL } from "@/lib/consts";

// Tipo para el formulario basado en el modelo de Prisma
type SupplierFormData = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

export default function PrveedoresPage() {
  const { suppliers, suppliersLoading, reloadSuppliers } = useSuppliers();
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

  const onSubmit = async (data: SupplierFormData) => {
    let response: AxiosResponse;
    const isEditing = editingSupplier != null && editingSupplier != undefined;
    if (!isEditing) {
      response = await axios.post(`${API_URL}/suppliers`, data);
    } else {
      response = await axios.patch(
        `${API_URL}/suppliers/${editingSupplier.id}`,
        data
      );
    }

    if (response.status >= 400) {
      const { message } = response.data as TResponseError;
      toast(message.join(", "), {
        type: "error",
      });
      return;
    }

    toast(`Proveedor ${isEditing ? "actualizado" : "creado"} correctamente`, {
      type: "success",
    });

    reloadSuppliers();
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${API_URL}/suppliers/${supplier.id}`);

        reloadSuppliers();
        Swal.fire({
          title: "Eliminado",
          text: `El proveedor ${supplier.name} ha sido eliminado.`,
          icon: "success",
          confirmButtonColor: "#1976D2", // Azul
        });
      }
    });
  };

  if (!suppliers || suppliersLoading) return;
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
                  {suppliers.map((supplier) => (
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
