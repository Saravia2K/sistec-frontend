"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { AxiosResponse } from "axios";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
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

import useUsers from "@/hooks/useUsers";
import { TClient, TResponseError } from "@/lib/types";
import { formatDate } from "@/lib/helpers";

// Tipo para el formulario
type ClientFormData = {
  name: string;
  phone: string;
  email: string;
  address: string;
  password: string;
};

export default function AdminUsuariosPage() {
  const { users, usersLoading, reloadUsers } = useUsers();
  const [open, setOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<
    TClient | null | undefined
  >(null);

  const { control, handleSubmit, reset } = useForm<ClientFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      address: "",
    },
  });

  const handleOpen = (client?: TClient) => {
    setEditingClient(client);
    if (client) {
      reset({
        name: client.name,
        phone: client.phone,
        email: client.email,
        address: client.address,
      });
    } else {
      reset({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingClient(null);
  };

  const onSubmit = async (data: ClientFormData) => {
    let response: AxiosResponse;
    const isEditing = editingClient != null && editingClient != undefined;
    if (!isEditing) {
      response = await axios.post("/clients", data);
    } else {
      response = await axios.patch(`/clients/${editingClient.idUser}`, data);
    }

    if (response.status >= 400) {
      const { message } = response.data as TResponseError;
      toast(message.join(", "), {
        type: "error",
      });
      return;
    }

    toast(`Usuario ${isEditing ? "actualizado" : "creado"} correctamente`, {
      type: "success",
    });

    reloadUsers();
    handleClose();
  };

  const handleDelete = async (id: number) => {
    // Aquí se conectaría con la API para eliminar
    Swal.fire({
      title: "¿Está seguro?",
      html: "¿Deseas eliminar este usuario de forma permanente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1976D2", // Azul
      cancelButtonColor: "#4CAF50", // Verde
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`/clients/${id}`);
        toast("Usuario eliminado con éxito", {
          type: "success",
        });
        reloadUsers();
      }
    });
  };

  if (!users || usersLoading) return;
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Gestión de Clientes
        </Typography>
        <Button color="green" onClick={() => handleOpen()}>
          <Box display="flex" alignItems="center">
            <AddIcon sx={{ mr: 1 }} />
            Nuevo Cliente
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
                    <TableCell>Fecha de Registro</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.address}</TableCell>
                      <TableCell>
                        {formatDate(client.registrationDate)}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Button
                            color="green"
                            onClick={() => handleOpen(client)}
                          >
                            Editar
                          </Button>
                          <Button
                            color="blue"
                            onClick={() => handleDelete(client.idUser)}
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

      {/* Modal para crear/editar cliente */}
      <Modal open={open} onClose={handleClose}>
        <>
          <Typography id="modal-client-form" variant="h6" component="h2" mb={3}>
            {editingClient ? "Editar Cliente" : "Nuevo Cliente"}
          </Typography>
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
                        placeholder="Nombre completo"
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
                      required: "Este campo es obligatorio",
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
                  <FormLabel>Contraseña</FormLabel>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{
                      required:
                        editingClient == null
                          ? "Este campo es obligatorio"
                          : undefined,
                    }}
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        placeholder="Contraseña"
                        size="small"
                        type="password"
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
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        placeholder="Dirección completa"
                        size="small"
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
                <Button color="blue" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button color="green" buttonType="submit">
                  {editingClient ? "Actualizar" : "Guardar"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </>
      </Modal>
    </Box>
  );
}
