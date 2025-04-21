"use client";

import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { useAuthStore } from "@/hooks/useLoggedUser";
import axios from "@/lib/axios";
import { TClient, TTechnician } from "@/lib/types";
import { COLORS } from "@/lib/consts";

import logotype from "@/assets/images/logotype_sistec.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await axios.post<{
        message: string;
        token: string;
        user: {
          id: number;
          name: string;
          email: string;
          firstLogin: boolean;
          phone: string;
          customer: TClient | null;
          technician: TTechnician | null;
        };
      }>(`/auth/login`, { email, password });

      if (data.status != 201) {
        throw new Error("Credenciales inválidas");
      }

      // Guardar los datos en el store de Zustand
      login({
        user: data.data.user,
        token: data.data.token,
      });

      if (data.data.user.firstLogin) {
        router.push("/bienvenido");
        return;
      }

      if (data.data.user.customer != null) {
        router.push("/cliente");
        return;
      }
      if (data.data.user.technician != null) {
        router.push("/soporte");
        return;
      } else {
        router.push("/admin");
      }
    } catch (err: unknown) {
      console.log(err);
      setError("Credenciales incorrectas");
    } finally {
      setIsLoading(false);
    }
  };

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
        onSubmit={handleSubmit}
      >
        <TextField
          fullWidth
          placeholder="example@email.com"
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          placeholder="******"
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}

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
          disabled={isLoading}
        >
          {isLoading ? "Cargando..." : "Login"}
        </Button>
      </Box>
    </Paper>
  );
}
