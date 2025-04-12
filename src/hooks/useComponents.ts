import axios from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/consts";
import { TComponent } from "@/lib/types";

const fetchComponents = () => axios.get<TComponent[]>(`${API_URL}/components`);

export default function useComponents() {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["components"],
    staleTime: Infinity,
    queryFn: fetchComponents,
    placeholderData: keepPreviousData,
  });

  return {
    components: data?.data,
    componentsLoading: isLoading,
    reloadComponents: refetch,
  };
}
