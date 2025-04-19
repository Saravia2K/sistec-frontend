import axios from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export type TSupportedDevice = {
  id: number;
  name: string;
};

export type SupportedDeviceFormData = {
  name: string;
};

const fetchSupportedDevices = async () =>
  axios.get<TSupportedDevice[]>("/supported-devices");

const createDevice = async (data: SupportedDeviceFormData) =>
  axios.post<TSupportedDevice>("/supported-devices", data);

const updateDevice = async ({
  id,
  data,
}: {
  id: number;
  data: SupportedDeviceFormData;
}) => axios.patch<TSupportedDevice>(`/supported-devices/${id}`, data);

export default function useSupportedDevices() {
  const queryClient = useQueryClient();

  const {
    data: devices = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["supportedDevices"],
    queryFn: fetchSupportedDevices,
    select: (res) => res.data,
  });

  const createMutation = useMutation({
    mutationFn: createDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supportedDevices"] });
      toast.success("Dispositivo creado correctamente");
    },
    onError: () => {
      toast.error("Error al crear el dispositivo");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supportedDevices"] });
      toast.success("Dispositivo actualizado correctamente");
    },
    onError: () => {
      toast.error("Error al actualizar el dispositivo");
    },
  });

  return {
    devices,
    isLoading,
    error,
    reloadDevices: refetch,
    createDevice: createMutation.mutateAsync,
    updateDevice: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
