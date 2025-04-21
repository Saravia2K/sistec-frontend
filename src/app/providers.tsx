"use client";

import { ToastContainer } from "react-toastify";
import NextTopLoader from "nextjs-toploader";
import { es } from "date-fns/locale";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CssBaseline from "@mui/material/CssBaseline";
import LoadingBackdropProvider from "@/providers/LoadingBackdropProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { COLORS } from "@/lib/consts";

export default function Providers({ children }: TProps) {
  return (
    <ReactQueryProvider>
      <LoadingBackdropProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <CssBaseline />
          <NextTopLoader color={COLORS.GREEN} height={5} showSpinner={false} />
          {children}
          <ToastContainer hideProgressBar />
        </LocalizationProvider>
      </LoadingBackdropProvider>
    </ReactQueryProvider>
  );
}

type TProps = Readonly<{
  children: React.ReactNode;
}>;
