import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/lib/consts";
import { toast } from "react-toastify";

export type TSupportedDevice = {
  id: number;
  name: string;
};

export type SupportedDeviceFormData = {
  name: string;
};

const fetchSupportedDevices = async () => {
  const response = await axios.get<TSupportedDevice[]>(
    `${API_URL}/supported-devices`
  );
  return response.data;
};

const createDevice = async (data: SupportedDeviceFormData) => {
  const response = await axios.post<TSupportedDevice>(
    `${API_URL}/supported-devices`,
    data
  );
  return response.data;
};

const updateDevice = async ({
  id,
  data,
}: {
  id: number;
  data: SupportedDeviceFormData;
}) => {
  const response = await axios.patch<TSupportedDevice>(
    `${API_URL}/supported-devices/${id}`,
    data
  );
  return response.data;
};

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
