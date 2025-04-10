import Image from "next/image";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { COLORS } from "@/lib/consts";

import logotype from "@/assets/images/logotype_sistec.png";

export default function WelcomePage() {
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
      >
        <Typography textAlign="center" fontSize={13}>
          ¡Bienvenido a SISTEC!
          <br /> <br />
          Antes de continuar, por favor cambia tu contraseña para mantener tu
          cuenta segura
        </Typography>
        <TextField
          fullWidth
          placeholder="******"
          label="Contraseña"
          type="password"
        />
        <Button
          variant="contained"
          sx={{ bgcolor: COLORS.GREEN, textTransform: "none" }}
          type="submit"
        >
          Actualizar Contraseña
        </Button>
      </Box>
    </Paper>
  );
}
