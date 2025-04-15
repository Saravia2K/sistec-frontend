import { type ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import Button from "../Buttton";

export default function StatCard({ icon, count, label }: TProps) {
  return (
    <Box display="flex" alignItems="center" mb={2}>
      <Button color="blue" icon>
        {icon}
      </Button>
      <Box ml={2}>
        <Typography variant="h5" fontWeight="bold">
          {count}
        </Typography>
        <Typography variant="body2">{label}</Typography>
      </Box>
    </Box>
  );
}

type TProps = {
  icon: ReactElement;
  count: number;
  label: string;
  color: string;
};
