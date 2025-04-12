import axios from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/consts";
import { TTechnician } from "@/lib/types";

const fetchTechnicians = () =>
  axios.get<TTechnician[]>(`${API_URL}/technicians`);

export default function useTechnicians() {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["technicians"],
    staleTime: Infinity,
    queryFn: fetchTechnicians,
    placeholderData: keepPreviousData,
  });

  return {
    technicians: data?.data,
    techniciansLoading: isLoading,
    reloadTechnicians: refetch,
  };
}
