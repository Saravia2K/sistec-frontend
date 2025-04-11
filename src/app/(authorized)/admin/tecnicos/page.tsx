"use client";

import { useState } from "react";
import {
  Box,
  Grid,
  Chip,
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  MenuItem,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import Button from "@/components/Buttton";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import { TTechnician } from "@/lib/types";
import { ETechnicianSpeciality } from "@/lib/enums";
import Modal from "@/components/Modal";

// Datos de ejemplo
const supportData = [
  {
    id: 1,
    name: "Ana Martínez",
    phone: "555-111-2222",
    email: "ana.martinez@example.com",
    specialty: ETechnicianSpeciality.HARDWARE,
    active: true,
  },
  {
    id: 2,
    name: "Roberto Sánchez",
    phone: "555-333-4444",
    email: "roberto.sanchez@example.com",
    specialty: ETechnicianSpeciality.SOFTWARE,
    active: true,
  },
  {
    id: 3,
    name: "Laura Gómez",
    phone: "555-555-6666",
    email: "laura.gomez@example.com",
    specialty: ETechnicianSpeciality.GENERAL,
    active: false,
  },
];

// Tipo para el formulario
type SupportFormData = {
  name: string;
  phone: string;
  email: string;
  specialty: string;
  active: boolean;
};

export default function AdminSoportesPage() {
  const [open, setOpen] = useState(false);
  const [editingSupport, setEditingSupport] = useState<any>(null);

  const { control, handleSubmit, reset } = useForm<SupportFormData>();

  const handleOpen = (support?: TTechnician) => {
    setEditingSupport(support);
    if (support) {
      reset({
        name: support.name,
        phone: support.phone,
        email: support.email,
        specialty: support.specialty,
        active: support.active,
      });
    } else {
      reset({
        name: "",
        phone: "",
        email: "",
        specialty: "",
        active: true,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSupport(null);
  };

  const onSubmit = (data: SupportFormData) => {
    // Aquí se conectaría con la API
    console.log("Form data:", data);
    console.log("Editing support:", editingSupport ? editingSupport.id : "new");
    handleClose();
  };

  const handleDelete = (id: number) => {
    // Aquí se conectaría con la API para eliminar
    console.log("Delete support with ID:", id);
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
          Gestión de Soporte Técnico
        </Typography>
        <Button color="green" onClick={() => handleOpen()}>
          <Box display="flex" alignItems="center">
            <AddIcon sx={{ mr: 1 }} />
            Nuevo Técnico
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
                    <TableCell sx={{ borderWidth: 2, borderColor: "#000" }}>
                      Nombre
                    </TableCell>
                    <TableCell sx={{ borderWidth: 2, borderColor: "#000" }}>
                      Teléfono
                    </TableCell>
                    <TableCell sx={{ borderWidth: 2, borderColor: "#000" }}>
                      Correo Electrónico
                    </TableCell>
                    <TableCell sx={{ borderWidth: 2, borderColor: "#000" }}>
                      Especialidad
                    </TableCell>
                    <TableCell sx={{ borderWidth: 2, borderColor: "#000" }}>
                      Estado
                    </TableCell>
                    <TableCell sx={{ borderWidth: 2, borderColor: "#000" }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {supportData.map((support) => (
                    <TableRow key={support.id}>
                      <TableCell sx={{ border: 0 }}>{support.name}</TableCell>
                      <TableCell sx={{ border: 0 }}>{support.phone}</TableCell>
                      <TableCell sx={{ border: 0 }}>{support.email}</TableCell>
                      <TableCell sx={{ border: 0 }}>
                        {support.specialty}
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        <Chip
                          label={support.active ? "Activo" : "Inactivo"}
                          color={support.active ? "success" : "error"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        <Box display="flex" gap={1}>
                          <Button
                            color="green"
                            onClick={() => handleOpen(support)}
                          >
                            Editar
                          </Button>
                          <Button
                            color="blue"
                            onClick={() => handleDelete(support.id)}
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

      {/* Modal para crear/editar soporte */}
      <Modal open={open} onClose={handleClose}>
        <>
          <Typography
            id="modal-support-form"
            variant="h6"
            component="h2"
            mb={3}
          >
            {editingSupport ? "Editar Técnico" : "Nuevo Técnico"}
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
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <FormLabel>Especialidad</FormLabel>
                  <Controller
                    name="specialty"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Este campo es obligatorio" }}
                    render={({ field, fieldState }) => (
                      <Select
                        {...field}
                        fullWidth
                        error={!!fieldState.error}
                        displayEmpty
                        size="small"
                      >
                        <MenuItem disabled value="">
                          <em>Seleccione una especialidad</em>
                        </MenuItem>
                        {Object.values(ETechnicianSpeciality).map(
                          (specialty) => (
                            <MenuItem key={specialty} value={specialty}>
                              {specialty.charAt(0).toUpperCase()}
                              {specialty.slice(1)}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <FormLabel>Estado</FormLabel>
                  <Controller
                    name="active"
                    control={control}
                    defaultValue={true}
                    render={({ field }) => (
                      <Select {...field} fullWidth size="small">
                        <MenuItem value={true as any}>Activo</MenuItem>
                        <MenuItem value={false as any}>Inactivo</MenuItem>
                      </Select>
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
                  {editingSupport ? "Actualizar" : "Guardar"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </>
      </Modal>
    </Box>
  );
}
