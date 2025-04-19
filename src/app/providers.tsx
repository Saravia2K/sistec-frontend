"use client";

import axios, { AxiosResponse } from "axios";
import { ToastContainer } from "react-toastify";
import { es } from "date-fns/locale";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CssBaseline from "@mui/material/CssBaseline";
import LoadingBackdropProvider from "@/providers/LoadingBackdropProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { parseDates } from "@/lib/helpers";

axios.interceptors.response.use((response: AxiosResponse) => {
  if (response.data) {
    response.data = parseDates(response.data);
  }
  return response;
});

axios.defaults.baseURL = process.env.NEXT_AUTH_API_URL;

export default function Providers({ children }: TProps) {
  return (
    <ReactQueryProvider>
      <LoadingBackdropProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <CssBaseline />
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
