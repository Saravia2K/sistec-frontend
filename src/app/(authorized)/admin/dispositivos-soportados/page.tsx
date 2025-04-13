"use client";

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
import { useForm, Controller } from "react-hook-form";
import useSupportedDevices, {
  type TSupportedDevice,
} from "@/hooks/useSupportedDevices";
import { useState } from "react";

export default function SupportedDevicesPage() {
  const [openForm, setOpenForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState<TSupportedDevice | null>(
    null
  );

  const {
    devices,
    isLoading,
    reloadDevices,
    createDevice,
    updateDevice,
    isCreating,
    isUpdating,
  } = useSupportedDevices();

  const { control, handleSubmit, reset } = useForm<SupportedDeviceFormData>();

  const handleOpenForm = (device: TSupportedDevice | null = null) => {
    setEditingDevice(device);
    reset({
      name: device?.name || "",
    });
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingDevice(null);
  };

  const onSubmit = async (data: SupportedDeviceFormData) => {
    try {
      if (editingDevice) {
        await updateDevice({ id: editingDevice.id, data });
      } else {
        await createDevice(data);
      }
      reloadDevices();
      handleCloseForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (isLoading) return null;

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Gestión de Dispositivos Soportados
        </Typography>
        <Button color="green" onClick={() => handleOpenForm()}>
          <Box display="flex" alignItems="center">
            <AddIcon sx={{ mr: 1 }} />
            Nuevo Dispositivo
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
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {devices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No hay dispositivos registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    devices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell>{device.id}</TableCell>
                        <TableCell>{device.name}</TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Button
                              color="green"
                              onClick={() => handleOpenForm(device)}
                            >
                              Editar
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal para crear/editar dispositivo */}
      <Modal
        open={openForm}
        onClose={handleCloseForm}
        title={editingDevice ? "Editar Dispositivo" : "Nuevo Dispositivo"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel>Nombre</FormLabel>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Este campo es obligatorio" }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      placeholder="Nombre del dispositivo"
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
              <Button color="blue" onClick={handleCloseForm}>
                Cancelar
              </Button>
              <Button
                color="green"
                buttonType="submit"
                disabled={isCreating || isUpdating}
              >
                {editingDevice
                  ? isUpdating
                    ? "Actualizando..."
                    : "Actualizar"
                  : isCreating
                  ? "Creando..."
                  : "Guardar"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Modal>
    </Box>
  );
}

type SupportedDeviceFormData = {
  name: string;
};
