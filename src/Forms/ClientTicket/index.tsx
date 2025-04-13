"use client";

import { usePathname, useRouter } from "next/navigation";
import { Grid, Paper, FormControl, FormLabel, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import Button from "@/components/Buttton";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { TTicket } from "@/lib/types";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import useSupportedDevices from "@/hooks/useSupportedDevices";
import { API_URL } from "@/lib/consts";

type SupportTicketFormData = Pick<
  TTicket,
  "brand" | "model" | "serialNumber" | "problemDescription"
> & {
  deviceTypeId: number;
};

export default function ClientTicket({ ticket, watch }: TProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user } = useAuth();
  const isEditing = ticket != undefined;
  const { devices, isLoading: devicesLoading } = useSupportedDevices();

  const { control, handleSubmit, reset } = useForm<SupportTicketFormData>({
    defaultValues: {
      deviceTypeId: ticket?.deviceTypeId ?? 0,
      brand: ticket?.brand ?? "",
      problemDescription: ticket?.problemDescription ?? "",
      model: ticket?.model ?? "",
      serialNumber: ticket?.serialNumber ?? "",
    },
  });

  const onSubmit = async (data: SupportTicketFormData) => {
    try {
      const ticketData = {
        ...data,
        customerId: user?.id,
      };

      if (isEditing) {
        await axios.patch(`${API_URL}/tickets/${ticket.id}`, ticketData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire(
          "¡Actualizado!",
          "El ticket ha sido actualizado correctamente.",
          "success"
        );
      } else {
        await axios.post(`${API_URL}/tickets`, ticketData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire(
          "¡Creado!",
          "El ticket ha sido creado correctamente.",
          "success"
        );
      }

      if (!isEditing) {
        reset();
      }
      router.push("/cliente/tickets");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Ocurrió un error al procesar tu solicitud", "error");
    }
  };

  const handleDelete = async () => {
    if (!ticket) return;

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticket.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire(
          "¡Eliminado!",
          "El ticket ha sido eliminado correctamente.",
          "success"
        );
        router.push("/cliente/tickets");
      } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", "Ocurrió un error al eliminar el ticket", "error");
      }
    }
  };

  if (devicesLoading) {
    return <div>Cargando dispositivos...</div>;
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 5 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Segunda fila */}
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <FormLabel>Tipo de Dispositivo *</FormLabel>
              <Controller
                name="deviceTypeId"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                render={({ field, fieldState }) => (
                  <Select
                    {...field}
                    fullWidth
                    displayEmpty
                    disabled={watch}
                    error={!!fieldState.error}
                  >
                    <MenuItem disabled value="">
                      <em>Seleccione un dispositivo</em>
                    </MenuItem>
                    {devices.map((device) => (
                      <MenuItem key={device.id} value={device.id}>
                        {device.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          {/* Resto del formulario se mantiene igual */}
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <FormLabel>Marca *</FormLabel>
              <Controller
                name="brand"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    fullWidth
                    disabled={watch}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    placeholder="Ej: HP, Dell, Apple"
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <FormLabel>Modelo</FormLabel>
              <Controller
                name="model"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    fullWidth
                    disabled={watch}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    placeholder="Ej: Inspiron 15, MacBook Pro"
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <FormLabel>Número de Serie</FormLabel>
              <Controller
                name="serialNumber"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    fullWidth
                    disabled={watch}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    placeholder="Número de serie del dispositivo"
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>Descripción del Problema *</FormLabel>
              <Controller
                name="problemDescription"
                control={control}
                rules={{
                  required: "Este campo es obligatorio",
                  minLength: {
                    value: 10,
                    message: "La descripción debe tener al menos 10 caracteres",
                  },
                }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    fullWidth
                    multiline
                    disabled={watch}
                    rows={4}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    placeholder="Describa detalladamente el problema que presenta el dispositivo"
                  />
                )}
              />
            </FormControl>
          </Grid>

          {/* Botones de acción */}
          {!watch ? (
            <Grid
              size={{ xs: 12 }}
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                color="blue"
                onClick={() => router.push("/cliente/tickets")}
              >
                Cancelar
              </Button>
              <Button color="green" buttonType="submit">
                {isEditing ? "Actualizar" : "Guardar"}
              </Button>
            </Grid>
          ) : (
            <Grid
              size={{ xs: 12 }}
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button color="blue" onClick={handleDelete}>
                Eliminar
              </Button>
              <Button
                color="green"
                onClick={() => router.push(`${pathname}/editar`)}
              >
                Editar
              </Button>
            </Grid>
          )}
        </Grid>
      </form>
    </Paper>
  );
}

type TProps = {
  ticket?: SupportTicketFormData & {
    id: number;
  };
  watch?: boolean;
};
