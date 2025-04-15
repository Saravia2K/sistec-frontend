"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Grid,
  Paper,
  Table,
  Switch,
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
import type { TResponseError, TComponent } from "@/lib/types";
import useComponents from "@/hooks/useComponents";
import { toast } from "react-toastify";
import { type AxiosResponse } from "axios";
import axios from "@/lib/axios";

// Tipo para el formulario basado en el modelo de Prisma
type ComponentFormData = {
  name: string;
  description: string;
  visible: boolean;
};

export default function ComponentsPage() {
  const { components, componentsLoading, reloadComponents } = useComponents();
  const [openForm, setOpenForm] = useState(false);
  const [editingComponent, setEditingComponent] = useState<TComponent | null>(
    null
  );

  const { control, handleSubmit, reset } = useForm<ComponentFormData>();

  const handleOpenForm = (component: TComponent | null = null) => {
    setEditingComponent(component);
    if (component) {
      reset({
        name: component.name,
        description: component.description || "",
        visible: component.visible,
      });
    } else {
      reset({
        name: "",
        description: "",
        visible: true,
      });
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingComponent(null);
  };

  const onSubmit = async (data: ComponentFormData) => {
    let response: AxiosResponse;
    const isEditing = editingComponent != null && editingComponent != undefined;
    if (!isEditing) {
      response = await axios.post(`/components`, data);
    } else {
      response = await axios.patch(`/components/${editingComponent.id}`, data);
    }

    if (response.status >= 400) {
      const { message } = response.data as TResponseError;
      toast(message.join(", "), {
        type: "error",
      });
      return;
    }

    toast(`Componente ${isEditing ? "actualizado" : "creado"} correctamente`, {
      type: "success",
    });

    reloadComponents();
    handleCloseForm();
  };

  const handleToggleVisibility = async (component: TComponent) => {
    try {
      await axios.patch(`/components/${component.id}`, {
        visible: !component.visible,
      });

      reloadComponents();
      toast(
        `Componente ${!component.visible ? "visible" : "oculto"} correctamente`,
        {
          type: "success",
        }
      );
    } catch (error) {
      toast("Error al cambiar la visibilidad del componente", {
        type: "error",
      });
      console.log(error);
    }
  };

  if (!components || componentsLoading) return null;

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Gestión de Componentes
        </Typography>
        <Button color="green" onClick={() => handleOpenForm()}>
          <Box display="flex" alignItems="center">
            <AddIcon sx={{ mr: 1 }} />
            Nuevo Componente
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
                    <TableCell>Descripción</TableCell>
                    <TableCell>Visible</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {components.map((component) => (
                    <TableRow key={component.id}>
                      <TableCell>{component.name}</TableCell>
                      <TableCell>
                        {component.description &&
                        component.description.length > 100
                          ? `${component.description.substring(0, 100)}...`
                          : component.description}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={component.visible}
                          onChange={() => handleToggleVisibility(component)}
                          color="success"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Button
                            color="green"
                            onClick={() => handleOpenForm(component)}
                          >
                            Editar
                          </Button>
                          {/* <Button
                            color="blue"
                            onClick={() => handleConfirmDelete(component)}
                          >
                            Eliminar
                          </Button> */}
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

      {/* Modal para crear/editar componente */}
      <Modal
        open={openForm}
        onClose={handleCloseForm}
        title={editingComponent ? "Editar Componente" : "Nuevo Componente"}
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
                      placeholder="Nombre del componente"
                      size="small"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>Descripción</FormLabel>
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      fullWidth
                      placeholder="Descripción del componente"
                      size="small"
                      multiline
                      rows={3}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center" mt={1}>
                  <FormLabel sx={{ mr: 2 }}>Visible</FormLabel>
                  <Controller
                    name="visible"
                    control={control}
                    defaultValue={true}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        color="success"
                      />
                    )}
                  />
                </Box>
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
                {editingComponent ? "Actualizar" : "Guardar"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Modal>
    </Box>
  );
}
