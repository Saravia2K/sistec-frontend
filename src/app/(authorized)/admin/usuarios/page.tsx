"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  FormLabel,
  Typography,
  FormControl,
  TableContainer,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import Button from "@/components/Buttton";
import Modal from "@/components/Modal";
import { TClient } from "@/lib/types";

const clientsData = [
  {
    id: 1,
    name: "Juan Pérez",
    phone: "555-123-4567",
    email: "juan.perez@example.com",
    address: "Calle Principal 123",
    registrationDate: "15/01/2025",
  },
  {
    id: 2,
    name: "María González",
    phone: "555-987-6543",
    email: "maria.gonzalez@example.com",
    address: "Avenida Central 456",
    registrationDate: "22/02/2025",
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    phone: "555-456-7890",
    email: "carlos.rodriguez@example.com",
    address: "Plaza Mayor 789",
    registrationDate: "10/03/2025",
  },
];

// Tipo para el formulario
type ClientFormData = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

export default function AdminUsuariosPage() {
  const [open, setOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);

  const { control, handleSubmit, reset } = useForm<ClientFormData>();

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

  const onSubmit = (data: ClientFormData) => {
    // Aquí se conectaría con la API
    console.log("Form data:", data);
    console.log("Editing client:", editingClient ? editingClient.id : "new");
    handleClose();
  };

  const handleDelete = (id: number) => {
    // Aquí se conectaría con la API para eliminar
    console.log("Delete client with ID:", id);
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
                  {clientsData.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.address}</TableCell>
                      <TableCell>{client.registrationDate}</TableCell>
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
                            onClick={() => handleDelete(client.id)}
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
                      <TextField
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
                      <TextField
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
                      <TextField
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
                    rules={{ required: "Este campo es obligatorio" }}
                    render={({ field, fieldState }) => (
                      <TextField
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
