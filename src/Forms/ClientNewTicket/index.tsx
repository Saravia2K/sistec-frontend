import { Grid, Paper, FormControl, FormLabel, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import Button from "@/components/Buttton";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { TTicket } from "@/lib/types";

const supportedDevices = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Desktop" },
  { id: 3, name: "Tablet" },
  { id: 4, name: "Smartphone" },
  { id: 5, name: "Impresora" },
];

type SupportTicketFormData = Pick<
  TTicket,
  "brand" | "model" | "serialNumber" | "problemDescription"
> & {
  deviceTypeId: number;
};

export default function ClientNewTicket({ ticket }: TProps) {
  const isEditing = ticket != undefined;

  const { control, handleSubmit, reset } = useForm<SupportTicketFormData>({
    defaultValues: {
      deviceTypeId: ticket?.deviceTypeId,
      brand: ticket?.brand ?? "",
      problemDescription: ticket?.problemDescription ?? "",
      model: ticket?.model ?? "",
      serialNumber: ticket?.serialNumber ?? "",
    },
  });

  const onSubmit = (data: SupportTicketFormData) => {
    // Aquí se conectaría con la API para guardar el ticket
    console.log("Form data:", data);

    // Resetear el formulario después de enviar
    if (!isEditing) {
      reset();
    }
  };
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
                    error={!!fieldState.error}
                    //   helperText={fieldState.error?.message}
                    displayEmpty
                  >
                    <MenuItem disabled value="">
                      <em>Seleccione un dispositivo</em>
                    </MenuItem>
                    {supportedDevices.map((device) => (
                      <MenuItem key={device.id} value={device.id}>
                        {device.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

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
          <Grid
            size={{ xs: 12 }}
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button color="blue" onClick={() => reset()}>
              Cancelar
            </Button>
            <Button color="green" buttonType="submit">
              {isEditing ? "Actualizar" : "Guardar"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

type TProps = {
  ticket?: SupportTicketFormData & {
    id: number;
  };
};
