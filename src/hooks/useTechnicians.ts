import axios from "@/lib/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TTechnician } from "@/lib/types";

const fetchTechnicians = () => axios.get<TTechnician[]>("/technicians");

export default function useTechnicians() {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["technicians"],
    staleTime: Infinity,
    queryFn: fetchTechnicians,
    placeholderData: keepPreviousData,
    select: (res) => res.data,
  });

  return {
    technicians: data,
    techniciansLoading: isLoading,
    reloadTechnicians: refetch,
  };
}
