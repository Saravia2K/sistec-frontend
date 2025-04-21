"use client";

import Image from "next/image";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { COLORS } from "@/lib/consts";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "nextjs-toploader/app";
import { useEffect } from "react";
import logotype from "@/assets/images/logotype_sistec.png";
import axios from "@/lib/axios";

type PasswordFormData = {
  newPassword: string;
};

export default function WelcomePage() {
  const { user, isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    defaultValues: {
      newPassword: "",
    },
  });

  // Redirigir si no está autenticado
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  const onSubmit = async (data: PasswordFormData) => {
    try {
      await axios.patch(`/users/${user?.id}`, {
        password: data.newPassword,
      });

      if (user?.customer != null) {
        router.push("/cliente");
        return;
      }
      if (user?.technician != null) {
        router.push("/soporte");
        return;
      } else {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Error:", error);
      // Puedes mostrar un snackbar o toast con el error
    }
  };

  if (!isHydrated || !isAuthenticated) {
    return <div>Cargando...</div>;
  }

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: { xs: "85%", md: "40%", xl: "35%" },
        py: 3,
      }}
    >
      <Box
        component={Image}
        src={logotype}
        alt="Sistec"
        width={{ xs: "75%", sm: "35%" }}
        height="auto"
        my={3}
      />
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        gap={4}
        width={{ xs: "85%", md: "50%" }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography textAlign="center" fontSize={13}>
          ¡Bienvenido a SISTEC, {user?.name}!
          <br /> <br />
          Antes de continuar, por favor cambia tu contraseña para mantener tu cuenta segura
        </Typography>

        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="******"
              label="Nueva Contraseña"
              type="password"
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />
          )}
        />

        <Button
          variant="contained"
          sx={{
            bgcolor: COLORS.GREEN,
            textTransform: "none",
            "&:disabled": {
              bgcolor: COLORS.GREEN,
              opacity: 0.7,
            },
          }}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Actualizando..." : "Actualizar Contraseña"}
        </Button>
      </Box>
    </Paper>
  );
}
