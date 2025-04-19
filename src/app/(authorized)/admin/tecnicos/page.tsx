"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import type { AxiosResponse } from "axios";
import axios from "@/lib/axios";
import Swal from "sweetalert2";
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
  capitalize,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import Button from "@/components/Buttton";
import { useForm, Controller } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { TResponseError, TTechnician } from "@/lib/types";
import { ETechnicianSpeciality } from "@/lib/enums";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Select from "@/components/Select";
import useTechnicians from "@/hooks/useTechnicians";

// Tipo para el formulario
type SupportFormData = {
  name: string;
  phone: string;
  email: string;
  specialty: ETechnicianSpeciality;
  active: boolean;
  password: string;
};

export default function AdminSoportesPage() {
  const { technicians, reloadTechnicians, techniciansLoading } =
    useTechnicians();
  const [open, setOpen] = useState(false);
  const [editingSupport, setEditingSupport] = useState<
    TTechnician | null | undefined
  >(null);

  const { control, handleSubmit, reset } = useForm<SupportFormData>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      specialty: ETechnicianSpeciality.GENERAL,
      active: true,
      password: "",
    },
  });

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
        specialty: ETechnicianSpeciality.GENERAL,
        active: true,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSupport(null);
  };

  const onSubmit = async (data: SupportFormData) => {
    let response: AxiosResponse;
    const isEditing = editingSupport != null && editingSupport != undefined;
    if (!isEditing) {
      response = await axios.post("/technicians", data);
    } else {
      response = await axios.patch(
        `/technicians/${editingSupport.idUser}`,
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

    toast(`Técnico ${isEditing ? "actualizado" : "creado"} correctamente`, {
      type: "success",
    });

    reloadTechnicians();
    handleClose();
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "¿Está seguro?",
      html: "¿Deseas eliminar este técnico de forma permanente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1976D2", // Azul
      cancelButtonColor: "#4CAF50", // Verde
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`/technicians/${id}`);
        toast("Técnico eliminado con éxito", {
          type: "success",
        });
        reloadTechnicians();
      }
    });
  };

  if (!technicians || techniciansLoading) return;
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
                    <TableCell>Nombre</TableCell>
                    <TableCell>Teléfono</TableCell>
                    <TableCell>Correo Electrónico</TableCell>
                    <TableCell>Especialidad</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {technicians.map((support) => (
                    <TableRow key={support.id}>
                      <TableCell>{support.name}</TableCell>
                      <TableCell>{support.phone}</TableCell>
                      <TableCell>{support.email}</TableCell>
                      <TableCell>{support.specialty}</TableCell>
                      <TableCell>
                        <Chip
                          label={support.active ? "Activo" : "Inactivo"}
                          color={support.active ? "success" : "error"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Button
                            color="green"
                            onClick={() => handleOpen(support)}
                          >
                            Editar
                          </Button>
                          <Button
                            color="blue"
                            onClick={() => handleDelete(support.idUser)}
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
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <FormLabel>Especialidad</FormLabel>
                  <Controller
                    name="specialty"
                    control={control}
                    defaultValue={ETechnicianSpeciality.GENERAL}
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
                              {capitalize(specialty)}
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
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <FormLabel>Contraseña</FormLabel>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{
                      required:
                        editingSupport == null
                          ? "Este campo es obligatorio"
                          : undefined,
                    }}
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        placeholder="Contraseña temporal"
                        size="small"
                        type="password"
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
